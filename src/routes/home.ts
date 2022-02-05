import express from 'express'
import Shopify from '@shopify/shopify-api'
import checkAuth from '../utils/middlewares/check-auth'
import detectScope from '../utils/middlewares/detect-scope'

const home = express.Router()

home.get('/', checkAuth, async (req, res) => {
	
	res.render('pages/home')
})

home.post('/webhooks', async (req, res) => {
	try{
		await Shopify.Webhooks.Registry.process(req, res)
		console.log('Webhook processed')
	} catch(err: any){
		console.log(err)
	}
})


export default home