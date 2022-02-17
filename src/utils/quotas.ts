import express, { Request, Response, NextFunction } from 'express'
import Shopify, { ApiVersion, AuthQuery, SessionInterface } from '@shopify/shopify-api'
import { Shop, Saved, Super, Campaign, Customers, Quota } from '../models/shop-model'

const templateGate = async (req: Request, res: Response, shop: string) => {		
		const templates: any = await Saved.find({'shop': shop})
		const shopper: any = await Shop.findOne({'shop': shop})
		let count = templates.length
		let plan = shopper.pricePlan
		console.log("It runs and the count is "+count+" on a "+plan+" plan")
		if(plan === "Starter" && count > 2) {
			console.log("It passes here")
			return res.status(403).send("Sorry, you have reached your quota")
		} else if(plan === "Standard" && count > 6){
			return res.status(403).send("Sorry, you have reached your quota")
		} else if(plan ==="Ultimate" && count > 1000){
			return res.status(403).send("Sorry, you have reached your quota")
		} else {
			return res.status(501).send("Internal server error")
		}
}

export { templateGate }