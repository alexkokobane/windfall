import express, { Request, Response } from 'express'
import Shopify, { ApiVersion, AuthQuery, SessionInterface } from '@shopify/shopify-api'
import cors from 'cors'
import getShop from '../utils/get-shop'
import { storeCallback, loadCallback, deleteCallback } from '../utils/custom-session'
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

const { API_KEY, API_SECRET_KEY, SCOPES, HOST, SHOP } = process.env

Shopify.Context.initialize({
	API_KEY,
	API_SECRET_KEY,
	SCOPES: [SCOPES],
	HOST_NAME: HOST,
	IS_EMBEDDED_APP: false,
	API_VERSION: ApiVersion.January22,
	
	SESSION_STORAGE: new Shopify.Session.CustomSessionStorage(
		storeCallback,
		loadCallback,
		deleteCallback
	)
});

auth.get('/', sessionContext, async (req: Request, res: Response) => {
	try {
		const shop = getShop(req)
		
		 let authRoute = await Shopify.Auth.beginAuth(
				req,
				res,
				shop,
				'/auth/callback',
				true,
			);
		return res.redirect(authRoute);
	} catch(err: any) {
		//console.log(err)
		//console.log("THE ERROR IS ON auth")
		return res.redirect("/auth/callback/error")  
	}
});

auth.get('/callback', async (req: Request, res: Response) => {
	try {
		const session = await Shopify.Auth.validateAuthCallback(
			req,
			res,
			req.query as unknown as AuthQuery,
		);
		
		const shop = getShop(req)
		const checkShop = await Shop.findOne({shop: session.shop})
			
		// Functional webhooks
		if(session.shop === "toally.myshopify.com"){ // for testing
			const appUnistalled = await Shopify.Webhooks.Registry.register({
				path: '/webhooks/app-uninstalled',
				topic: 'APP_UNINSTALLED',
				accessToken: session.accessToken,
				shop: session.shop
			})
		}

		const ordersPaid = await Shopify.Webhooks.Registry.register({
			path: '/webhooks/orders-paid',
			topic: 'ORDERS_PAID',
			accessToken: session.accessToken,
			shop: session.shop
		})
		
		const shopUpdate =  await Shopify.Webhooks.Registry.register({
			path: '/webhooks/shop-update',
			topic: 'SHOP_UPDATE',
			accessToken: session.accessToken,
			shop: session.shop
		})

		
		if(!ordersPaid['ORDERS_PAID'].success){
			console.log(`Failed to create a webhook for ORDERS_PAID: ${ordersPaid.result}`)
		}
		if(!shopUpdate['SHOP_UPDATE'].success){
			console.log(`Failed to create a webhook for ORDERS_PAID: ${shopUpdate.result}`)
		}
		//console.log("Is this a webhook path? : "+Shopify.Webhooks.Registry.isWebhookPath('/webhooks'))

		// Check bills and db saved shops
		if(checkShop == null){
			const client = new Shopify.Clients.Graphql(session.shop, session.accessToken)
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
			console.log(shopData)
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
			//console.log("check point 1")
			return res.redirect("/billing/plans")
		}
		
		if(checkShop.pricePlan === "Main" || checkShop.pricePlan === "Appetizer" || checkShop.pricePlan === "Freebie"){
			//console.log("check point 2")
			return res.redirect(`/`)
		}

		return res.redirect("/billing/plans")		
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
Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
	path: "/webhooks/app-uninstalled",
	webhookHandler: handleAppUninstall,
})

Shopify.Webhooks.Registry.addHandler("ORDERS_PAID", {
	path: "/webhooks/orders-paid",
	webhookHandler: handleOrdersPaid,
})

Shopify.Webhooks.Registry.addHandler("SHOP_UPDATE", {
	path: "/webhooks/shop-update",
	webhookHandler: handleShopUpdate,
})

export default auth