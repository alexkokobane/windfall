import { Request, Response, NextFunction } from 'express'
import ActiveShop from '../../models/session-model'
import Shopify from '@shopify/shopify-api'

const detectScope = async (req: Request, res: Response, next: NextFunction) => {
	const session = await Shopify.Utils.loadCurrentSession(req, res, true)
	if (!Shopify.Context.SCOPES.equals(session.scope)) {
		console.log(Shopify.Context.SCOPES.equals(session.scope))
		console.log(session.scope)
	  return res.redirect(`/auth?shop=${session.shop}`)
	}
	return next()
}

export default detectScope