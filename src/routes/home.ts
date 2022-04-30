import express from 'express'
import Shopify from '@shopify/shopify-api'
import { promises } from 'fs'
import path from 'path'
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
import { divide, renderFor } from '../utils/render-divider'

const home = express.Router()
const fs = promises

async function readFile(filePath: any) {
  try {
    const data = await fs.readFile(filePath);
    console.log(data.toString())
    return data.toString()
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`);
  }
}

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

home.get('/analytics', checkAuth, forMain, async (req, res) => {
	try{
		const render: renderFor = [
			{
				"plan": "Main",
				"page": "pages/main/analytics-main",
				"layer": "layouts/main-main"
			}
		]
		divide(req, res, render)
	} catch(err: any){
		console.log(err)
		return err
	}
})

home.get('/progress', checkAuth, forAppetizer, async (req, res) => {
	try{
		const render: renderFor = [
			{
				"plan": "Main",
				"page": "pages/main/progress-main",
				"layer": "layouts/main-main"
			},
			{
				"plan": "Appetizer",
				"page": "pages/main/progress-main",
				"layer": "layouts/main-appetizer"
			},
			{
				"plan": "Freebie",
				"page": "pages/main/progress-main",
				"layer": "layouts/main-freebie"
			}
		]
		divide(req, res, render)
	} catch(err: any){
		console.log(err)
	}
})

home.get('/tutorial', checkAuth, async (req, res) => {
	
})

home.get('/test', checkAuth,  async (req, res) => {
	const session = await Shopify.Utils.loadCurrentSession(req, res, true)
	const client = new Shopify.Clients.Rest(session.shop, session.accessToken)
	const themes = client.get({path: "themes"})

	res.json(themes)
})

home.get('/test/api', async (req, res) => {
	try {
		const filr = readFile(path.resolve(__dirname, '../public/main.js'))
		res.json(filr)
	} catch(err: any){
		res.status(400).send("Opps that request was made in bad faith.")
	}
})

export default home