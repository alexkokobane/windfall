import { Request, Response } from 'express'
const getShop = (req: Request, res?: Response): string => {
	let shop: string

	if (req.query.shop && typeof req.query.shop === 'string') {
	  shop = req.query.shop
	} else {
	  shop = 'undefined'
	}

	return shop 
}

export default getShop