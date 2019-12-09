import { Router } from 'express'
import * as UserController from '../controllers/user.controller'
const router = new Router()

router.post('/verification', UserController.phoneVerification)
router.post('/confirm', UserController.signup);
router.post('/login', UserController.login);
//Get user Profile
router.post('/get-user-profile', UserController.getUserProfile);
//update user profile
router.post('/update-user-profile', UserController.updateUserProfile);
//add address to user profile
router.post('/add-user-address', UserController.addUserAddress);
//Edit address to user profile
router.post('/edit-user-address', UserController.editUserAddress);
//delete address to user profile
router.post('/delete-user-address', UserController.deleteUserAddress);
//Forgot Password
router.post('/forgotPassword', UserController.forgotPassword)
//Reset Password
router.post('/resetPassword', UserController.resetPassword)
//Update Password
router.post('/updatePassword', UserController.updatePassword)

router.get('/authentication', UserController.sumupAuthentication);

router.get('/autherized', UserController.sumupGetToken);
//Get valid Token with refresh Token from SumUP
router.post('/getToken', UserController.getTokenByRefreshToken);
//Create Payment method and Save to SumUP DB
router.post('/add-payment-method', UserController.tokenizeCard);
//Make Payment(Create checkout & Confirm Checkout with tokenized user)
router.post('/checkout-confirm-pay', UserController.makePayment);
//Make payment without creating customer
router.post('/checkout_payment', UserController.checkoutPayment);

//Get Order List By user phone Number
router.post('/get-orderlist', UserController.getOrders);
//Test Order 
router.post('/test-order', UserController.testOrder);
//get one detail of order history
router.post('/get-ordered', UserController.getOrdered);
//get credit card detail
router.post('/get-card', UserController.getCard);
//add credit card to user and cards collection
router.post('/add-card', UserController.addCard);
//edit credit card
router.post('/edit-card', UserController.editCard);
//delete credit card
router.post('/delete-card', UserController.deleteCard);

export default router