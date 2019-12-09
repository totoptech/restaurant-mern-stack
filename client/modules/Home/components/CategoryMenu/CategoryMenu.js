import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { ExpandMore } from "@material-ui/icons";

//import Styles
import styles from "./CategoryMenu.css";
import CategoryMenuItem from "./CategoryMenuItem/CategoryMenuItem";

class CategoryMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
      hiddenMenu: [],
      isMounted: false,
    };
    this.productmenu = {
      items: [],
      more: 126,
      parent: null
    };
  }

  calcWidth = () => {
    const { items, more, parent } = this.productmenu;
    let navwidth = 0;
    let hidden = [];

    let availablespace = parent.clientWidth - more;
    items.forEach((block, i) => {
      navwidth += block.clientWidth;
      if (navwidth > availablespace) {
        hidden = [...hidden, i];
      }
    });
    if(this.state.hiddenMenu.length !== hidden.length)
      this.setState({ hiddenMenu: hidden});
  };

  componentDidMount() {
    this.intervalUpdate = setInterval(this.calcWidth, 50);
  }

  componentWillUnmount() {
    clearInterval(this.intervalUpdate);
  }

  handleChange = (index) => {
    this.setState({ selected: index });
    const { onCategoryChange } = this.props;
    onCategoryChange(index);
  };

  getRef = (ref, i) => {
    this.productmenu.items[i] = ref;
  };

  render() {
    const { categories, className, onCategoryChange, ...other } = this.props;
    const { selected, hiddenMenu } = this.state;

    return (
      <div className={styles["horizontal-menu"]}>
        <nav
          role="navigation"
          className={clsx(className, styles["wrapper"])}
          {...other}
        >
          <ul ref={n => (this.productmenu.parent = n)}>
            {categories.map((cat, index) => {
              return (
                <CategoryMenuItem key={index} i={index} getRef={this.getRef}>
                  <button
                    onClick={() => this.handleChange(index)}
                    className={selected === index ? styles["active"] : ""}
                  >
                    {cat}
                  </button>
                </CategoryMenuItem>
              );
            })}
          </ul>
        </nav>
        <li className={clsx(styles["more"], (hiddenMenu.length === 0 ? styles["hidden"] : ""))}>
          <button>
            More
            <ExpandMore style={{ color: "#00A697" }} />
          </button>
            <ul
              className={clsx(
                styles["more-dropdown"]
              )}
            >
              {hiddenMenu.map((i, index) => {
                return (
                  <li key={index}>
                    <button
                      onClick={() => this.handleChange(i)}
                      className={selected === i ? styles["active"] : ""}
                    >
                      {categories[i]}
                    </button>
                  </li>
                );
              })}
            </ul>
        </li>
      </div>
    );
  }
}

CategoryMenu.propTypes = {
  onCategoryChange: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string)
};

export default CategoryMenu;
