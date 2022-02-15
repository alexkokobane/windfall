import express from 'express'
import Shopify from '@shopify/shopify-api'
import checkAuth from '../utils/middlewares/check-auth'
import { Shop, Saved, Super, Campaign, Customers } from '../models/shop-model'
import { deleteIncompleteLogin } from '../utils/middlewares/experimental'

const billing = express.Router()

billing.get('/', checkAuth, async (req, res) => {
	res.render('pages/billing')
})

billing.get('/plans', checkAuth, async (req, res) => {
	res.render('pages/plans-inclusive', {layout: 'layouts/minimal'})
})

billing.get('/redirect', checkAuth, async (req, res) => {
	try {
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const checkShop = await Shop.findOne({shop: session.shop})
		if(checkShop === null){
			const storeShop = new Shop({
				shop: session.shop,
				scope: [session.scope],
				email: session.onlineAccessInfo.associated_user.email,
			})
			storeShop.save()
		}
		res.redirect("/")
	} catch(err: any){
		console.log(err)
	}
})

billing.get('/plans/subscribe', checkAuth, async (req, res) => {
	let plan: string
	if (req.query.plan && typeof req.query.plan === 'string') {
	  	plan = req.query.plan
	} else {
	  	return undefined
	}
	if(plan === undefined) {
		return res.status(404).render('pages/404', {layout: 'layouts/minimal'})
	}
	const session = await Shopify.Utils.loadCurrentSession(req, res, true)
	const client = new Shopify.Clients.Graphql(session.shop, session.accessToken)
	//const plan = req.body.plan

	let subscription: object

	if(plan === "Standard"){
		const selected: any =  await client.query({
				data: {
					"query": `mutation AppSubscriptionCreate($name: String!, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!, $test: Boolean, $trialDays: Int! ){
						appSubscriptionCreate(name: $name, returnUrl: $returnUrl, lineItems: $lineItems, trialDays: $trialDays, test: $test) {
							userErrors {
								field
								message
							}
							appSubscription {
								id
							}
							confirmationUrl
						}
					}`,
					"variables": {
						"name": "Robosale Premium Recurring Plan",
						"returnUrl": "https://"+process.env.HOST+"/",
						"test": true,
						"trialDays": 7,
						"lineItems": [
							{
								"plan": {
									"appRecurringPricingDetails": {
										"price": {
											"amount": 29.0,
											"currencyCode": "USD"
										},
										"interval": "EVERY_30_DAYS"
									}
								}
							}
						]
					},
				},
			})
			console.log(selected)
			console.log(selected.body.data.appSubscriptionCreate)
			return res.redirect(selected.body.data.appSubscriptionCreate.confirmationUrl)
	}

	if(plan === "Ultimate"){
		const selected: any =  await client.query({
				data: {
					"query": `mutation AppSubscriptionCreate($name: String!, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!, $test: Boolean, $trialDays: Int! ){
						appSubscriptionCreate(name: $name, returnUrl: $returnUrl, lineItems: $lineItems, trialDays: $trialDays, test: $test) {
							userErrors {
								field
								message
							}
							appSubscription {
								id
							}
							confirmationUrl
						}
					}`,
					"variables": {
						"name": "Robosale Premium Recurring Plan",
						"returnUrl": "https://"+process.env.HOST+"/",
						"test": true,
						"trialDays": 7,
						"lineItems": [
							{
								"plan": {
									"appRecurringPricingDetails": {
										"price": {
											"amount": 69.0,
											"currencyCode": "USD"
										},
										"interval": "EVERY_30_DAYS"
									}
								}
							}
						]
					},
				},
			})
			console.log(selected)
			console.log(selected.body.data.appSubscriptionCreate)
			return res.redirect(selected.body.data.appSubscriptionCreate.confirmationUrl)
	}

	
	//console.log(selected)

	res.send("Error buddy")
})

billing.post('/change', checkAuth, async (req, res) => {
	res.render('pages/plans-starter', {layout: 'layouts/minimal'})
})

export default billing