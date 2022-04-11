import express from 'express'
import Shopify from '@shopify/shopify-api'
import checkAuth from '../utils/middlewares/check-auth'
import detectScope from '../utils/middlewares/detect-scope'
import { forCommon, forStarter, forStandard, forUltimate } from '../utils/middlewares/price-plan'
import { divide, renderFor } from '../utils/render-divider'

const home = express.Router()

home.get('/', checkAuth, forCommon, async (req, res) => {
	try{
		const render: renderFor = [
			{
				"plan": "Main",
				"page": "pages/main/home-main",
				"layer": "layouts/main-main"
			},
			{
				"plan": "Appetizer",
				"page": "pages/appetizer/home-appetizer",
				"layer": "layouts/main-appetizer"
			},
			{
				"plan": "Freebie",
				"page": "pages/freebie/home-freebie",
				"layer": "layouts/main-freebie"
			}
		]
		divide(req, res, render)
	} catch(err: any){
		console.log(err)
	}
})

home.get('/analytics', checkAuth, forStandard, async (req, res) => {
	try{
		//res.send("Ha ha ha! Gotcha, this is a dummy URL.")
		const render: renderFor = [
			{
				"plan": "Main",
				"page": "pages/main/analytics-main",
				"layer": "layouts/main-ultimate"
			}
		]
		divide(req, res, render)
	} catch(err: any){
		console.log(err)
		return err
	}
})

home.get('/test',  async (req, res) => {
	res.render('pages/campaign-edit', {layout: 'layouts/main-starter'})
})

export default home