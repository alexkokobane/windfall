import express from 'express'
import Shopify from '@shopify/shopify-api'
import cors from 'cors'
import { Shop } from '../models/shop-model'
import checkAuth, { checkApiAuth } from '../utils/middlewares/check-auth'
import loggedInCtx from '../utils/middlewares/loggedInCtx'
import { corsMiddleware } from '../utils/middlewares/experimental'
import getShop from '../utils/get-shop'

const login = express.Router()

login.post('/', loggedInCtx, async (req, res) => {
	try {

		const url = req.body.shop.replace(/\s+/g, '')
		const store = await Shop.findOne({shop: url})
		const plans = ["Freebie", "Appetizer", "Main"]
		if(store){
			plans.includes(store.pricePlan) ? res.status(200).send("/auth?shop="+store.shop) : res.status(401).send("Subscription not found! Reinstall Windfall from the Shopify App Store to continue using it.")
		}

		const holder: string[] = url.split(".")
		console.log(holder)
		if(holder[1] !== "myshopify"){
			return res.status(401).send("Please use your 'myshopify' url.")
		} else if(holder[2] !== "com"){
			return res.status(401).send("Error! The top level domain of every 'myshopify' url is dot com.")
		}

		return res.status(401).send("Shop not found! Install Windfall from the Shopify App Store.")
	} catch(err: any) {
		//console.log(err)
		return res.status(401).send("Error: "+err)
	}
})

login.post('/logout', checkApiAuth, async (req, res) => {
	try {
		await Shopify.Utils.deleteCurrentSession(req, res, true)
		res.send("/")
	} catch(err: any) {
		console.log(err)
	}
})

export default login