const axios = require('axios')
const Stripe = require('stripe')

const public_key = "pk_test_Tx747uO3rsyhHXYmKkbkOn6h"
const secret_key = "sk_test_BE2ZzrUNOhf89cUObS9irD5d"

//Declare stripe with secret key
const stripe = Stripe(secret_key);

export function testApi(body, callback) {
    let err = null, res = null;
    callback(err, res)
}