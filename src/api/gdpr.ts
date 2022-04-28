import express, { Request, Response, NextFunction } from 'express'
import Shopify, { ShopifyHeader } from '@shopify/shopify-api'
import crypto from 'crypto'
import checkAuth from '../utils/middlewares/check-auth'
import { Shop, Long, Grand, SavedLong, Customers, Quota, Rapid, RapidChild, Purchase } from '../models/shop-model'
import ActiveShop from '../models/session-model'
import { generateDiscountCode, newSubs } from '../utils/functions' 

const gdpr = express.Router()

async function verifyWebhookRequest(req: Request, res: Response, next: NextFunction) {
	try {
		const generatedHash = crypto.createHmac('SHA256', Shopify.Context.API_SECRET_KEY).update(JSON.stringify(req.body), 'utf8').digest('base64');
		const hmac = req.header('X-Shopify-Hmac-SHA256'); // Equal to 'X-Shopify-Hmac-Sha256' at time of coding
		console.log(hmac)
		console.log(generatedHash)
		console.log(hmac === generatedHash)
		const safeCompareResult = Shopify.Utils.safeCompare(generatedHash, hmac);

		if (!!safeCompareResult) {
			console.log('hmac verified for webhook route, proceeding');
			next();
		} else {
			console.log('Shopify hmac verification for webhook failed, aborting');
			return res.status(401).json({ succeeded: false, message: 'Not Authorized' }).send();
		}   
	} catch(error) {
		console.log(error);
		return res.status(401).json({ succeeded: false, message: 'Error caught' }).send();
	}
}

gdpr.post('/shop-redact', verifyWebhookRequest, async (req, res) => {
	res.status(200).send("Webhook processed")
	try{
		console.log(req.body)
		const shop: string = req.body.shop_domain
		await Shop.deleteOne({'shop': shop})
		await Long.deleteMany({'shop': shop})
		await SavedLong.deleteMany({'shop': shop})
		await Grand.deleteMany({'shop': shop})
		await Customers.deleteMany({'shop': shop})
		const session = await ActiveShop.find({'shop': shop})
		if(session.length !== 0){
			await ActiveShop.deleteMany({'shop': shop})
		}
		console.log(`${shop} has been obliterated.`)
		//console.log(webhookRequestBody)
	} catch(err: any){
		console.log(err)
	}
})

gdpr.post('/customers-data-request', verifyWebhookRequest, async (req, res) => {
	res.status(200).send("Webhook processed")
	try{
		console.log(req.body)
		const shop: string = req.body.shop_domain
		const customerEmail: string = req.body.customer.email
	} catch(err: any){
		console.log(err)
	}
})

gdpr.post('/customers-redact', verifyWebhookRequest, async (req, res) => {
	res.status(200).send("Webhook processed")
	try{
		console.log(req.body)
		const shop: string = req.body.shop_domain
		const customerEmail: string = req.body.customer.email
		const deleteCustomer = await Customers.deleteOne(
			{
				'shop': shop,
				'email': customerEmail
			}
		)
		const removeFromRapid = await RapidChild.updateMany(
			{'shop': shop},
			{
				'$pull': {
					'entries': {
						'email': customerEmail
					}
				}
			}
		)
		const removeFromLong = await Long.updateMany(
			{'shop': shop},
			{
				'$pull': {
					'entries': {
						'email': customerEmail
					}
				}
			}
		)
	} catch(err: any){
		console.log(err)
	}
})

export default gdpr