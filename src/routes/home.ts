import express from 'express'
import Shopify from '@shopify/shopify-api'
import checkAuth from '../utils/middlewares/check-auth'
import detectScope from '../utils/middlewares/detect-scope'
import { forCommon, forStarter, forStandard, forUltimate } from '../utils/middlewares/price-plan'
import { divide, renderFor } from '../utils/render-divider'

const home = express.Router()

home.get('/', checkAuth, async (req, res) => {
	try{
		const render: renderFor = [
			{
				"plan": "Ultimate",
				"page": "pages/home",
				"layer": "layouts/main-ultimate"
			},
			{
				"plan": "Standard",
				"page": "pages/home",
				"layer": "layouts/main-standard"
			},
			{
				"plan": "Starter",
				"page": "pages/starter/home-starter",
				"layer": "layouts/main-starter"
			}
		]
		divide(req, res, render)
	} catch(err: any){
		console.log(err)
	}
})

home.get('/test',  async (req, res) => {
	res.render('pages/campaign-edit', {layout: 'layouts/minimal'})
})

export default home