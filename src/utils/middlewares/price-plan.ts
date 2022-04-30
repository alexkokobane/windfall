import express, { Request, Response, NextFunction } from 'express'
import Shopify, { ApiVersion, AuthQuery, SessionInterface } from '@shopify/shopify-api'
import { Shop, Long, Grand, SavedLong, Customers, Quota } from '../../models/shop-model'
import getShop from '../get-shop'

const forCommon = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const checkShop = await Shop.findOne({shop: session.shop})
		console.log(checkShop.pricePlan)
		if(checkShop.pricePlan === "Main" || checkShop.pricePlan === "Appetizer" || checkShop.pricePlan === "Freebie"){
			return next()
		}
		res.status(403).redirect("/billing/plans")
	} catch (err: any){
		console.log(err)
	}
}

const forCommonApi = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const checkShop = await Shop.findOne({shop: session.shop})
		console.log(checkShop.pricePlan)
		if(checkShop.pricePlan === "Main" || checkShop.pricePlan === "Appetizer" || checkShop.pricePlan === "Freebie"){
			return next()
		}
		res.status(403).send("Forbidden")
	} catch (err: any){
		console.log(err)
	}
}

const forFreebie = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const checkShop = await Shop.findOne({shop: session.shop})
		if(checkShop.pricePlan !== "Freebie" || checkShop.pricePlan === "Appetizer" || checkShop.pricePlan === "Main"){
			return res.status(403).redirect("/billing/plans")
		}
		next()
	} catch (err: any){
		console.log(err)
	}
}

const forFreebieApi = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const checkShop = await Shop.findOne({shop: session.shop})
		if(checkShop.pricePlan !== "Freebie" || checkShop.pricePlan === "Appetizer" || checkShop.pricePlan === "Main"){
			return res.status(403).send("Forbidden")
		}
		next()
	} catch (err: any){
		console.log(err)
	}
}

const forAppetizer = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const checkShop = await Shop.findOne({shop: session.shop})
		if(checkShop.pricePlan === "Appetizer" || checkShop.pricePlan === "Main"){
			return next()
		}
		res.status(403).redirect("/billing/plans")
	} catch (err: any){
		console.log(err)
	}
}

const forAppetizerApi = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const checkShop = await Shop.findOne({shop: session.shop})
		if(checkShop.pricePlan === "Appetizer" || checkShop.pricePlan === "Main"){
			return next()
		}
		return res.status(403).send("Forbidden")
	} catch (err: any){
		console.log(err)
	}
}

const forMain = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const checkShop = await Shop.findOne({shop: session.shop})
		if(checkShop.pricePlan !== "Main"){
			return res.status(403).redirect("/billing/plans")
		}
		next()
	} catch (err: any){
		console.log(err)
	}
}

const forMainApi = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const checkShop = await Shop.findOne({shop: session.shop})
		if(checkShop.pricePlan !== "Main"){
			return res.status(403).send("Forbidden")
		}
		next()
	} catch (err: any){
		console.log(err)
	}
}

export { forCommon, forFreebie, forAppetizer, forMain, forCommonApi, forAppetizerApi, forFreebieApi, forMainApi }