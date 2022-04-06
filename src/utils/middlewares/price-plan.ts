import express, { Request, Response, NextFunction } from 'express'
import Shopify, { ApiVersion, AuthQuery, SessionInterface } from '@shopify/shopify-api'
import { Shop, Long, Grand, SavedLong, Customers, Quota } from '../../models/shop-model'
import getShop from '../get-shop'

const forCommon = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const checkShop = await Shop.findOne({shop: session.shop})
		console.log(checkShop.pricePlan)
		if(checkShop.pricePlan === "Ultimate" || checkShop.pricePlan === "Standard" || checkShop.pricePlan === "Starter"){
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
		if(checkShop.pricePlan === "Ultimate" || checkShop.pricePlan === "Standard" || checkShop.pricePlan === "Starter"){
			return next()
		}
		res.status(403).send("Forbidden")
	} catch (err: any){
		console.log(err)
	}
}

const forStarter = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const checkShop = await Shop.findOne({shop: session.shop})
		if(checkShop.pricePlan !== "Starter"){
			return res.status(403).redirect("/billing/plans")
		}
		next()
	} catch (err: any){
		console.log(err)
	}
}

const forStarterApi = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const checkShop = await Shop.findOne({shop: session.shop})
		if(checkShop.pricePlan !== "Starter"){
			return res.status(403).send("Forbidden")
		}
		next()
	} catch (err: any){
		console.log(err)
	}
}

const forStandard = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const checkShop = await Shop.findOne({shop: session.shop})
		if(checkShop.pricePlan !== "Standard" || "Ultimate"){
			return res.status(403).redirect("/billing/plans")
		}
		next()
	} catch (err: any){
		console.log(err)
	}
}

const forStandardApi = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const checkShop = await Shop.findOne({shop: session.shop})
		if(checkShop.pricePlan !== "Standard" || "Ultimate"){
			return res.status(403).send("Forbidden")
		}
		next()
	} catch (err: any){
		console.log(err)
	}
}

const forUltimate = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const checkShop = await Shop.findOne({shop: session.shop})
		if(checkShop.pricePlan !== "Ultimate"){
			return res.status(403).redirect("/billing/plans")
		}
		next()
	} catch (err: any){
		console.log(err)
	}
}

const forUltimateApi = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const checkShop = await Shop.findOne({shop: session.shop})
		if(checkShop.pricePlan !== "Ultimate"){
			return res.status(403).send("Forbidden")
		}
		next()
	} catch (err: any){
		console.log(err)
	}
}

export { forCommon, forStarter, forStandard, forUltimate, forStandardApi }