import express from 'express'
import Shopify from '@shopify/shopify-api'
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

const participants = express.Router()

participants.get('/', checkAuth, async (req, res) => {
	try{
		const render: renderFor = [
			{
				"plan": "Main",
				"page": "pages/participants",
				"layer": "layouts/main-main"
			},
			{
				"plan": "Appetizer",
				"page": "pages/participants",
				"layer": "layouts/main-appetizer"
			},
			{
				"plan": "Freebie",
				"page": "pages/participants",
				"layer": "layouts/main-freebie"
			}
		]
		divide(req, res, render)
	} catch(err: any){
		console.log(err)
	}
})

export default participants