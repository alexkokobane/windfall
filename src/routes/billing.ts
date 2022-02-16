import express from 'express'
import Shopify from '@shopify/shopify-api'
import checkAuth from '../utils/middlewares/check-auth'
import { Shop, Saved, Super, Campaign, Customers } from '../models/shop-model'
import { forCommon, forStarter, forStandard, forUltimate } from '../utils/middlewares/price-plan'
import { deleteIncompleteLogin } from '../utils/middlewares/experimental'
import getShop from '../utils/get-shop'

const billing = express.Router()

billing.get('/', checkAuth, async (req, res) => {
	res.render('pages/billing')
})

billing.get('/plans', checkAuth, async (req, res) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const checkShop = await Shop.findOne({shop: session.shop})
		if(checkShop.pricePlan === "Ultimate" || checkShop.pricePlan === "Standard" || checkShop.pricePlan === "Starter"){
			return res.redirect("/billing/change")
		}
		res.render('pages/plans-inclusive', {layout: 'layouts/minimal'})
	} catch(err: any){
		console.log(err)
	}
})

billing.get('/details', checkAuth, async (req, res) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const client = new Shopify.Clients.Graphql(session.shop, session.accessToken)
		const data = await client.query(
			{
				data: `{
					app(id: "gid://shopify/App/6311347"){
						title,
						pricingDetails,
						installation{
							activeSubscriptions{
								id
							}
						}
					}
				}`
			}
		)

		res.json(data)
	} catch(err: any){
		console.log(err)
	}
})

billing.get('/delete', checkAuth, async (req, res) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const client = new Shopify.Clients.Graphql(session.shop, session.accessToken)
		const data = await client.query(
			{
				data: `mutation{
					appSubscriptionCancel(id: "gid://shopify/AppSubscription/24355012795"){
						appSubscription{
							name
						},
						userErrors{
							field
						}
					}
				}`
			}
		)

		res.json(data)
	} catch(err: any){
		console.log(err)
	}
})

billing.get('/redirect', checkAuth, async (req, res) => {
	try {
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const checkShop = await Shop.findOne({'shop': session.shop})
		if(checkShop === null){
			return res.status(404).render('pages/404', {layout: 'layouts/minimal'})
		}

		const client = new Shopify.Clients.Graphql(session.shop, session.accessToken)
		const appDetails: any = await client.query(
			{
				data: `{
					app(id: "gid://shopify/App/6311347"){
						title,
						pricingDetails,
						installation{
							activeSubscriptions{
								id
							}
						}
					}
				}`
			}
		)
		console.log(appDetails.body.data.app.installation.activeSubscriptions)
		const theOne: any[] = appDetails.body.data.app.installation.activeSubscriptions
		let switcher: any[] = []
		theOne.forEach(async (item: any) => {
			if(item.id === checkShop.chargeDetails.id){
				switcher.push(item.id)
			}
		})
		console.log(switcher)
		if(switcher.length > 0){
			await Shop.updateOne(
				{
					'shop': session.shop
				},
				{
					'$set': {
						'pricePlan': checkShop.chargeDetails.plan,
						'chargeDetails.confirmed': true,
						'chargeDetails.confirmedAt': Date.now()
					}
				}
			)
			return res.redirect('/')
		}
		
		res.status(404).render('pages/404', {layout: 'layouts/minimal'})
	} catch(err: any){
		console.log(err)
	}
})

billing.get('/plans/subscribe', checkAuth, async (req, res) => {
	try {
		let plan: string
		if (req.query.plan && typeof req.query.plan === 'string') {
				plan = req.query.plan
		} else {
				return plan = undefined
		}
		if(plan === undefined) {
			return res.status(404).render('pages/404', {layout: 'layouts/minimal'})
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const client = new Shopify.Clients.Graphql(session.shop, session.accessToken)

		if(plan === "Starter"){
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
						"name": "Robosale Starter Recurring Plan",
						"returnUrl": "https://"+process.env.HOST+"/billing/redirect",
						"test": true,
						"trialDays": 7,
						"lineItems": [
							{
								"plan": {
									"appRecurringPricingDetails": {
										"price": {
											"amount": 19.0,
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

			console.log(selected.body.data.appSubscriptionCreate)
			let returned: any = selected.body.data
			if(returned === undefined){
				return res.status(403).render('pages/503')
			}
			await Shop.updateOne(
				{
					'shop': session.shop
				},
				{
					'$set': {
						'chargeDetails': {
							'plan': 'Standard',
							'confirmed': false,
							'id': returned.appSubscriptionCreate.appSubscription.id
						}
					}
				}
			)
			return res.redirect(returned.appSubscriptionCreate.confirmationUrl)
		}

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
						"name": "Robosale Standard Recurring Plan",
						"returnUrl": "https://"+process.env.HOST+"/billing/redirect",
						"test": true,
						"trialDays": 7,
						"lineItems": [
							{
								"plan": {
									"appRecurringPricingDetails": {
										"price": {
											"amount": 39.0,
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

			console.log(selected.body.data.appSubscriptionCreate)
			let returned: any = selected.body.data
			if(returned === undefined){
				return res.status(403).render('pages/503')
			}
			await Shop.updateOne(
				{
					'shop': session.shop
				},
				{
					'$set': {
						'chargeDetails': {
							'plan': 'Standard',
							'confirmed': false,
							'id': returned.appSubscriptionCreate.appSubscription.id
						}
					}
				}
			)
			return res.redirect(returned.appSubscriptionCreate.confirmationUrl)
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
						"name": "Robosale Ultimate Recurring Plan",
						"returnUrl": "https://"+process.env.HOST+"/billing/redirect",
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

			console.log(selected.body.data.appSubscriptionCreate)
			let returned: any = selected.body.data
			if(returned === undefined){
				return res.status(403).render('pages/503')
			}
			await Shop.updateOne(
				{
					'shop': session.shop
				},
				{
					'$set': {
						'chargeDetails': {
							'plan': 'Ultimate',
							'confirmed': false,
							'id': returned.appSubscriptionCreate.appSubscription.id
						}
					}
				}
			)
			return res.redirect(returned.appSubscriptionCreate.confirmationUrl)
		}
		res.status(404).render('pages/404')
	} catch(err: any){
		console.log(err)
	}
})

billing.get('/change', checkAuth, async (req, res) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const checkShop = await Shop.findOne({shop: session.shop})
		if(checkShop.pricePlan === "Ultimate"){
			return res.render('pages/ultimate/plans-ultimate')
		}
		if(checkShop.pricePlan === "Standard"){
			return res.render('pages/standard/plans-standard')
		}
		if(checkShop.pricePlan === "Starter"){
			return res.render('pages/starter/plans-starter')
		}
		res.render('pages/plans-inclusive', {layout: 'layouts/minimal'})
	} catch(err: any){
		console.log(err)
	}	
})

export default billing