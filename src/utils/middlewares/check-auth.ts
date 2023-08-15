import { Request, Response, NextFunction } from 'express'
import Shopify from '@shopify/shopify-api'
import { Shop } from '../../models/shop-model'
import getShop from '../get-shop'

const checkAuth = async (req: Request, res: Response, next:NextFunction) => {
	try {
		const session = await Shopify.utils.loadCurrentSession(req, res, true)
		const shop = getShop(req)
		if (!session && shop === 'undefined') {
			return res.status(401).render('pages/login', {layout: 'layouts/minimal'})
		} else if(!session && shop !== 'undefined') {
			const store = await Shop.findOne({shop: shop})
			if(!store){
				return res.send("Please install this app from the Shopify App Store")
			}
			return res.redirect(`/auth?shop=${store.shop}`)
		} else {
			next()
		}
	} catch(err: any) {
		console.log(err)
	}
}

export const checkApiAuth = async (req: Request, res: Response, next:NextFunction) => {
	try {
		const session = await Shopify.utils.loadCurrentSession(req, res, true)
		if (!session) {
			return res.status(401).send("Unauthorized")
		}
		next()
	} catch(err: any) {
		console.log(err)
	}
}

export default checkAuth