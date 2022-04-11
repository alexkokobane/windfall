import express from 'express'
import Shopify from '@shopify/shopify-api'
import checkAuth from '../utils/middlewares/check-auth'
import { Shop, Long, Grand, SavedLong, Customers, Quota } from '../models/shop-model'
import { 
	forCommon, 
	forCommonApi,
	forFreebie, 
	forAppetizer, 
	forMain, 
	forAppetizerApi, 
	forFreebieApi, 
	forMainApi 
} from '../utils/middlewares/price-plan'
import { deleteIncompleteLogin } from '../utils/middlewares/experimental'
import { divide, renderFor } from '../utils/render-divider'
import getShop from '../utils/get-shop'
import { generateDiscountCode, newSubs } from '../utils/functions'

const billing = express.Router()

billing.get('/', checkAuth, async (req, res) => {
	try{
		const render: renderFor = [
			{
				"plan": "Main",
				"page": "pages/main/main-main",
				"layer": "layouts/main-main"
			},
			{
				"plan": "Appetizer",
				"page": "pages/appetizer/plans-appetizer",
				"layer": "layouts/main-appetizer"
			},
			{
				"plan": "Freebie",
				"page": "pages/freebie/plans-freebie",
				"layer": "layouts/main-freebie"
			}
		]
		divide(req, res, render)
	} catch(err: any){
		console.log(err)
	}
})

billing.get('/plans', checkAuth, async (req, res) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const checkShop = await Shop.findOne({shop: session.shop})
		if(checkShop.pricePlan){
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
					app(id: "${process.env.APP_ID}"){
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
					app(id: "${process.env.APP_ID}"){
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
		if(switcher.length === 0){
			await Shop.updateOne(
				{
					'shop': session.shop
				},
				{
					'$set': {
						'pricePlan': checkShop.newChargeDetails.plan,
						'chargeDetails.id': checkShop.newChargeDetails.id,
						'chargeDetails.plan': checkShop.newChargeDetails.plan,
						'chargeDetails.confirmed': true,
						'chargeDetails.confirmedAt': Date.now()
					}
				}
			)

			const checkQuota = await Quota.findOne({'shop': session.shop})
			const entryQuotas: any[] = newSubs(checkShop.newChargeDetails.plan)
			console.log(checkQuota)
			console.log(entryQuotas)
			if(checkQuota === null ){
				new Quota({
					shop: session.shop,
					plan: checkShop.newChargeDetails.plan,
					entries: entryQuotas
				}).save()
			} else if(checkQuota.entries.length === 0){

				const updateQuota = await Quota.updateOne(
					{
						'shop': session.shop
					},
					{
						'$set': {
							'plan': checkShop.newChargeDetails.plan,
							'entries': entryQuotas
						}
					}
				)
				console.log(updateQuota)
				console.log("from billing 003")
			} else {
				const month = new Date(Date.now()).toISOString().substring(0, 7)
				const upQuota = await Quota.updateOne(
					{
						'shop': session.shop,
						'entries.month': month
					},
					{
						'$set': {
							'plan': checkShop.newChargeDetails.plan,
							'entries.$.maxValue': entryQuotas[entryQuotas.length-1].maxValue,
							'entries.$.plan': entryQuotas[entryQuotas.length-1].plan
						}
					}
				)
				console.log(upQuota)
				console.log("from billing 004")
				if(upQuota.modifiedCount !== 1){
					await Quota.updateOne(
						{
							'shop': session.shop
						},
						{
							'$set': {
								'plan': checkShop.newChargeDetails.plan
							},
							'$push': {
								'entries': entryQuotas[entryQuotas.length-1]
							}
						}
					)
				}
			}

			return res.redirect('/')
		} else if(switcher.length > 0){
			// Delete prev subscription
			const deleteCurrentPlan: any = await client.query(
				{
					data: `mutation{
						appSubscriptionCancel(id: "${checkShop.chargeDetails.id}"){
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
			console.log(deleteCurrentPlan.body.data)
			if(!deleteCurrentPlan.body.data.appSubscriptionCancel.appSubscription.name){
				console.log(deleteCurrentPlan.body.data.appSubscription)
				console.log("failed to delete subscription")
				return res.redirect('/billing')
			}

			await Shop.updateOne(
				{
					'shop': session.shop
				},
				{
					'$set': {
						'pricePlan': checkShop.newChargeDetails.plan,						
						'chargeDetails.id': checkShop.newChargeDetails.id,
						'chargeDetails.plan': checkShop.newChargeDetails.plan,
						'chargeDetails.confirmed': true,
						'chargeDetails.confirmedAt': Date.now()
					}
				}
			)

			const checkQuota = await Quota.findOne({'shop': session.shop})
			const entryQuotas: any[] = newSubs(checkShop.newChargeDetails.plan)
			console.log(checkQuota)
			console.log(entryQuotas)
			if(checkQuota === null ){
				new Quota({
					shop: session.shop,
					plan: checkShop.newChargeDetails.plan,
					entries: entryQuotas
				}).save()
			} else if(checkQuota.entries.length === 0){

				const updateQuota = await Quota.updateOne(
					{
						'shop': session.shop
					},
					{
						'$set': {
							'plan': checkShop.newChargeDetails.plan,
							'entries': entryQuotas
						}
					}
				)
				console.log(updateQuota)
				console.log("from billing 001")
			} else {
				const month = new Date(Date.now()).toISOString().substring(0, 7)
				const upQuota = await Quota.updateOne(
					{
						'shop': session.shop,
						'entries.month': month
					},
					{
						'$set': {
							'plan': checkShop.newChargeDetails.plan,
							'entries.$.maxValue': entryQuotas[entryQuotas.length-1].maxValue,
							'entries.$.plan': entryQuotas[entryQuotas.length-1].plan
						}
					}
				)
				console.log(upQuota)
				console.log("from billing 002")
				if(upQuota.modifiedCount !== 1){
					await Quota.updateOne(
						{
							'shop': session.shop
						},
						{
							'$set': {
								'plan': checkShop.newChargeDetails.plan
							},
							'$push': {
								'entries': entryQuotas[entryQuotas.length-1]
							}
						}
					)
				}
			}
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
		const checkShop = await Shop.findOne({shop: session.shop})
		
		console.log(plan)
		if(plan === "Freebie"){
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
						"name": "Windfall Freebie free plan",
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
						'newChargeDetails': {
							'plan': plan,
							'id': returned.appSubscriptionCreate.appSubscription.id
						}
					}
				}
			)
			return res.redirect(returned.appSubscriptionCreate.confirmationUrl)
		}

		if(plan === "Appetizer"){
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
						"name": "Windfall Appetizer Recurring Plan",
						"returnUrl": "https://"+process.env.HOST+"/billing/redirect",
						"test": true,
						"trialDays": 14,
						"lineItems": [
							{
								"plan": {
									"appRecurringPricingDetails": {
										"price": {
											"amount": 14.0,
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
						'newChargeDetails': {
							'plan': plan,
							'id': returned.appSubscriptionCreate.appSubscription.id
						}
					}
				}
			)
			return res.redirect(returned.appSubscriptionCreate.confirmationUrl)
		}

		if(plan === "Main"){
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
						"name": "Windfall Main Recurring Plan",
						"returnUrl": "https://"+process.env.HOST+"/billing/redirect",
						"test": true,
						"trialDays": 14,
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
						'newChargeDetails': {
							'plan': plan,
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
		const render: renderFor = [
			{
				"plan": "Main",
				"page": "pages/main/plans-main",
				"layer": "layouts/main-main"
			},
			{
				"plan": "Appetizer",
				"page": "pages/appetizer/plans-appetizer",
				"layer": "layouts/main-appetizer"
			},
			{
				"plan": "Freebie",
				"page": "pages/freebie/plans-freebie",
				"layer": "layouts/main-freebie"
			}
		]
		divide(req, res, render)
	} catch(err: any){
		console.log(err)
	}	
})

export default billing