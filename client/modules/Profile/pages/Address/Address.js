import React, { Fragment } from "react";
import clsx from "clsx";
import { connect } from "react-redux";
import { Modal, Button, withStyles } from "@material-ui/core";

//import Component
import AddressForm from "../../components/AddressForm/AddressForm";
import { plus, fa_address } from "../../../../components/icons/icons";

//import Actions
import {
  add_address,
  update_address,
  delete_address
} from "../../ProfileActions";

//import Styles
import styles from "./Address.css";
import LocationSearchInput from "../../../../components/FormControl/LocationSearchInput/LocationSearchInput";

const GreyButton = withStyles(theme => ({
  root: {
    fontSize: "17px",
    backgroundColor: "#4e4e4e !important",
    color: "white",
    borderRadius: "26px",
    marginLeft: "20px",
    textTransform: "none !important",
    marginTop: "20px",
    padding: "14px 29px",
    transition: "all 0.3s ease 0s"
  }
}))(Button);

class Address extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      delivery_address: {
        id: "",
        type: "",
        street: {
          seperate_address: [],
          location: {
            lat: 0.0,
            lng: 0.0
          },
          address: "",
          postalCode: ""
        },
        flatNo: "",
        buildingNo: ""
      }
    };
    this.initialized = false;
  }

  handleChange = event => {
    const { delivery_address } = this.state;
    if (event.target.name === "postalCode") {
      this.setState({
        delivery_address: {
          flatNo: delivery_address.flatNo,
          buildingNo: delivery_address.buildingNo,
          street: {
            ...delivery_address.street,
            postalCode: event.target.value
          }
        }
      });
      return;
    }
    if (event.target.name === "special_instructions") {
      this.setState({ special_instructions: event.target.value });
      return;
    }
    this.setState({
      delivery_address: {
        ...delivery_address,
        [event.target.name]: event.target.value
      }
    });
  };

  handleChangeAddress = address => {
    const { delivery_address } = this.state;
    this.setState({
      delivery_address: { ...delivery_address, street: { address } }
    });
  };

  handleSelectAddress = obj => {
    const { delivery_address } = this.state;
    console.log(obj);
    this.setState({ delivery_address: { ...delivery_address, street: obj } });
  };

  hadleSubmit = event => {
    event.preventDefault();
    if (this.state.delivery_address.id === "") {
      this.props.dispatch(
        add_address({ addr: this.state.delivery_address, token: this.props.token })
      );
    } else {
      this.props.dispatch(
        update_address({ addr: this.state.delivery_address, token: this.props.token })
      );
    }
    this.setState({ show: false });
  };

  handleEdit = id => {
    const address = this.props.addresses.filter(addr => addr.id === id);
    if (address.length !== 1) {
      this.setState({ show: false });
      return;
    }

    this.setState({
      delivery_address: {
        id: id,
        street: address[0].street,
        flatNo: address[0].flatNo,
        buildingNo: address[0].buildingNo,
        type: address[0].type
      },
      show: true
    });
  };

  handleDelete = id => {
    const address = this.props.addresses.filter(addr => addr.id === id);
    if (address.length !== 1) {
      return;
    }
    this.props.dispatch(delete_address({ id: id, token: this.props.token }));
  };

  handleCreate = () => {
    this.setState({
      delivery_address: {
        id: "",
        type: "",
        street: {
          seperate_address: [],
          location: {
            lat: 0.0,
            lng: 0.0
          },
          address: "",
          postalCode: ""
        },
        flatNo: "",
        buildingNo: ""
      },
      show: true
    });
  };

  handleCloseModal = () => {
    this.setState({ show: false });
  };

  render() {
    const { show, delivery_address } = this.state;
    const { addresses } = this.props;

    return (
      <React.Fragment>
        <p className={styles["stitle"]}> Address</p>
        <div style={{ overflow: "auto" }}>
          {addresses != null &&
            addresses.map((address, id) => (
              <AddressForm
                key={id}
                onEdit={() => this.handleEdit(address.id)}
                onDelete={() => this.handleDelete(address.id)}
                type={address.type}
                addr={address.street.address}
              />
            ))}
        </div>
        <button
          className={styles["addmore"]}
          onClick={() => this.handleCreate()}
        >
          <div className={styles["icon"]}>{plus()}</div>
          Add Address
        </button>
        <Modal
          open={show}
          onClose={this.handleCloseModal}
          aria-labelledby="modal-address"
        >
          <form
            className={clsx(styles["form"], styles["body-container"])}
            onSubmit={this.hadleSubmit}
          >
            <h4 className={styles["form-header"]}>Delivery Address</h4>
            <div className={styles["form-group"]}>
              <label className={styles["label"]}>Location</label>
              <div className={styles["input-group"]}>
                <LocationSearchInput
                  className={clsx(styles["form-control"], styles["street"])}
                  onChange={this.handleChangeAddress}
                  onSelect={this.handleSelectAddress}
                  required={true}
                  value={delivery_address.street.address}
                />
                <div className={styles["icon"]}>{fa_address()}</div>
              </div>
            </div>
            <div className={clsx(styles["form-group"])}>
              <label className={styles["label"]}>Post Code</label>
              <input
                className={styles["form-control"]}
                placeholder="E16JE"
                value={delivery_address.street.postalCode}
                onChange={this.handleChange}
                style={{ textTransform: "uppercase" }}
                name="postalCode"
                required
              />
            </div>
            <div className={styles["form-group"]}>
              <label className={styles["label"]}>Flat or House Number</label>
              <input
                className={styles["form-control"]}
                placeholder="Flat 4"
                value={delivery_address.flatNo}
                onChange={this.handleChange}
                name="flatNo"
                required
              />
            </div>
            <div className={styles["form-group"]}>
              <label className={styles["label"]}>
                Business or Building Name
              </label>
              <input
                className={styles["form-control"]}
                placeholder="Building"
                value={delivery_address.buildingNo}
                onChange={this.handleChange}
                name="buildingNo"
                required
              />
            </div>
            <div className={styles["form-group"]}>
              <label className={styles["label"]}>Type of Address</label>
              <input
                className={styles["form-control"]}
                placeholder="Home"
                value={delivery_address.type}
                onChange={this.handleChange}
                name="type"
                required
              />
            </div>
            <div className={styles["button-group"]}>
              <GreyButton type="submit">Save</GreyButton>
              <GreyButton type="button" onClick={this.handleCloseModal}>
                Cancel
              </GreyButton>
            </div>
          </form>
        </Modal>
      </React.Fragment>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    addresses: state.accounts.address,
    token: state.accounts.token
  };
}

export default connect(mapStateToProps)(Address);
