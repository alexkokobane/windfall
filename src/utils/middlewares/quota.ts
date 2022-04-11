import express, { Request, Response, NextFunction } from 'express'
import Shopify from '@shopify/shopify-api'
import { Shop, Long, Grand, SavedLong, Customers, Quota, Rapid, RapidChild, SavedRapid } from '../../models/shop-model'
import checkAuth, { checkApiAuth } from '../middlewares/check-auth'
import { deleteIncompleteLogin } from '../middlewares/experimental'
import { templateGate } from '../quotas'
import { 
	forCommon, 
	forCommonApi,
	forFreebie, 
	forAppetizer, 
	forMain, 
	forAppetizerApi, 
	forFreebieApi, 
	forMainApi 
} from './price-plan'
import { divide, renderFor } from '../render-divider'
import { generateDiscountCode } from '../functions'

const quota = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const quota = await Quota.findOne({'shop': session.shop})
		const month = new Date(Date.now()).toISOString().substring(0, 7)
		const maxQuota = quota.entries[quota.entries.length - 1].maxValue
		const valueQuota = quota.entries[quota.entries.length - 1].value
		if(valueQuota > maxQuota){
			return res.redirect("/billing/change")
		}

		return next()
	} catch(err: any){
		console.log(err)
		return err
	}
}

const quotaApi = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const quota = await Quota.findOne({'shop': session.shop})
		const maxQuota = quota.entries[quota.entries.length - 1].maxValue
		const valueQuota = quota.entries[quota.entries.length - 1].value
		if(valueQuota > maxQuota){
			return res.status(403).send("You have reached your usage limit, cannot create resource. Upgrade to continue.")
		}

		return next()
	} catch(err: any){
		console.log(err)
		return err
	}
}

export { quota, quotaApi }