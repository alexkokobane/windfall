import express, { Request, Response, NextFunction } from 'express'
import Shopify, { ApiVersion, AuthQuery, SessionInterface } from '@shopify/shopify-api'
import { Shop, Long, Grand, SavedLong, Customers, Quota } from '../models/shop-model'

interface render {
	plan: string,
	page: string,
	layer: string
}

export interface renderFor extends Array<render>{}
export const divide = async (req: Request, res: Response, plans: renderFor, error?: boolean) => {
	const session = await Shopify.Utils.loadCurrentSession(req, res, true)
	const checkShop = await Shop.findOne({shop: session.shop})
	if(!checkShop.pricePlan){
		return res.redirect("/billing/plans")
	}
	if(plans && error){
		plans.forEach((plan) => {
			if(checkShop.pricePlan === plan.plan){
				if(plan.layer){
					return res.status(404).render(plan.page, {layout: plan.layer})
				} else {
					return res.status(404).render(plan.page)
				}
			}
		})
	} else if(plans){
		plans.forEach((plan) => {
			if(checkShop.pricePlan === plan.plan){
				if(plan.layer){
					return res.render(plan.page, {layout: plan.layer})
				} else {
					return res.render(plan.page)
				}
			}
		})
	} else {
		return res.redirect('/billing/plans')
	}
}