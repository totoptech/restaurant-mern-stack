import User from "../models/user";
import * as StripeApi from "../apis/stripe.api";
import * as PractiAPI from "../apis/practi.net";
import Orders from "../models/orders";
const crypto = require("crypto");
const Stripe = require("stripe");
const secret_key1 = "sk_test_QulktQd6srK86z2wT9fS3fcQ002SyxVQKi";
const secret_key2 = "sk_test_BE2ZzrUNOhf89cUObS9irD5d";
const stripe = Stripe( process.env.NODE_ENV === "development" ? secret_key1 : secret_key2 );

export function generate_payment_response(intent, order_id, res) {
  if (
    intent.status === "requires_action" &&
    intent.next_action.type === "use_stripe_sdk"
  ) {
    res.status(200).send({
      requires_action: true,
      payment_intent_client_secret: intent.client_secret,
      order_id: order_id
    });
  } else if (intent.status === "succeeded") {
    //TODO:: Make a new order document and save it to DB for future use,
    if (order_id != null) {
      Orders.findOne({ id: order_id }, (err, order) => {
        if (err || order == null) res.status(200).send({ error: err.message });
        else {
          console.log(intent.charges.data[0].payment_method_details);
          Orders.updateOne(
            { id: order_id },
            { status: "paid", stripe_intent_id: intent.id },
            (error, r_status) => {
              if (error) res.status(200).send({ error: error.message });
              else if (r_status.nModified > 0) res.status(200).send({ success: true, order_id: order_id });
              else res.status(200).send({ error: "Can't Modify" });
            }
          );
        }
      });
    }
  } else res.send({ error: "Invalid PaymentIntent status" });
}

export async function confirmPayment(payment_info, response) {
  console.log("payment info recieved::", payment_info.body);
  try {
    if (payment_info.body.payment_method_id) {
      var business = await PractiAPI.getCurrency();
      var products = await PractiAPI.getProducts();
      var user = await User.findOne({ phoneNumber: payment_info.body.phoneNumber }).exec();
      // console.log(business, products);
      if(business && products && user) {
        var currency = business.currency.code;
        var amount = 0;
        var items = [];
        payment_info.body.products.forEach(element => {
          var product = products.filter(
            p => p.id === element.productId
          )[0];
          const item = {
            unitPrice: product.price,
            label: product.name,
            quantity: element.quantity,
            productId: product.id
          };
          items.push(item);
          amount += item.unitPrice * item.quantity;
        });
        amount = Math.round(amount*100);
        stripe.paymentIntents
          .create({
            payment_method: payment_info.body.payment_method_id,
            amount: amount,
            currency: currency,
            confirmation_method: "manual",
            customer: user.customer_id,
            confirm: true
          })
          .then(intent => {
            var m_order = new Orders({
              orderID: "",
              userPhoneNumber: payment_info.body.phoneNumber,
              branch: payment_info.body.branch,
              items: items,
              date: new Date(),
              totalPaid: amount,
              stripe_intent_id: intent.id,
              status: "created",
              id: crypto.randomBytes(3 * 5).toString("base64")
            });
            m_order.save((error, r_order) => {
              if (error) response.send({ error: error.message });
              else generate_payment_response(intent, m_order.id, response);
            });
          }).catch((error) => {
            response.status(200).send({ error: error.message });
          });
      } else {
        return response.status(200).send({ error: "can't get the business and products" });
      }
    } else if (payment_info.body.payment_intent_id) {
      stripe.paymentIntents
        .confirm(payment_info.body.payment_intent_id)
        .then(intent =>
          generate_payment_response(
            intent,
            payment_info.body.order_id,
            response
          )
        ).catch((error) => {
          response.status(200).send({ error: error.message });
        });
    } else if (payment_info.body.create_method) {
      stripe.paymentMethods.create({
        type: "card",
        card: {
          number: payment_info.body.number,
          exp_month: parseInt(payment_info.body.expiry.slice(0,2)),
          exp_year: parseInt("20" + payment_info.body.expiry.slice(3,5)),
          cvc: payment_info.body.cvv,
        },
        billing_details: {
          name: payment_info.body.name
        }
      }, function(error, token) {
        if (error) response.status(200).send({ error: error.message });
        else response.status(200).send({success: true, token: token.id});
      });
    } else {
      return response.status(200).send({ error: "Invalid Payment Action" });
    }
  } catch (error) {
    return response.status(200).send({ error: error.message });
  }
}