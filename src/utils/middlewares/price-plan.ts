import express, { Request, Response, NextFunction } from 'express'
import Shopify, { ApiVersion, AuthQuery, SessionInterface } from '@shopify/shopify-api'
import { Shop, Saved, Super, Campaign, Customers } from '../../models/shop-model'
import getShop from '../get-shop'

const forCommon = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const shop = getShop(req)
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const checkShop = await Shop.findOne({shop: session.shop})
		if(checkShop.pricePlan !== "Ultimate" || checkShop.pricePlan !== "Standard" || checkShop.pricePlan !== "Starter"){
			return res.redirect("/billing/plans")
		}
		next()
	} catch (err: any){
		console.log(err)
	}
}

const forStarter = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const shop = getShop(req)
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const checkShop = await Shop.findOne({shop: session.shop})
		if(checkShop.pricePlan !== "Starter"){
			return res.redirect("/billing/plans")
		}
		next()
	} catch (err: any){
		console.log(err)
	}
}

const forStandard = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const shop = getShop(req)
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const checkShop = await Shop.findOne({shop: session.shop})
		if(checkShop.pricePlan !== "Standard"){
			return res.redirect("/billing/plans")
		}
		next()
	} catch (err: any){
		console.log(err)
	}
}

const forUltimate = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const shop = getShop(req)
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const checkShop = await Shop.findOne({shop: session.shop})
		if(checkShop.pricePlan !== "Ultimate"){
			return res.redirect("/billing/plans")
		}
		next()
	} catch (err: any){
		console.log(err)
	}
}

export { forCommon, forStarter, forStandard, forUltimate }