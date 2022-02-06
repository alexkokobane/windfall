import express from 'express'
import Shopify from '@shopify/shopify-api'
import cors from 'cors'
import Shop from '../models/shop-model'
import checkAuth from '../utils/middlewares/check-auth'
import loggedInCtx from '../utils/middlewares/loggedInCtx'
import { corsMiddleware } from '../utils/middlewares/experimental'

const login = express.Router()

login.post('/', loggedInCtx, async (req, res) => {
	try {

		console.log(req.body.shop)
		const store = await Shop.findOne({shop: req.body.shop})
		if(store){
			return res.status(200).send("/auth?shop="+store.shop)
		}
		res.status(403).send("Please install this app from the Shopify App Store")
	} catch(err: any) {
		console.log(err)
	}
})

login.post('/logout', checkAuth, async (req, res) => {
	try {
		await Shopify.Utils.deleteCurrentSession(req, res, true)
		res.send("/")
	} catch(err: any) {
		console.log(err)
	}
})

export default login