import User from "../models/user";
import Orders from "../models/orders";
import Address from "../models/address";
import Card from "../models/card";
import * as PractiNet from "../apis/practi.net";
import * as SumUp from "../apis/sum.up";
var mandrill = require('mandrill-api/mandrill');
const Stripe = require("stripe");
const secret_key1 = "sk_test_QulktQd6srK86z2wT9fS3fcQ002SyxVQKi";

const secret_key2 = "sk_test_BE2ZzrUNOhf89cUObS9irD5d";
const stripe = Stripe( process.env.NODE_ENV === "development" ? secret_key1 : secret_key2 );

const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');

const client_id = "9yyy-ibH3I1-Om-vrRwAzRDIy8KR";
const client_secret =
  "2d8df4e6726dffa31c7207d06d4a23bf64e672375ea8af9fbf496594aa2f33c6";
const redirect_uri = "http://165.22.195.119:8000/redirect";
const refresh_token =
  "f425990ec2d09fba028a5e1284fafa7651ff61665651105f1eacf8679274e13f";
//8299f18195cb9c7cbf6c260aeb01910b6f9041ed4f3d08acace0ee5e2ae7fe51
export function createSumUpCustomer(usrData, res) {
  let body = {
    client_id: client_id,
    client_secret: client_secret,
    grant_type: "refresh_token",
    // "refresh_token":"95e41f393a42c353d76e66e4252967db900d4271c4e6c99eb845a7fbea1012c4"
    refresh_token: refresh_token
  };
  SumUp.getTokenByRefreshToken(body, result => {
    console.log(result.data.access_token, usrData.customer_id);

    /**TODO
     * Create Customer for Payment with Tokenized User
     */

    const req_body = {
      token: result.data.access_token,
      url: "/customers",
      method: "POST",
      data: {
        customer_id: usrData.customer_id,
        personal_details: {
          first_name: usrData.firstname,
          last_name: usrData.lastname,
          email: usrData.email,
          phone: usrData.phoneNumber,
          address: {
            line1: "Ollenhauer Str. 60",
            line2: "Wohnungsnummer 3",
            country: "Germany",
            postal_code: "70437",
            city: "Stuttgart"
          }
        }
      }
    };

    SumUp.paymentApi(req_body, (error, customer) => {
      if (error) {
        console.log("error occured while creating a new customer");
        res.status(200).send(error.message);
      } else {
        console.log("Created Customer:", customer);
        //save data to db
        let user = new User(usrData);
        user.save((err, saved) => {
          if (err) {
            res.status(200).send("failed");
          } else res.status(200).send(usrData.token);
        });
      }
    });
  });
}

export function tokenizeCard(req, res) {
  User.findOne({ phoneNumber: req.body.phoneNumber }).exec((err, user) => {
    if (err) res.status(200).send(err.message);
    //if user not exists
    else {
      if (user) {
        const customer_id = user.customer_id;
        const req_body = {
          token: client_id,
          url: "/customers/" + customer_id + "/payment-instruments",
          method: "POST",
          data: {
            type: "card",
            card: {
              name: req.body.name,
              number: req.body.cardNumber,
              expiry_month: req.body.month,
              expiry_year: req.body.year,
              cvv: req.body.cvv
            }
          }
        };

        SumUp.paymentApi(req_body, (error, customer) => {
          if (error) {
            console.log("error occured while tokenizing for a customer");
            res.status(200).send(error.message);
          } else {
            console.log("Tokenized Customer:", customer);
            //save data to db(update db)
            User.updateOne(
              { phoneNumber: req.body.phoneNumber },
              {
                payment: true,
                paymentToken: customer.data.token
              },
              function(er, re) {
                if (er) res.status(200).send("failed");
                else res.status(200).send("success");
              }
            );
          }
        });
      } else {
        res.status(200).send("no user found");
      }
    }
  });
}

export function makePayment(req, res) {
  User.findOne({ phoneNumber: req.body.phoneNumber }).exec((err, user) => {
    if (err) res.status(200).send(err.message);
    //if user not exists
    else {
      if (user) {
        /*make order */
        let order_reqBody = {
          status: req.body.status,
          branchId: req.body.branch,
          lines: [
            {
              quantity: req.body.lines[0].quantity,
              items: []
            }
          ],
          totalAmounts: {
            discount: "0",
            tax: "1",
            amount: req.body.amount
          },
          attachments: [
            {
              type: "practi:external-order",
              payload: {
                provider: "sumup",
                payments: [
                  {
                    subtype: "buy breads",
                    reference: "no reference",
                    amount: {
                      gross: req.body.amount
                    }
                  }
                ]
              }
            }
          ]
        };

        if (req.body.lines[0].items.length > 0) {
          req.body.lines[0].items.forEach(element => {
            let item = {
              quantity: element.quantity,
              productId: element.productId,
              unitPrice: element.unitPrice,
              label: element.label
            };
            // console.log("request body lines:", order_reqBody.lines[0], item);
            order_reqBody.lines[0].items.push(item);
          });
        }

        PractiNet.makeOrder(order_reqBody, (e, r) => {
          if (e) res.status(200).send("failed");
          //if order failed send eror
          else {
            let itemNames = [];
            r.data.lines.forEach(items => {
              items.items.forEach(item => {
                itemNames.push(item.label);
              });
            });
            let m_order = new Orders({
              orderID: r.data.id,
              branchName: r.data.branch.name,
              items: itemNames,
              totalPaid: r.data.totalAmounts.amountPaid,
              userPhoneNumber: user.phoneNumber
            });
            m_order.save((ex, order) => {
              if (ex) res.status(200).send("failed");
              else res.status(200).send(order);
            });
            // res.status(200).send("success") //if order succed, send success
          }
        });
        /**Checkout And Order */
        /*
                const paymentToken = user.paymentToken;
                let body = {
                    "client_id":client_id,
                    "client_secret":client_secret,
                    "grant_type":"refresh_token",
                    // "refresh_token":"95e41f393a42c353d76e66e4252967db900d4271c4e6c99eb845a7fbea1012c4"
                    "refresh_token":refresh_token
                }
                SumUp.getTokenByRefreshToken(body, (result) => {
                    const req_body = {
                        token: result.data.access_token,
                        url: "/checkouts",
                        method: "POST",
                        data: {
                            "checkout_reference": crypto.randomBytes(3*4).toString('base64'),
                            "amount": req.body.amount,
                            "currency": req.body.currency,
                            "pay_to_email": "practi@sumup.com",
                            "description": req.body.description,
                        }
                    }

                    SumUp.paymentApi(req_body, (error, reference) => {
                        if(error){
                            console.log("error occured while creating checkout");
                            res.status(200).send(JSON.stringify(error))
                        } else {
                            console.log("Checkout reference:", reference);
                            //save data to db(update db)
                            const checkout_id = reference.id;   //checkout id
                            //TODO: Confirm Checkout with tokenized card
                            const conf_body = {
                                token: result.data.access_token,
                                url: "/checkouts/" + checkout_id,
                                method: "POST",
                                data: {
                                    "payment_type": "card",
                                    "token": paymentToken,
                                    "customer_id": user.customer_id
                                }
                            }

                            //confirm payment
                            SumUp.paymentApi(conf_body, (issue, payment_result) => {
                                if(issue) res.status(200).send("failed")
                                else {
                                    if(payment_result.status == "PAID")
                                    {
                                        // res.status(200).send(payment_result)
                                        let order_reqBody = {
                                            "status": req.body.status,
                                            "branchId": req.body.branch,
                                            "lines": [{
                                                "quantity": req.body.lines[0].quantity,
                                                "items": []
                                            }],
                                            "totalAmounts": {
                                                "discount": "0",
                                                "tax": "1",
                                                "amount": req.body.amount
                                            },
                                            "attachments": [{
                                                "type": "practi:external-order",
                                                "payload": {
                                                    "provider": "sumup",
                                                    "payments": [
                                                        {
                                                            "subtype": "buy breads",
                                                            "reference": "no reference",
                                                            "amount": {
                                                                "gross": req.body.amount
                                                            }
                                                        }
                                                    ]
                                                }
                                            }]
                                        }

                                        if(req.body.lines[0].items.length > 0) {
                                            req.body.lines[0].items.forEach(element => {
                                                let item = {
                                                    "quantity": element.quantity,
                                                    "productId": element.productId,
                                                    "unitPrice": element.unitPrice,
                                                    "label": element.label
                                                }
                                                // console.log("request body lines:", order_reqBody.lines[0], item);
                                                order_reqBody.lines[0].items.push(item)
                                            });
                                        }

                                        PractiNet.makeOrder(order_reqBody, (e, r) => {
                                            if(e) res.status(200).send("failed");  //if order failed send eror
                                            else {
                                                
                                                let m_order = new Orders({
                                                    orderID: r.data.id,
                                                    userPhoneNumber: user.phoneNumber,
                                                })
                                                Orders.save((ex, order) => {
                                                    if(ex) res.status(200).send("failed")
                                                    else res.status(200).send(order)
                                                })
                                                // res.status(200).send("success") //if order succed, send success
                                            }
                                        })
                                    }
                                    else
                                        res.status(200).send(payment_result.status);
                                }
                            })
                        }
                    })
                })*/
      } else {
        res.status(200).send("no user found");
      }
    }
  });
}

export function getOrders(req, res) {
  var orders_list = [];
  User.findOne({ phoneNumber: req.body.phoneNumber }).exec((e1, user) => {
    if (e1 || user === null) res.status(203).send({ status: "error", msg: "db error 325 - " + err.message });
    else {
      Orders.find(
        { userPhoneNumber: user.phoneNumber },
        // { _id: 0, _v: 0, date: 1, totalPaid: 1, orderID: 1, location: 1, status: 1 }
        ).sort({date: 'desc'}).exec((e2, orders) => {
        if (e2 || orders === null) res.status(200).send({ status: "error", msg: "db error 331 - " + err.message });
        else {
          /**
           * Get Orders from Local DB and send order IDs to front-end
           */
          res.status(200).send({status: 'success', data: orders});
          /**
           * Get Orders from Backoffice api and send result to front-end
           */
          // const order_len = orders.length;
          // let index = 0;
          // orders.forEach(element => {
          //     PractiNet.getOrder({order_id: element.orderID}, (e3, order_detail) => {
          //         if(e3) index ++
          //         else {
          //             console.log("order details:", order_detail);
          //             orders_list.push(order_detail.data);
          //         }
          //         if(index == order_len){
          //             res.status(200).send(orders_list);
          //         }
          //     });
          // });
        }
      });
    }
  });
}

export function checkoutPayment(req, res) {
  User.findOne({ phoneNumber: req.body.phoneNumber }).exec((err, user) => {
    if (err) res.status(200).send(err);
    //if user not exists
    else {
      if (user) {
        // const paymentToken = user.paymentToken;
        let body = {
          client_id: client_id,
          client_secret: client_secret,
          grant_type: "refresh_token",
          // "refresh_token":"95e41f393a42c353d76e66e4252967db900d4271c4e6c99eb845a7fbea1012c4"
          refresh_token: refresh_token
        };
        SumUp.getTokenByRefreshToken(body, result => {
          const req_body = {
            token: result.data.access_token,
            url: "/checkouts",
            method: "POST",
            data: {
              checkout_reference: crypto.randomBytes(3 * 4).toString("base64"),
              amount: req.body.amount,
              currency: req.body.currency,
              pay_to_email: "practi@sumup.com",
              description: req.body.description
            }
          };

          SumUp.paymentApi(req_body, (error, reference) => {
            if (error) {
              console.log("error occured while creating checkout");
              res.status(200).send(error);
            } else {
              console.log("Checkout reference:", reference.data);
              //save data to db(update db)
              const checkout_id = reference.data.id; //checkout id
              //TODO: Confirm Checkout with tokenized card
              const conf_body = {
                token: result.data.access_token,
                url: "/checkouts/" + checkout_id,
                method: "PUT",
                data: {
                  payment_type: "card",
                  card: {
                    name: req.body.card.name,
                    number: req.body.card.number,
                    expiry_month: req.body.card.month,
                    expiry_year: req.body.card.year,
                    cvv: req.body.card.cvv
                  }
                }
              };

              //confirm payment
              SumUp.paymentApi(conf_body, (issue, payment_result) => {
                console.log("issue::", issue);
                console.log("payment result::", payment_result.data);
                if (issue) res.status(200).send("failed");
                else {
                  if (payment_result.status == "PAID")
                    res.status(200).send(payment_result.data);
                  else res.status(200).send(payment_result.data);
                }
              });
            }
          });
        });
      } else {
        res.status(200).send("no user found");
      }
    }
  });
}

//authenticate with client id
export function sumupAuthentication(req, res) {
  let body = {
    response_type: "code",
    client_id: client_id,
    redirect_uri: redirect_uri,
    scope:
      "payments%20user.app-settings%20transactions.history%20user.profile_readonly",
    state: "2cFCsY36y95lFHk4"
  };
  SumUp.sumupAuthorize(body, (error, result) => {
    // console.log("sumupAthentication result: ", error, result);
  });
}

//get token, refresh token with authentication code returned from sumup
export function sumupGetToken(req, res) {
  const code = req.query.code;
  const state = req.query.state;
  console.log(code, state);
  let body = {
    grant_type: "authorization_code",
    client_id: client_id,
    client_secret: client_secret,
    code: code
  };
  SumUp.sumupGetToken(body, (error, result) => {
    console.log("accesstoken result: ");
  });
}

//get token with refresh token
export function getTokenByRefreshToken(req, res) {
  let body = {
    client_id: client_id,
    client_secret: client_secret,
    grant_type: "refresh_token",
    refresh_token: refresh_token
  };
  SumUp.getTokenByRefreshToken(body, result => {
    // res.status(200).send(result);
    // console.log(result.data);
    res.status(200).send(result.data.access_token);
  });
}

export function testOrder(req, res) {
  Orders.findOne({ id: req.body.order_id }).exec((err, r_order) => {
    if (err || r_order === null) res.status(200).send({ status: "error", msg: "order db error 362 - " + err.message });
    else {
      User.findOne({ phoneNumber: req.body.phoneNumber }).exec(async (err, user) => {
        if (err || user === null) res.status(200).send({ status: "error", msg: "user db error 365 - " + err.message });
        else {
          try{
            var deliveryAddressId = null;
            if(req.body.delivery_data.type == "delivery") {
              var result = await PractiNet.addAddress(
                {
                  countryCode:
                    req.body.delivery_address.street.seperate_address.countryCode,
                  state: req.body.delivery_address.street.seperate_address.state,
                  city: req.body.delivery_address.street.seperate_address.city,
                  streetLine1:
                    req.body.delivery_address.street.seperate_address.streetLine1,
                  streetLine2:
                    req.body.delivery_address.street.seperate_address.streetLine2,
                  postalCode: req.body.delivery_address.street.postalCode,
                  title: req.body.delivery_address.street.address
                },
                { token: user.token }
              );
              if(result)
                deliveryAddressId = result.id;
            }
            let order_reqBody = {
              status: "new",
              branchId: r_order.branch.b_ID,
              lines: [
                {
                  quantity: r_order.items.length,
                  items: r_order.items
                }
              ],
              totalAmounts: {
                discount: "0",
                tax: "1",
                amount: r_order.totalPaid / 100.0
              },
              attachments: [
                {
                  type: "practi:external-order",
                  payload: {
                    provider: r_order.branch.b_ID,
                    payments: [
                      {
                        subtype: "stripe",
                        reference: r_order.stripe_intent_id,
                        amount: {
                          gross: r_order.totalPaid
                        }
                      }
                    ]
                  }
                }
              ],
              fulfillment: req.body.delivery_data.type,
              requestedProcessingDate: req.body.delivery_data.time,
              notes: req.body.note,
              deliveryAddressId
            };
            PractiNet.makeOrder(order_reqBody, {token: user.token}, (err, r) => {
              if (err) res.status(200).send({ status: "error", msg: "addaddress error 419 - " + err.message });
              else {
                Orders.updateOne(
                  { id: req.body.order_id },
                  {
                    orderID: r.data.id,
                    location: req.body.delivery_address.street.location,
                    status: "accept"
                  },
                  (err, r_status) => {
                    if (err) res.status(200).send({ status: "error", msg: "order db error 432 - " + err.message });
                    else if (r_status.nModified > 0) res.status(200).send({ status: "success", data: r.data });
                    else res.status(200).send({ status: "error", msg: "order db error 441 - can't modifiy" });
                  }
                );
              }
            });
          } catch (err) {
            res.status(200).send({ status: "error", msg: "addaddress error 462 - " + err.message });
          }
        }
      });
    }
  });
}

export function phoneVerification(req, res) {
  const req_body = req.body;
  User.findOne({ phoneNumber: req.body.phoneNumber }).exec((err, user) => {
    if (err) {
      res.status(200).send(err);
    } else {
      // TODO: check if user already exists
      if (user) res.status(200).send("already exists");
      //if exists don't register
      else {
        //if not save user info and send success
        //TODO: Process Phone verification with
        PractiNet.practiAuth(req_body, result => {
          // console.log(result)
          if (result.data == "") {
            res.status(200).send("success");
          } else {
            console.log(result.message);
            res.status(200).send(result);
          }
        });
      }
    }
  });
}

export function signup(req, res) {
  //TODO: check phone number confirmation, save user data to DB with accessToken
  PractiNet.practiConfirm(
    { phoneNumber: req.body.phoneNumber, smsCode: req.body.code },
    result => {
      // console.log(result.data, result.response.data);

      /*Test Version
        var user = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: req.body.password,
            token: "my access key",
            payment: false,
            customer_id: crypto.randomBytes(3*4).toString('base64'),
        }
        this.createSumUpCustomer(user, res);
        */
      /******************/
      /* Actual Version */
      if (result.data) {
        var user = {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          phoneNumber: req.body.phoneNumber,
          password: req.body.password,
          token: result.data.accessKey.token,
          payment: false,
          paymentToken: null,
          customer_id: crypto.randomBytes(3 * 4).toString("base64")
        };

        let m_user = new User(user);
        User.findOne({ phoneNumber: req.body.phoneNumber }, (er, data) => {
          if (er) res.status(200).send("failed");
          else if (data) res.status(200).send("user already exists");
          else {
            bcrypt.genSalt(10, function(e1, salt) {
              bcrypt.hash(m_user.password, salt, function(err, hash) {
                if (e1) res.status(200).send("failed");
                else {
                  m_user.password = hash;
                  m_user.save((err, saved) => {
                    if (err) {
                      res.status(200).send("failed");
                    }
                    // res.status(200).send("success")
                    else res.status(200).send(user.token);
                  });
                }
              });
            });
          }
        });
        createSumUpCustomer(user, res);
      } else {
        console.log("failed", result.response.data);
        res.status(200).send("failed with Practi");
      }
    }
  );
}

export function login(req, res) {
  User.findOne({ phoneNumber: req.body.phoneNumber }).exec((err, user) => {
    if (err) {
      res.status(200).send(err);
    } else if (user == null) res.status(200).send("no phone number");
    else {
      console.log("I am login", user);
      // TODO: check if user already exists
      bcrypt.compare(req.body.password, user.password, function(e1, isMatch) {
        if (e1) res.status(200).send("password doesn't match");
        else if (isMatch) {
          //if exists, get accessToken
          res
            .status(200)
            .send({ token: user.token, firstname: user.firstname });
        } else res.status(200).send("password doesn't match");
      });
    }
  });
}

export function getUserProfile(req, res) {
  User.findOne({ token: req.body.token }).exec(async (error, user) => {
    if (error || user == null) res.status(203).send({ status: "error", msg: "get user profile error 678 - " + error.message });
    else {
      // TODO: check if user already exists
      //if exists, get accessToken
          let address = [];
          if (user.address != null) {
            try {
              address = await Address.find({
                id: { $in: user.address }
              });
            } catch (error) {
              console.log("error :", error);
              address = [];
            }
          }
          res.status(200).send({
              status: "success",
              data: {
                token: user.token,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                birthday: user.birthday,
                phonenumber: user.phoneNumber,
                address: address,
                cards: user.cards,
              }
            });
          // Address.find({}).exec((error, addresses) => {
          //   if (error) res.status(203).send({ status: "error", msg: "get user profile error 651 - " + error.message });
          //   else {
          //     if(addresses != null) {
          //       addresses.forEach(addr => {
          //         if (user.address == null) return;
          //         if (user.address.filter(a => a === addr.id).length === 1) {
          //           address.push(addr);
          //         }
          //       });
          //     }
          //   }
          // });
    }
  });
}

export function updateUserProfile(req, res) {
  console.log("Update", req);
  User.findOne({ token: req.body.token }).exec((error, user) => {
    if (error || user == null) res.status(203).send({ status: "error", msg: "update user profile error 678 - " + error.message });
    else {
      // TODO: check if user already exists
      //if exists, get accessToken
      bcrypt.genSalt(10, function(e1, salt) {
        bcrypt.hash(req.body.password, salt, function(e2, hash) {
          User.updateOne(
            { token: req.body.token },
            {
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              email: req.body.email,
              birthday: req.body.birthday,
              password: hash
            }
          ).exec((error, status) => {
            if (error) res.status(200).send({ status: "error", msg: "update user profile error 694 - " + error.message });
            else if (status.nModified > 0) res.status(200).send({ status: "success" });
            else res.status(200).send({ status: "error", msg: "update user profile error 696 - can't modifiy" });
          });
        });
      });
    }
  });
}

//add user address
export function addUserAddress(req, res) {
  User.findOne({ token: req.body.token }).exec((error, user) => {
    if (error || user == null) res.status(203).send({ status: "error", msg: "add address error 705 - " + error.message });
    else {
      let m_addr = new Address({
        id: crypto.randomBytes(3 * 3).toString("base64"),
        buildingNo: req.body.addr.buildingNo,
        flatNo: req.body.addr.flatNo,
        street: req.body.addr.street,
        type: req.body.addr.type
      });
      m_addr.save((error, addr) => {
        if (error) res.status(200).send({ status: "error", msg: "add address error 716 - " + error.message });
        else {
          let addr_list = user.address;
          if (addr_list == null) addr_list = [];
          addr_list.push(m_addr.id);
          User.updateOne(
            { token: req.body.token },
            { address: addr_list }
          ).exec((error, r_status) => {
            if (error) res.status(200).send({ status: "error", msg: "add address error 732 - " + error.message });
            else if (r_status.nModified > 0) res.status(200).send({ status: "success", data: {id: m_addr.id} });
            else res.status(200).send({ status: "error", msg: "add address error 734 - can't modifiy" });
          });
        }
      });
    }
  });
}

//edit user address
export function editUserAddress(req, res) {
  User.findOne({ token: req.body.token }).exec((error, user) => {
    if (error || user == null) res.status(203).send({ status: "error", msg: "update address error 746 - " + error.message });
    else {
      Address.updateOne(
        { id: req.body.addr.id },
        {
          buildingNo: req.body.addr.buildingNo,
          flatNo: req.body.addr.flatNo,
          street: req.body.addr.street,
          type: req.body.addr.type
        }
      ).exec((error, u_status) => {
        if (error) res.status(200).send({ status: "error", msg: "update address error 757 - " + error.message });
        else if (u_status.nModified > 0) res.status(200).send({ status: "success" });
        else res.status(200).send({ status: "error", msg: "update address error 759 - can't modifiy" });
      });
    }
  });
}

//delete user address
export function deleteUserAddress(req, res) {
  User.findOne({ token: req.body.token }).exec((error, user) => {
    if (error || user == null) res.status(203).send({ status: "error", msg: "delete address error 770 - " + error.message });
    else {
      Address.remove( {id: req.body.id}, (err) => {
        if (err) res .status(200).send({ status: "error", msg: "delete address error 835 - " + err.message });
        else {
          if (user.address != null) {
            var addr_list = user.address.filter(m_a => m_a.id !== req.body.id);
            User.updateOne(
              { phoneNumber: user.phoneNumber },
              { address: addr_list }
            ).exec((error, status) => {
              if (error) res.status(200).send({ status: "error", msg: "delete address error 843 - " + error.message });
              else if (status.nModified > 0) res.status(200).send({ status: "success" });
              else res.status(200).send({ status: "error", msg: "delete address error 845 - can't modifiy" });
            });
          } else res.status(200).send({ status: "success" });
        }
      });
    }
  });
}

//ordered detail
export function getOrdered(req, res) {
  User.findOne({ phoneNumber: req.body.phoneNumber }).exec((e1, user) => {
    if (e1 || user == null) res.status(203).send({ status: "error", msg: "get order details error 941 - " + e1.message });
    else {
      PractiNet.getOrder(
        req.body.id,
        { token: user.token },
        (error, result) => {
          if (error) res .status(200).send({ status: "error", msg: "get order details error 947 - " + error.message });
          else res.status(200).send({ status: "success", data: result });
        }
      );
    }
  });
}

//get card
export function getCard(req, res) {
  User.findOne({ phoneNumber: req.body.phoneNumber }).exec((err, user) => {
    if (err || user == null) res.status(203).send({ status: "error", msg: "get card error 859 - " + err.message });
    else {
      Card.findOne({id: req.body.id}, {name: 1, expiry: 1, token: 1}, (err, card) => {
          if (err) res .status(200).send({ status: "error", msg: "get card error 871 - " + err.message });
          else res.status(200).send({status: "success", data: card});
        }
      );
    }
  });
}

//add card
export function addCard(req, res) {
  User.findOne({ phoneNumber: req.body.phoneNumber }).exec(async (err, user) => {
    if (err || user == null) res.status(203).send({ status: "error", msg: "add card error 901 - " + err.message });
    else {
      stripe.paymentMethods.create({
        type: "card",
        card: {
          number: req.body.card.number,
          exp_month: parseInt(req.body.card.expiry.slice(0,2)),
          exp_year: parseInt("20" + req.body.card.expiry.slice(3,5)),
          cvc: req.body.card.cvv,
        },
        billing_details: {
          name: req.body.card.name
        }
      }, function(error, token) {
        if (error) res.status(200).send({ status: "error", msg: "add card error 900 - " + error.message });
        else {
          var m_card = new Card({
            id: crypto.randomBytes(3 * 3).toString("base64"),
            name: req.body.card.name,
            expiry: req.body.card.expiry,
            token: token.id,
          });
          m_card.save(async (error, result) => {
            if (error) res .status(200).send({ status: "error", msg: "add card error 913 - " + error.message });
            else {
              let card_list = user.cards;
              if (card_list == null) card_list = [];
              const mini_card = {
                id: m_card.id,
                issuer: token.card.brand,
                last4digit: token.card.last4
              }
              card_list.push(mini_card);
              var customer = null;
              var update = {
                cards: card_list,
                customer_id: user.customer_id,
              };
              if(user.customer_id == null)
              {
                try {
                  customer = await stripe.customers.create({
                    email: user.email,
                    name: user.lastname + " " + user.firstname,
                    phone: user.phoneNumber,
                  });
                  update.customer_id = customer.id;
                } catch (error) {
                  console.log(error);
                }
              }
              try {
                if(update.customer_id) {
                  const p_m = await stripe.paymentMethods.attach(token.id, {customer: update.customer_id});
                }
              } catch (error) {
                console.log(error);
              }
              User.updateOne(
                { phoneNumber: user.phoneNumber },
                {...update}
              ).exec((error, status) => {
                if (error) res.status(200).send({ status: "error", msg: "add card error 883 - " + error.message });
                else if (status.nModified > 0) res.status(200).send({ status: "success", data: {id: m_card.id, token: token.id} });
                else res.status(200).send({ status: "error", msg: "add card error 885 - can't modifiy" });
              });
            }
          });
        }
      });
    }
  });
}

//edit card
export function editCard(req, res) {
  User.findOne({ phoneNumber: req.body.phoneNumber }).exec((err, user) => {
    if (err || user == null) res.status(203).send({ status: "error", msg: "edit card error 958 - " + err.message });
    else {
      Card.findOne({id: req.body.id}, (error, m_card) => {
        if (error || m_card == null) res.status(200).send({ status: "error", msg: "edit card error 962 - " + error.message });
        else {
            stripe.paymentMethods.update(
            m_card.token,
            {
              card: {
                exp_month: parseInt(req.body.card.expiry.slice(0,2)),
                exp_year: parseInt("20" + req.body.card.expiry.slice(3,5)),
              },
              billing_details: {
                name: req.body.card.name
              }
            }, function(error, token) {
            if (error) res.status(200).send({ status: "error", msg: "edit card error 976 - " + error.message });
            else {
              Card.updateOne(
                {id: req.body.id},
                {
                  name: req.body.card.name,
                  expiry: req.body.card.expiry,
                  token: token.id
                }, (error, status) => {
                  if (error) res.status(200).send({ status: "error", msg: "edit card error 923 - " + error.message });
                  else if (status.nModified > 0) {
                    if (user.cards != null) {
                      var card_list = user.cards.map(m_c => {
                        if(m_c.id === req.body.id){
                          return {
                            id: m_c.id,
                            issuer: req.body.card.issuer,
                            last4digit: req.body.card.number.substr(req.body.card.number.length - 4, 4)
                          };
                        }
                        return m_c;
                      });
                      User.updateOne(
                        { phoneNumber: req.body.phoneNumber },
                        { cards: card_list }
                      ).exec((error, status) => {
                        if (error) res.status(200).send({ status: "error", msg: "edit card error 937 - " });
                        else if (status.nModified > 0) res.status(200).send({ status: "success" });
                        else res.status(200).send({ status: "error", msg: "edit card error 939 - can't modifiy" });
                      });
                    } else res.status(200).send({ status: "success" });
                  } else res.status(200).send({ status: "error", msg: "edit card error 941 - can't modifiy" });
                }
              );
            }
          });
        }
      });
    }
  });
}

//delete card
export function deleteCard(req, res) {
  User.findOne({ phoneNumber: req.body.phoneNumber }).exec((err, user) => {
    if (err || user == null) return res.status(203).send({ status: "error", msg: "delete card error 1019 - " + err.message });
    Card.findOne({id: req.body.id}, (err, card) => {
      if (err || card == null) return res .status(200).send({ status: "error", msg: "delete card error 1026 - " + err.message });
      stripe.paymentMethods.detach(card.token, (err, p_m) => {});
      Card.remove({id: req.body.id}, (err) => {
        if (err) return res .status(200).send({ status: "error", msg: "delete card error 1022 - " + err.message });
        if (user.cards == null) return res.status(200).send({ status: "success" });

        var card_list = user.cards.filter(m_c => m_c.id !== req.body.id);
        User.updateOne(
          { phoneNumber: req.body.phoneNumber },
          { cards: card_list }
        ).exec((error, status) => {
          if (error) res.status(200).send({ status: "error", msg: "delete card error 1030 - " + error.message });
          else if (status.nModified > 0) res.status(200).send({ status: "success" });
          else res.status(200).send({ status: "error", msg: "delete card error 1032 - can't modifiy" });
        });

      });
    });
  });
}

//Forgot Password
export function forgotPassword(req,res) {
  User.findOne({ email: req.body.email}).exec((err, user) => {
    if(err) {
      res.status(200).send(err);
    }
    else if(user == null)
      res.status(200).send('invalid email');
    else{
      const token = crypto.randomBytes(20).toString('hex');
      User.updateOne(
        { email: req.body.email },
        {
          resetPasswordToken: token,
          resetPasswordExpires: Date.now() + 360000,
        },
        function(child_err, child_res){
          if(child_err) res.status(200).send('failed generate token');
          else{
            var mandrill_client = new mandrill.Mandrill('KyQLAP1GJBI4B5T2y2bWLA');
            var message = 
            {
              "html": "<p>Example HTML content</p>",
              "text": `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` + 
                      `Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n` + 
                      `http://localhost:8000/reset/${token}\n\n` + 
                      `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
              "subject": "Link To Reset Password(Shine's Bakery)",
              "from_email": "vladandjordjevic@gmail.com",
              "from_name": "Shine's Bakery",
              "to": [
                  {
                      "email": `${user.email}`,
                      "name": `${user.firstname}` + ' ' + `${user.lastname}`,
                      "type": "to"
                  }
              ]
            };
            var async = false;
            // var ip_pool = "165.22.195.119";
            mandrill_client.messages.send({"message": message, "async": async}, function(result){
              
              console.log(result);
              res.status(200).send(result);
              
            }, function(e){
              console.log("A mandrill error occurred: " + e.name + ' - ' + e.message);
              res.status(200).send('error with sending email' + e.message);
      
            })
          }
        })
      
      // const transporter = nodemailer.createTransport({
      //   service: 'gmail',
      //   port: 465,//25
      //   secure: true,//false
      //   auth: {
      //     user: 'raitop826@gmail.com',
      //     pass: '`1234567890-='
      //   },
      //   tls: {
      //     rejectUnauthorized: false
      //   }
      // });
      // console.log("EMAIL!!!!!",user.email);
      // const mailOptions = {
      //   from:'raitop826@gmail.com',
      //   to: `${user.email}`,
      //   subject: "Link To Reset Password(Shine's Bakery)",
      //   text: 
      //       `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` + 
      //       `Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n` + 
      //       `http://localhost:8000/reset/${token}\n\n` + 
      //       `If you did not request this, please ignore this email and your password will remain unchanged.\n`
      // };
      
      // transporter.sendMail(mailOptions, function(err, response) {
      //   if(err) {
      //     console.log("there was an error:", err);
      //   }
      //   else{
      //     console.log("here is the res:", response);
      //     res.status(200).send('resent email sent');
      //   }
      // })


    }
  })
}


export function resetPassword(req,res) {
  User.findOne({
    resetPasswordToken: req.body.resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now()}
  }).exec((err,user) => {
    if(err)
      res.status(200).send('password reset link is invalid or has expired');
    else if(user)
      res.status(200).send({
        phoneNumber: user.phoneNumber
      });
    else
      res.status(200).send('password reset link is invalid or has expired');
    })
}

export function updatePassword(req, res) {
  User.findOne({ phoneNumber: req.body.phoneNumber }).exec((err, user) => {
    if(err)
      res.status(200).send("user doesn't exist");
    else
      bcrypt.genSalt(10, function(e1, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
          if (e1) res.status(200).send("failed generate hash code");
          else {
            user.password = hash;
            user.save((err, saved) => {
              if (err) {
                res.status(200).send("failed to save user");
              }
              else res.status(200).send('success');
            });
          }
        });
      });
  })
}
