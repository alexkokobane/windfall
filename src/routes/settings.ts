import express from 'express'
import checkAuth from '../utils/middlewares/check-auth'
import { forCommon, forStarter, forStandard, forUltimate } from '../utils/middlewares/price-plan'
import { divide, renderFor } from '../utils/render-divider'

const settings = express.Router()

settings.get('/', checkAuth, forCommon, async (req, res) => {
	try{
		const render: renderFor = [
			{
				"plan": "Ultimate",
				"page": "pages/settings",
				"layer": "layouts/main-ultimate"
			},
			{
				"plan": "Standard",
				"page": "pages/settings",
				"layer": "layouts/main-standard"
			},
			{
				"plan": "Starter",
				"page": "pages/settings",
				"layer": "layouts/main-starter"
			}
		]
		divide(req, res, render)
	} catch(err: any){
		console.log(err)
	}
})

settings.get('/email', checkAuth, forCommon, async (req, res) => {
	try{
		const render: renderFor = [
			{
				"plan": "Ultimate",
				"page": "pages/email-template",
				"layer": "layouts/main-ultimate"
			},
			{
				"plan": "Standard",
				"page": "pages/email-template",
				"layer": "layouts/main-standard"
			},
			{
				"plan": "Starter",
				"page": "pages/email-template",
				"layer": "layouts/main-starter"
			}
		]
		divide(req, res, render)
	} catch(err: any){
		console.log(err)
	}
})

export default settings