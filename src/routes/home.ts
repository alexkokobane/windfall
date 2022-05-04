import express from 'express'
import Shopify from '@shopify/shopify-api'
import { promises } from 'fs'
import path from 'path'
import checkAuth, { checkApiAuth } from '../utils/middlewares/check-auth'
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

home.get('/tutorials', checkAuth, async (req, res) => {
	try{
		const render: renderFor = [
			{
				"plan": "Main",
				"page": "pagesfreebien/tutorials-freebie",
				"layer": "layouts/main-main"
			},
			{
				"plan": "Appetizer",
				"page": "pages/freebie/tutorials-freebie",
				"layer": "layouts/main-appetizer"
			},
			{
				"plan": "Freebie",
				"page": "pages/freebie/tutorials-freebie",
				"layer": "layouts/main-freebie"
			}
		]
		divide(req, res, render)
	} catch(err: any){
		console.log(err)
	}
})

home.get('/test', checkAuth,  async (req, res) => {
	try{

		// Specify the name of the template the app will integrate with
		const APP_BLOCK_TEMPLATES = ['product', 'collection', 'index'];

		// Retrieve a session token from an authenticated request
		const session = await Shopify.Utils.loadCurrentSession(req, res);

		// Create a new client for the specified shop
		const client = new Shopify.Clients.Rest(session.shop, session.accessToken);

		// Use `client.get` to request a list of themes on the shop
		const resOne: any = await client.get({
			path: 'themes',
		});
		
		// Find the published theme
		const publishedTheme = resOne.body.themes.find((theme: any) => theme.role === 'main');

		// Retrieve a list of assets in the published theme
		const resTwo: any = await client.get({
			path: `themes/${publishedTheme.id}/assets`
		});
		//console.log(resTwo)
		// Check if JSON template files exist for the template specified in APP_BLOCK_TEMPLATES
		const templateJSONFiles = resTwo.body.assets.filter((file: any) => {
			return APP_BLOCK_TEMPLATES.some((template: any ) => file.key === `templates/${template}.json`);
		})

		// Retrieve the body of JSON templates and find what section is set as `main`
		const templateMainSections = (await Promise.all(templateJSONFiles.map(async (file: any, index: any) => {
			let acceptsAppBlock = false;
			const resThree: any = await client.get({
				path: `themes/${publishedTheme.id}/assets`,
				query: { "asset[key]": file.key }
			})

			const json = JSON.parse(resThree.body.asset.value)
			const main: any = Object.entries(json.sections).find(([id, section]) => id === 'main' || (section as any).type.startsWith("main-"))
			if (main) {
				return resTwo.body.assets.find((file: any) => file.key === `sections/${main[1].type}.liquid`);
			}
		}))).filter((value) => value)


		// Request the content of each section and check if it has a schema that contains a
		// block of type '@app'
		const sectionsWithAppBlock = (await Promise.all(templateMainSections.map(async (file, index) => {
			let acceptsAppBlock = false;
			const resFour: any = await client.get({
				path: `themes/${publishedTheme.id}/assets`,
				query: { "asset[key]": file.key }
			})

			const match = resFour.body.asset.value.match(/\{\%\s+schema\s+\%\}([\s\S]*?)\{\%\s+endschema\s+\%\}/m)
			const schema = JSON.parse(match[1]);

			if (schema && schema.blocks) {
				acceptsAppBlock = schema.blocks.some(((b: any) => b.type === '@app'));
			}

			return acceptsAppBlock ? file : null
		}))).filter((value) => value)

		let results = 0

		if (templateJSONFiles.length > 0 && (templateJSONFiles.length === sectionsWithAppBlock.length)) {
			console.log('All desired templates support sections everywhere!')
			results += 1
		} else if (templateJSONFiles.length) {
			console.log('Only some of the desired templates support sections everywhere.')
			results += 1
		}

		if (templateJSONFiles.length > 0 && (templateJSONFiles.length === sectionsWithAppBlock.length)) {
			console.log('All desired templates have main sections that support app blocks!');
			results += 5
		} else if (sectionsWithAppBlock.length) {
			console.log('Only some of the desired templates support app blocks.');
			results += 3
		} else {
			console.log("None of the desired templates support app blocks");
			results += 0
		}

		res.json({status: results})
	} catch(err: any){
		console.log(err)
		res.status(403).send("Error: "+err)
	}
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