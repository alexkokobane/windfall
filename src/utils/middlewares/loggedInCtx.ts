import { Request, Response, NextFunction } from 'express'
import Shopify from '@shopify/shopify-api'
import { Shop } from '../../models/shop-model'
import getShop from '../get-shop'

const loggedInCtx = async(req: Request, res: Response, next: NextFunction) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		session ? res.redirect('/') : next()
	} catch(err: any){
		console.log(err)
		console.log("THE ERROR IS ON loggedInCtx")
	}
}

export default loggedInCtx