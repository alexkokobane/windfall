import express from 'express'
import checkAuth from '../utils/middlewares/check-auth'
import { 
	forCommon, 
	forCommonApi,
	forFreebie, 
	forAppetizer, 
	forMain, 
	forAppetizerApi, 
	forFreebieApi, 
	forMainApi 
} from '../utils/middlewares/price-plan'
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

settings.get('/email', async (req, res) => {
	try{
		return res.render("pages/email-template", {layout: "layouts/main-main"})
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

export default settings