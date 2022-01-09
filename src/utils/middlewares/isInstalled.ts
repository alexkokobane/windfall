import { Request, Response, NextFunction } from 'express'
import Shopify from '@shopify/shopify-api'
import Shop from '../../models/shop-model'
import getShop from '../get-shop'

const isInstalled = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const checkShop = await Shop.findOne({shop: session.shop})

		if(checkShop == null){
		  const storeShop = new Shop({
			shop: session.shop,
			scope: [session.scope],
			email: session.onlineAccessInfo.associated_user.email,
		  })
		  storeShop.save()
		}
	} catch(err: any) {
		console.log(err)
		console.log("THE ERROR WAS ON isInstalled")
	}
}

export default isInstalled