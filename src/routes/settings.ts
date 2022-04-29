import express from 'express'
import Shopify from '@shopify/shopify-api'
import checkAuth from '../utils/middlewares/check-auth'
import detectScope from '../utils/middlewares/detect-scope'
import { 
	forCommon, 
	forFreebie, 
	forAppetizer, 
	forMain, 
	forCommonApi,
	forAppetizerApi, 
	forFreebieApi, 
	forMainApi 
} from '../utils/middlewares/price-plan'
import { 
	Shop, 
	Long, 
	Grand, 
	SavedLong, 
	Customers, 
	Quota, 
	Rapid, 
	RapidChild, 
	SavedRapid 
} from '../models/shop-model'
import { divide, renderFor } from '../utils/render-divider'

const settings = express.Router()

settings.get('/', checkAuth, forCommon, async (req, res) => {
	try{
		const render: renderFor = [
			{
				"plan": "Main",
				"page": "pages/settings",
				"layer": "layouts/main-main"
			},
			{
				"plan": "Appetizer",
				"page": "pages/settings",
				"layer": "layouts/main-appetizer"
			},
			{
				"plan": "Freebie",
				"page": "pages/settings",
				"layer": "layouts/main-freebie"
			}
		]
		divide(req, res, render)
	} catch(err: any){
		console.log(err)
	}
})

settings.get('/email', checkAuth, forCommon, async (req, res) => {
	try{
		//return res.render("pages/email-template", {layout: "layouts/main-main"})

		// dont forget to demonstrate the hacker screen function to your followers 
		// and tag sam esmail

		const render: renderFor = [
			{
				"plan": "Main",
				"page": "pages/email-template",
				"layer": "layouts/main-main"
			},
			{
				"plan": "Appetizer",
				"page": "pages/email-template",
				"layer": "layouts/main-appetizer"
			},
			{
				"plan": "Freebie",
				"page": "pages/email-template",
				"layer": "layouts/main-freebie"
			}
		]
		divide(req, res, render)
	} catch(err: any){
		console.log(err)
	}
})

settings.post('/email/template/save', checkAuth, forCommon, async (req, res) => {
	try {
		const data = req.body.dynamicEmail
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const update = await Shop.updateOne(
			{'shop': session.shop},
			{
				'$set': {
					'emailTemplate.data': data,
					'emailTemplate.lastUpdated': new Date(Date.now())
				}
			}
		)
		console.log(data)
		console.log(update)
		res.send("Template saved successfully!")
	} catch(err: any){
		return res.status(400).send("Error! Couldn't save template, if this error persists contact the developer.")
	}
})

export default settings