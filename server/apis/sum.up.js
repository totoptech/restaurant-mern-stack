const axios = require('axios')
var sumupAuthBaseURI = "https://api.sumup.com/"

/**
 * Sumup Authentication API
 * GET https://api.sumup.com/authorize?response_type=code&client_id=6D2btYpEd1dP3WZGaOqK3I8vRHQc
 * &redirect_uri=http://localhost:8000/api/user/autherized&
 * scope=payments%20user.app-settings%20transactions.history%20user.profile_readonly&state=2cFCsY36y95lFHk4
 **/

//url end points: authorize, token

export function sumupAuthorize(body, callback) {     
    const url = sumupAuthBaseURI + "authorize?response_type=code&client_id=" + body.client_id + 
                "&redirect_uri=http://localhost:8000/api/user/autherized&" + 
                "scope=payments%20user.app-settings%20transactions.history%20user.profile_readonly&state=2cFCsY36y95lFHk4"
    console.log(url);
    return axios.get(url);
}

export function sumupGetToken(body, callback) {
    //  console.log("sumupGetToken: ", body);
    axios.defaults.baseURL = sumupAuthBaseURI;
    axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded'
    axios.defaults.headers.get['Authorization'] = 'Basic Zk9jbWN6cll0WU1KN0xpNUdqTUxMY1VlQzlkTjo3MTdiZDU3MWI1NDI5NzQ5NGNkN2E3OWI0OTFlOGYyYzFkYTYxODljNGNjMmQzNDgxMzgwZTgzNjZlZWY1Mzlj'

    let request = {
        url: "token",
        method: "post",
        data: body
    }

    axios(request).then(res => {
        callback(res);
    }).catch(error => {
        console.log(error)
    })
}

//get token by refresh token
export function getTokenByRefreshToken(body, callback){
    axios.defaults.baseURL = sumupAuthBaseURI
    axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded'

    let request = {
        url: "token",
        method: "post",
        data: body
    }

    axios(request).then(res => {
        callback(res);
    }).catch(error => {
        console.log(error)
    })
}

//Base Sumup payment api
export function paymentApi(body, callback) {
    axios.defaults.baseURL = "https://api.sumup.com/v0.1"
    axios.defaults.headers.post['Content-Type'] = 'application/json'
    axios.defaults.headers.post['Authorization'] = 'Bearer '+ body.token

//    console.log(body)
    let request = {
        url: body.url,
        method: body.method,
        data: body.data
    }

    axios(request).then(res => {
        callback(null, res);
    }).catch(error => {
        callback(error, null)
    })
}