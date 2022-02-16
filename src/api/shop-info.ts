import express, { Request, Response, NextFunction } from 'express'
import Shopify from '@shopify/shopify-api'
import checkAuth, { checkApiAuth } from '../utils/middlewares/check-auth'
import { Shop } from '../models/shop-model'

const shopInfo = express.Router()

shopInfo.get('/', checkApiAuth, async (req, res) => {
	try {
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const shop = await Shop.findOne({shop: session.shop})

		res.json({
			'shop': shop.shop, 
			'user': session.onlineAccessInfo.associated_user.first_name,
			'plan': shop.pricePlan
		})
	} catch(err: any){
		console.log(err)
	}
})

export default shopInfo