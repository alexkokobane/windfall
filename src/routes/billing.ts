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

billing.post('/plans', checkAuth, async (req, res) => {
	const session = await Shopify.Utils.loadCurrentSession(req, res, true)
	const client = new Shopify.Clients.Graphql(session.shop, session.accessToken)
	const plan = req.body.plan

	let subscription: object

	if(plan === "Standard"){
		subscription = {
				"name": "Super Duper Recurring Plan",
				"returnUrl": `https://${process.env.HOST}/`,
				"trialDays": 7,
				"test": true,
				"lineItems": [
				{
						"plan": {
						"appRecurringPricingDetails": {
								"price": {
								"amount": 29,
								"currencyCode": "USD"
								},
								"interval": "EVERY_30_DAYS"
						}
						}
				}
				]
		}
	}

	if(plan === "Ultimate"){
		subscription = {
				"name": "Super Duper Recurring Plan",
				"returnUrl": `https://${process.env.HOST}/`,
				"trialDays": 7,
				"test": true,
				"lineItems": [
					{
						"plan": {
							"appRecurringPricingDetails": {
								"price": {
								"amount": 79,
								"currencyCode": "USD"
								},
								"interval": "EVERY_30_DAYS"
							}
						}
					}
				]
		}
	}

	const selected: any = await client.query({
	data: {
			"query": `mutation{
				appSubscriptionCreate(name: $name, returnUrl: $returnUrl, lineItems: $lineItems, test: $test, trialDays: $trialDays) {
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
			"variables": subscription
		},
	})
	console.log(selected)

	res.redirect(selected.confirmationUrl)
})

billing.post('/change', checkAuth, async (req, res) => {
	res.render('pages/plans-starter', {layout: 'layouts/minimal'})
})

export default billing