import { Request, Response, NextFunction } from 'express'
import Shopify from '@shopify/shopify-api'
import { Shop } from '../../models/shop-model'
import getShop from '../get-shop'

const sessionContext = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const shop = getShop(req)
		
		if(session){
			const sameShop = session.shop === shop ? true : false
			if(sameShop === true) {
				return res.redirect('/')
			}
			await Shopify.Utils.deleteCurrentSession(req, res, true)
		}
		next()
	} catch(err: any){
		console.log(err)
		console.log("THE ERROR IS ON sessionContext")
	}
}

export default sessionContext