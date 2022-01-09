import express from 'express'
import Shopify from '@shopify/shopify-api'
import checkAuth from '../utils/middlewares/check-auth'
import { deleteIncompleteLogin } from '../utils/middlewares/experimental'

const pricing = express.Router()

pricing.get('/plans', checkAuth, (req, res) => {
	res.send('These are the Pricing plans')
})


export default pricing