import express, { Request, Response, NextFunction } from 'express'
import Shopify from '@shopify/shopify-api'
import checkAuth from '../utils/middlewares/check-auth'
import Shop from '../models/shop-model'

const shopInfo = express.Router()

shopInfo.get('/', checkAuth, async (req, res) => {
	try {
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const shop = await Shop.findOne({shop: session.shop})

		res.json({
			shop: shop.shop, 
			user: session.onlineAccessInfo.associated_user.first_name
		})
	} catch(err: any){
		console.log(err)
	}
})

shopInfo.post('/webhooks', async (req, res) => {
	try{
		await Shopify.Webhooks.Registry.process(req, res)		
	} catch(err: any){
		console.log(err)
	}
})

shopInfo.post('/try', async (req, res) => {
	try{
		res.status(200).send("A-OK")
	} catch(err: any) {
		console.log(err)
	}
})

export default shopInfo