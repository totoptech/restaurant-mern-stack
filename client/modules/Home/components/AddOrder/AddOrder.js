import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  Modal,
  IconButton,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

//import Components
import {
  close_dlg,
  radio_empty,
  radio_full,
  checkbox_empty,
  checkbox_full,
  plus_circle,
  minus_circle
} from "../../../../components/icons/icons";
import DefaultButton from "../../../../components/DefaultButton";

//import Styles
import basicstyles from "./AddOrder.css";

const StyledRadio = withStyles({
  checked: {
    color: "#51C8C2 !important"
  },
  root: {
    "&:hover": {
      backgroundColor: "#51c8c22e !important"
    }
  }
})(Radio);

const StyledCheckBox = withStyles({
  checked: {
    color: "#51C8C2 !important"
  },
  root: {
    "&:hover": {
      backgroundColor: "#51c8c22e !important"
    }
  }
})(Checkbox);

class AddOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initializeState();
    this.initialize();
  }

  initializeState = () => {
    return {
      count: 1,
      variants_selval: {},
      relatedCnt: 0,
      product_addons: [],
      subtotal: 0,
      addonInventory: {},
      variantInventory: {}
    };
  };

  initialize = () => {
    this.ordered_product = {
      baseId: "",
      baseName: "",
      variantId: "sss",
      variantName: "",
      count: 1,
      price: 0,
      addons: []
    };
    this.open_product_id = "";
  };

  componentDidUpdate() {
    const { opened_product, open, addons, onAdd, onClose } = this.props;
    if (this.open_product_id !== opened_product.id) {
      this.initialize();
      this.open_product_id = opened_product.id;
      if (open === true) {
        var vdata = {},
          adata = {};
        var length = 0;
        opened_product.related.forEach(rp => {
          const item = addons.filter(ad => ad.id === rp.id);
          if (item.length === 1) {
            if (item[0].inventoryQuantity !== undefined) {
              if (rp.rel === "variant")
                vdata = { ...vdata, [rp.id]: item[0].inventoryQuantity };
              else if (rp.rel === "addon")
                adata = { ...adata, [rp.id]: item[0].inventoryQuantity };
            }
            length++;
          }
        });
        if (length == 0) {
          if(opened_product.type == "product" && opened_product.inventoryQuantity > 0)
          {
            this.ordered_product = {
              baseId: "",
              baseName: opened_product.name,
              variantId: opened_product.id,
              variantName: "",
              count: 1,
              price: opened_product.price,
              addons: []
            };
            onAdd(this.ordered_product);
          }
          onClose();
        } else {
          this.setState({
            ...this.initializeState(),
            relatedCnt: length,
            addonInventory: adata,
            variantInventory: vdata
          });
        }
        console.log(adata, vdata);
      }
    }
  }

  handleVariant = (key, val, allkeycount) => {
    let variant = {};
    variant[key] = val;
    const { variants_selval, variantInventory, count } = this.state;
    const { addons } = this.props;
    var d_c = count;

    const variants = Object.assign(variants_selval, variant);
    const keys = Object.keys(variants);

    if (keys.length === allkeycount) {
      const { related } = this.props.opened_product;
      const variant = related.filter(rp => {
        if (rp.rel !== "variant") return false;
        let ret = true;
        keys.forEach(k => {
          if (rp.optionValues[k] !== variants[k]) {
            ret = false;
            return;
          }
        });
        return ret;
      });
      const va = variant.filter(
        v => addons.filter(ad => ad.id === v.id).length === 1
      )[0];
      if (variantInventory[va.id] > count) {
        this.ordered_product.variantId = va.id;
        d_c = d_c == 0 ? 1 : d_c;
      } else {
        d_c = variantInventory[va.id] > 0 ? variantInventory[va.id] : 0;
        this.ordered_product.variantId = "";
      }
    } else {
      this.ordered_product.variantId = "";
    }
    this.setState({
      variants_selval: variants,
      count: d_c,
      subtotal: this.calcSubtotal(
        this.ordered_product.variantId,
        this.state.product_addons,
        this.state.count
      )
    });
  };

  handleAddons = addon => {
    let addon_1 = this.props.addons.filter(ad => ad.id === addon.id)[0];
    const addon_product = {
      id: addon_1.id,
      name: addon_1.name,
      price: addon_1.price
    };
    let product_addons = [...this.state.product_addons];

    const index = product_addons.findIndex(ad => ad.id === addon_product.id);
    if (index >= 0) {
      product_addons.splice(index, 1);
    } else {
      product_addons.push(addon_product);
    }
    this.setState({
      product_addons: product_addons,
      subtotal: this.calcSubtotal(
        this.ordered_product.variantId,
        product_addons,
        this.state.count
      )
    });
  };

  calcSubtotal = (variantId, addons, count) => {
    if (this.state.relatedCnt === 0)
      return count * this.props.opened_product.price;
    const variant = this.props.addons.filter(ad => ad.id === variantId);
    let variant_price = 0;
    if (variant.length === 1) variant_price = variant[0].price;
    let addon_price = 0;
    addons.forEach(addon => {
      addon_price += addon.price;
    });
    return count * (variant_price + addon_price);
  };

  handleCountPlus = () => {
    const { count, variantInventory, addonInventory } = this.state;
    if (this.ordered_product.variantId === "") return;
    var ret = 1;
    this.state.product_addons.forEach(addon => {
      if(addonInventory[addon.id] < count + 1)
        ret = -1;
    })
    if (variantInventory[this.ordered_product.variantId] < count + 1 || ret < 0) {
      return;
    }
    this.setState({
      count: count + 1,
      subtotal: this.calcSubtotal(
        this.ordered_product.variantId,
        this.state.product_addons,
        count + 1
      )
    });
  };

  handleCountMinus = () => {
    const { count } = this.state;
    if (count <= 1) return;
    this.setState({
      count: count - 1,
      subtotal: this.calcSubtotal(
        this.ordered_product.variantId,
        this.state.product_addons,
        count - 1
      )
    });
  };

  handleAdd = () => {
    const { opened_product, onClose, onAdd } = this.props;
    const { count, product_addons, variants_selval, relatedCnt } = this.state;

    if (
      this.ordered_product.variantId &&
      this.ordered_product.variantId !== "sss" &&
      this.state.count > 0
    ) {
      let variant_keys = [];
      const type_config_keys = Object.keys(opened_product.typeConfig);
      if (type_config_keys.indexOf("options") >= 0)
        variant_keys = Object.keys(opened_product.typeConfig.options);

      this.ordered_product.baseId = this.props.opened_product.id;
      this.ordered_product.baseName = this.props.opened_product.name;
      this.ordered_product.count = count;

      if (variant_keys.length == 0) {
        this.ordered_product.variantId = "";
        this.ordered_product.variantName = "";
      } else if (this.ordered_product.variantId) {
        let variantName = "";
        Object.keys(variants_selval).forEach(val => {
          if (variantName === "") variantName += variants_selval[val];
          else variantName += ", " + variants_selval[val];
        });
        this.ordered_product.variantName = variantName;
      } else {
        onClose();
        return;
      }

      this.ordered_product.price = this.state.subtotal;
      this.ordered_product.addons = [...product_addons];
      onAdd(this.ordered_product);
      onClose();
    } else if (relatedCnt === 0) {
      this.ordered_product = {
        baseId: "",
        baseName: opened_product.name,
        variantId: opened_product.id,
        variantName: "",
        count: count,
        price: this.calcSubtotal(null, null, count),
        addons: PropTypes.arrayOf(
          PropTypes.shape({
            id: "",
            name: "",
            price: 0
          })
        )
      };
      onAdd(this.ordered_product);
      onClose();
    } else {
      onClose();
    }
  };

  render() {
    const {
      opened_product,
      open,
      onClose,
      onAdd,
      addons,
      business,
      ...other
    } = this.props;
    const {
      count,
      subtotal,
      addonInventory,
      variantInventory,
      relatedCnt
    } = this.state;

    if (opened_product.id === undefined) return <div />;

    const type_config_keys = Object.keys(opened_product.typeConfig);
    let variant_keys = [];
    if (type_config_keys.indexOf("options") >= 0)
      variant_keys = Object.keys(opened_product.typeConfig.options);

    return (
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-title"
        className={basicstyles["modal-wrapper"]}
        {...other}
      >
        <div className={basicstyles["Modal"]}>
          <div
            className={basicstyles["captain"]}
            id="modal-title"
            style={{
              backgroundImage: "url(" + opened_product.imageUrl + ")"
            }}
          >
            <IconButton
              classes={{ root: basicstyles["close"] }}
              aria-label="Close"
              onClick={onClose}
            >
              {close_dlg()}
            </IconButton>
          </div>
          <div className={clsx(basicstyles["wrapper"])}>
            <div className={basicstyles["content"]}>
              <div className={basicstyles["description"]}>
                <h2 className={basicstyles["name"]}>{opened_product.name}</h2>
                <p>
                  {opened_product.description &&
                    (opened_product.description.length > 67
                      ? opened_product.description.substr(0, 67) + "..."
                      : opened_product.description)}
                </p>
              </div>
              <div className={basicstyles["variants"]}>
                {variant_keys.map(key => {
                  const variant = opened_product.typeConfig.options[key];
                  const values = Object.keys(variant.values);

                  return (
                    <div key={key} className={basicstyles["variant"]}>
                      <div className={basicstyles["head"]}>{variant.label}</div>
                      <FormControl
                        component="fieldset"
                        className={basicstyles["body"]}
                        fullWidth
                      >
                        <RadioGroup
                          aria-label={variant.label}
                          name={variant.label}
                          // value={variants_selval[key]}
                          onChange={e =>
                            this.handleVariant(
                              key,
                              e.target.value,
                              variant_keys.length
                            )
                          }
                        >
                          {values.map((v, i) => (
                            <FormControlLabel
                              key={v}
                              value={v}
                              control={
                                <StyledRadio
                                  checkedIcon={radio_full()}
                                  icon={radio_empty()}
                                />
                              }
                              label={v}
                              classes={{
                                root: basicstyles["form-control"],
                                label: basicstyles["label"]
                              }}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </div>
                  );
                })}
                {this.ordered_product.variantId != "" && (
                  <div className={basicstyles["price"]}>
                    {business.currency.symbol}
                    {this.ordered_product.variantId === "sss"
                      ? relatedCnt > 0
                        ? "0.00"
                        : opened_product.price.toFixed(2)
                      : addons.filter(
                          ad => ad.id === this.ordered_product.variantId
                        )[0].price}
                  </div>
                )}
                {this.ordered_product.variantId == "" && (
                  <div className={basicstyles["invalid"]}>Not Available</div>
                )}
              </div>
              <div className={basicstyles["addons"]}>
                {opened_product.related.length > 0 && (
                  <div className={basicstyles["head"]}>ADDONS</div>
                )}
                <FormControl
                  component="fieldset"
                  className={basicstyles["body"]}
                  fullWidth
                >
                  {opened_product.related.map((v, i) => {
                    if (v.rel !== "addon") return;
                    return (
                      <div key={i} className={basicstyles["addon"]}>
                        <FormControlLabel
                          control={
                            <StyledCheckBox
                              checkedIcon={checkbox_full()}
                              icon={checkbox_empty()}
                              value={v.id}
                              onChange={() => this.handleAddons(v)}
                            />
                          }
                          label={
                            <div className={basicstyles["addon_label"]}>
                              <span>
                                {addons.filter(ad => ad.id === v.id)[0].name}
                              </span>
                            </div>
                          }
                          disabled={
                            !(addonInventory && addonInventory[v.id] > count)
                          }
                          classes={{
                            root: basicstyles["form-control"],
                            label: basicstyles["label"]
                          }}
                        />
                        {addonInventory && addonInventory[v.id] > count && (
                          <div className={basicstyles["price"]}>
                            {business.currency.symbol}
                            {addons.filter(ad => ad.id === v.id)[0].price}
                          </div>
                        )}
                        {!(addonInventory && addonInventory[v.id] > count) && (
                          <div className={basicstyles["invalid"]}>
                            Not Available
                          </div>
                        )}
                      </div>
                    );
                  })}
                </FormControl>
              </div>
            </div>
            <div className={basicstyles["footer"]}>
              <div className={basicstyles["counter"]}>
                <button
                  className={basicstyles["control"]}
                  onClick={this.handleCountMinus}
                >
                  {minus_circle()}
                </button>
                <span className={basicstyles["count"]}>{count}</span>
                <button
                  className={basicstyles["control"]}
                  onClick={this.handleCountPlus}
                >
                  {plus_circle()}
                </button>
              </div>
              <DefaultButton
                className="d-flex align-items-center justify-content-between"
                onClick={this.handleAdd}
              >
                <span>Add Card</span>
                <span>
                  {business.currency.symbol}
                  {subtotal.toFixed(2)}
                </span>
              </DefaultButton>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

AddOrder.propTypes = {
  open: PropTypes.bool.isRequired,
  addons: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired
    })
  ).isRequired,
  business: PropTypes.shape({
    currency: PropTypes.shape({
      code: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  opened_product: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    imageUrl: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
    typeConfig: PropTypes.shape({
      options: PropTypes.object
    }),
    related: PropTypes.array
  }).isRequired,
  onAdd: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default AddOrder;
