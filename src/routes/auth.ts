import express, { Request, Response } from 'express'
import Shopify, { ApiVersion, AuthQuery, SessionInterface } from '@shopify/shopify-api'
import cors from 'cors'
import getShop from '../utils/get-shop'
import { storeCallback, loadCallback, deleteCallback } from '../utils/custom-session'
import { 
	handleOrdersPaid, 
	handleAppUninstall, 
	handleCustomersRedact,
	handleCustomersDataRequest,
	handleShopUpdate
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
		console.log(err)
		console.log("THE ERROR IS ON auth")
	}
});

auth.get('/callback', async (req: Request, res: Response) => {
	try {
		
		console.log("Here are the cookie")
		const session = await Shopify.Auth.validateAuthCallback(
			req,
			res,
			req.query as unknown as AuthQuery,
		);
		
		const shop = getShop(req)
		const checkShop = await Shop.findOne({shop: session.shop})
		console.log({
			path: '/webhooks/shop-redact',
			topic: 'shop/redact',
			accessToken: session.accessToken,
			shop: session.shop,
		})
		// GDPR webhooks
		const delShop = await Shopify.Webhooks.Registry.register({
			path: '/webhooks/shop-redact',
			topic: 'shop/redact',
			accessToken: session.accessToken,
			shop: session.shop,
		})
		console.log(delShop)
		/*
		const reqCustomer =  await Shopify.Webhooks.Registry.register({
			path: '/webhooks/customers-data-request',
			topic: 'CUSTOMERS_DATA_REQUEST',
			accessToken: session.accessToken,
			shop: session.shop
		})
		console.log(reqCustomer)
		const delCustomer =  await Shopify.Webhooks.Registry.register({
			path: '/webhooks/customers-redact',
			topic: 'CUSTOMERS_REDACT',
			accessToken: session.accessToken,
			shop: session.shop
		})
		console.log(delCustomer)
		// Functional webhooks
		const ordersPaid = await Shopify.Webhooks.Registry.register({
			path: '/webhooks/orders-paid',
			topic: 'ORDERS_PAID',
			accessToken: session.accessToken,
			shop: session.shop
		})
		console.log(ordersPaid)
		const shopUpdate =  await Shopify.Webhooks.Registry.register({
			path: '/webhooks/shop-update',
			topic: 'SHOP_UPDATE',
			accessToken: session.accessToken,
			shop: session.shop
		})
		console.log(shopUpdate)

		if(!delShop['APP_UNINSTALLED'].success){
			console.log(`Failed to create a webhook for APP UNINSTALL: ${delShop.result}`)
		}
		if(!ordersPaid['ORDERS_PAID'].success){
			console.log(`Failed to create a webhook for ORDERS_PAID: ${ordersPaid.result}`)
		}*/
		//console.log("Is this a webhook path? : "+Shopify.Webhooks.Registry.isWebhookPath('/webhooks'))

		// Check bills and db saved shops
		if(checkShop == null){
			const client = new Shopify.Clients.Graphql(session.shop, session.accessToken)
			const data: any = await client.query(
				{
					data: `{
						shop {
							currencyCode
						}
					}`
				}
			)
			//console.log(data.body.data.shop.currencyCode)
			const storeShop = new Shop({
				shop: session.shop,
				scope: [session.scope],
				email: session.onlineAccessInfo.associated_user.email,
				currencyCode: data.body.data.shop.currencyCode
			})
			storeShop.save()
			//console.log("check point 1")
			return res.redirect("/billing/plans")
		}
		
		if(checkShop.pricePlan === "Ultimate" || checkShop.pricePlan === "Standard" || checkShop.pricePlan === "Starter"){
			//console.log("check point 2")
			return res.redirect(`/`)
		}

		res.redirect("/billing/plans")		
	} catch (error) {
		console.error(error);
		console.log("THE ERROR IS ON auth/callback")
		res.redirect("/auth/callback/error")  
	}
})

auth.get('/callback/error', async (req, res) => {
	res.render('pages/oauth-error')
})


// Register webhook handlers
Shopify.Webhooks.Registry.addHandler("shop/redact", {
	path: "/webhooks/shop-redact",
	webhookHandler: handleAppUninstall,
})

Shopify.Webhooks.Registry.addHandler("CUSTOMERS_DATA_REQUEST", {
	path: "/webhooks/customers-data-request",
	webhookHandler: handleCustomersDataRequest,
})

Shopify.Webhooks.Registry.addHandler("CUSTOMERS_REDACT", {
	path: "/webhooks/customers-redact",
	webhookHandler: handleCustomersRedact,
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