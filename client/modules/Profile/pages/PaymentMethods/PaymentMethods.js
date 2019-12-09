import React, { Fragment } from "react";
import { connect } from "react-redux";

//import Component
import { plus } from "../../../../components/icons/icons";
import PayForm from "../../components/PayForm/PayForm";
import CCModal from "../../../../components/CCModal/CCModal";

//import Styles
import styles from "./PaymentMethods.css";
import { add_card, edit_card, delete_card } from "../../ProfileActions";
import { callApi } from "../../../../util/apiCaller";

class PaymentMethods extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.edit = null;
  }

  handleClose = () => {
    this.setState({ open: false });
    this.edit = null;
  };

  handleSubmit = ccdata => {
    console.log(ccdata);
    if (this.edit != null) {
      this.props.dispatch(
        edit_card(ccdata, this.props.accounts.phonenumber, this.edit.id, this.props.accounts.token)
      );
    } else {
      this.props.dispatch(add_card(ccdata, this.props.accounts.phonenumber, this.props.accounts.token));
    }
    this.setState({ open: false });
    this.edit = null;
  };

  handleAdd = () => {
    this.setState({ open: true });
    this.edit = null;
  };

  handleEdit = id => {
    callApi("user/get-card", "post", {
      id: id,
      phoneNumber: this.props.accounts.phonenumber
    }).then(res => {
      if (res.status == "success") {
        const mini_card = this.props.accounts.cards.filter(m_c => m_c.id === id)[0];
        const card = {
          number: "**** **** **** " + mini_card.last4digit,
          cvv: "***",
          expiry: res.data.expiry,
          name: res.data.name,
        };
        this.edit = card;
        this.setState({ open: true });
      }
    });
  };

  handleDelete = id => {
    this.props.dispatch(delete_card(this.props.accounts.phonenumber, id, this.props.accounts.token));
  };

  render() {
    const { open } = this.state;
    const { accounts } = this.props;

    return (
      <Fragment>
        <p className={styles["stitle"]}>Payment Methods</p>
        {accounts.cards.map((card, index) => (
          <PayForm
            key={index}
            issuer={card.issuer}
            last4digit={card.last4digit}
            onEdit={e => this.handleEdit(card.id)}
            onDelete={e => this.handleDelete(card.id)}
          />
        ))}
        <div className={styles["addmore"]} onClick={this.handleAdd}>
          <div className={styles["icon"]}>{plus()}</div>
          Add Credit Card
        </div>
        <CCModal
          open={open}
          onClose={this.handleClose}
          onSubmit={this.handleSubmit}
          editdata={this.edit}
        />
      </Fragment>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state, props) {
  return {
    accounts: state.accounts
  };
}

// PaymentMethods.propTypes = {
//   branch: PropTypes.object.isRequired,
//   business: PropTypes.object.isRequired,
//   products: PropTypes.array.isRequired,
//   order_bag: PropTypes.array.isRequired,
//   dispatch: PropTypes.func.isRequired
// };

export default connect(mapStateToProps)(PaymentMethods);
