import express from 'express'
import Shopify from '@shopify/shopify-api'
import checkAuth from '../utils/middlewares/check-auth'
import { deleteIncompleteLogin } from '../utils/middlewares/experimental'

const billing = express.Router()

billing.get('/', checkAuth, async (req, res) => {
	res.render('pages/billing')
})

billing.get('/plans', checkAuth, async (req, res) => {
	res.send('These are the Pricing plans')
})

billing.post('/plans', checkAuth, async (req, res) => {
	res.send("Merchant just chose a plan")
})

billing.post('/change', checkAuth, async (req, res) => {
	res.send("Billing plan has been updted")
})

export default billing