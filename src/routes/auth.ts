import express, { Request, Response } from 'express'
import '@shopify/shopify-api/adapters/node';
import { shopifyApi, ApiVersion, AuthQuery, DeliveryMethod } from '@shopify/shopify-api'
import cors from 'cors'
import getShop from '../utils/get-shop'
import { shopify } from '../index'
import { storeSession, loadSession, deleteSession } from '../utils/custom-session'
import { 
	handleOrdersPaid,
	handleShopUpdate,
	handleAppUninstall
} from '../api/webhooks'
import { Shop, Long, Grand, SavedLong, Customers, Quota } from '../models/shop-model'
import sessionContext from '../utils/middlewares/session-context'
import loggedInCtx from '../utils/middlewares/loggedInCtx'
import checkAuth from '../utils/middlewares/check-auth'
import { corsMiddleware } from '../utils/middlewares/experimental'
const auth = express.Router()

auth.get('/', async (req: Request, res: Response) => {
	try {
		const shop = getShop(req)
		
		await shopify.auth.begin({
			shop: shopify.utils.sanitizeShop(shop, true),
			callbackPath: '/auth/callback',
			isOnline: true,
			rawRequest: req,
			rawResponse: res,
		 })
	} catch(err: any) {
		return res.redirect("/auth/callback/error")  
	}
});

auth.get('/callback', async (req: Request, res: Response) => {
	try {
		const { session, headers } = await shopify.auth.callback({
			rawRequest: req,
			rawResponse: res,
		});

		const saveSession = await storeSession(session)
		if(!saveSession){ throw new Error('Could not store session') }
		
		const shop = getShop(req)
		const checkShop = await Shop.findOne({shop: session.shop})
			
		// Functional webhooks
		const hooks = await shopify.webhooks.register({
			session: session,
		})
		
		if(!hooks['ORDERS_PAID'][0].success){
			console.log(`Failed to create a webhook for ORDERS_PAID: ${hooks['ORDERS_PAID'][0].result}`)
		}
		if(!hooks['SHOP_UPDATE'][0].success){
			console.log(`Failed to create a webhook for ORDERS_PAID: ${hooks['SHOP_UPDATE'][0].result}`)
		}

		// Check bills and db saved shops
		if(checkShop == null){
			const client = new shopify.clients.Graphql({session})
			const data: any = await client.query(
				{
					data: `{
						shop {
							name
							currencyCode
							email
							description
							id
							plan {
								displayName 
								partnerDevelopment
								shopifyPlus
							}
							url
							billingAddress {
								address1
								address2
								city
								zip
								country
							}
						}
					}`
				}
			)
			const shopData = data.body.data.shop
			// console.log(shopData)
			const storeShop = new Shop({
				'shop': session.shop,
				'name': shopData.name,
				'email': shopData.email,
				'currencyCode': shopData.currencyCode,
				'shopifyPlan': shopData.plan.displayName,
				'devShop': shopData.plan.partnerDevelopment,
				'id': shopData.id,
				'url': shopData.url,
				'billingAddress': {
					'address1': shopData.billingAddress.address1,
					'address2': shopData.billingAddress.address2,
					'city': shopData.billingAddress.city,
					'zip': shopData.billingAddress.zip,
					'country': shopData.billingAddress.country
				},
				'metaDescription': shopData.description
			})
			storeShop.save()
			return res.redirect("/billing/plans")
		}
		
		if(checkShop.pricePlan === "Main" || checkShop.pricePlan === "Appetizer" || checkShop.pricePlan === "Freebie"){
			return res.redirect(`/`)
		} else {
			return res.redirect("/billing/plans")
		}				
	} catch (error) {
		//console.error(error);
		//console.log("THE ERROR IS ON auth/callback")
		return res.redirect("/auth/callback/error")  
	}
})

auth.get('/callback/error', async (req, res) => {
	res.render('pages/oauth-error')
})

// Register webhook handlers
shopify.webhooks.addHandlers({
	APP_UNINSTALLED: [{
		callbackUrl: "/webhooks/app-uninstalled",
		callback: handleAppUninstall,
		deliveryMethod: DeliveryMethod.Http
	}],
	ORDERS_PAID: [{
		callbackUrl: "/webhooks/orders-paid",
		callback: handleOrdersPaid,
		deliveryMethod: DeliveryMethod.Http
	}],
	SHOP_UPDATE: [{
		callbackUrl: "/webhooks/shop-update",
		callback: handleShopUpdate,
		deliveryMethod: DeliveryMethod.Http
	}],
})

export default auth