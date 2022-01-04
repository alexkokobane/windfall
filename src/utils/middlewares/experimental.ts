import { Request, Response, NextFunction } from 'express'
import ActiveShop from '../../models/session-model'
import Shopify from '@shopify/shopify-api'

export const corsMiddleware = async(req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Request-Method", "POST")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}

export const deleteIncompleteLogin = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		if(session){
			if(!session.accessToken){
				await Shopify.Utils.deleteCurrentSession(req, res, true)
				return res.send("Something went wrong with authentication")
			}
		}

		next()
	} catch(err: any) {
		console.log(err)
	}
}
