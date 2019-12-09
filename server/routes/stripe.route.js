import { Router } from 'express'
import * as StripeController from '../controllers/stripe.controller'
const router = new Router()

//confirm payment with stripe api
router.post('/confirm_payment', StripeController.confirmPayment)
//
export default router