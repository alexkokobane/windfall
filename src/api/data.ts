import express from 'express'
import Shopify from '@shopify/shopify-api'
import cors from 'cors'
import Shop from '../models/shop-model'
import checkAuth from '../utils/middlewares/check-auth'
import loggedInCtx from '../utils/middlewares/loggedInCtx'

const data = express.Router()

data.get('/email-list', checkAuth, async (rey, res) => {
	res.send("This is the email list")
})

data.get('/total-revenue', checkAuth, async (req, res) => {
	res.send("Revenue counter")
})

data.get('/products', checkAuth, async (req, res) => {
	try {
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const client = new Shopify.Clients.Graphql(session.shop, session.accessToken)
		const storeProducts = await client.query({
			data: `
				{
					products(first:100 ){
						edges{
							node{
								id,
								title,
								featuredImage{
									altText,
									originalSrc
								}
							}
						}
					}
				}
			`
		})
		console.log(storeProducts.body)
		res.json(storeProducts.body)
	} catch(err: any) {
		console.log(err)
	}
})

data.get('/campaign/:id',  checkAuth, async (req, res) => {
	try{
		const giveawayId = parseInt(req.params.id)
		console.log(giveawayId)
		if(isNaN(giveawayId) === true){
			return res.status(404).send("Giveaway not found")
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const rawGiveaway = await Shop.findOne(
			{'campaigns.id': giveawayId}, 
			{
				'shop': session.shop, 
				campaigns : {'$elemMatch' : {'id': giveawayId}}
			}
		)
		console.log(rawGiveaway)
		if(rawGiveaway === null){
			return res.status(404).send("Giveaway not found")
		}
		const theOne: any = rawGiveaway.campaigns[0]
		console.log(theOne)
		const filteredGiveaway = {
			"id": theOne.id,
			"title": theOne.name,
			"startDate": theOne.startDate,
			"type": theOne.distributionType,
			"endDate": theOne.endDate,
			"entriesTotal": theOne.entries.length,
			"winnersTotal": theOne.winnersTotal,
			"winners": theOne.winners
		}
		console.log(filteredGiveaway)
		res.json(filteredGiveaway)
	} catch(err: any) {
		console.log(err)
	}
})

data.get('/campaigns/expired', checkAuth, async (req, res) => {
	try {
		const dateNow = new Date().toISOString()
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const rawGiveaway = await Shop.aggregate([
			{'$match': {'shop': session.shop}},
			{
				'$project': {
					'campaigns': {
						'$filter': {
							'input': '$campaigns',
							'as': 'campaign',
							'cond': {
								'$and': [
									{'$lt': ['$$campaign.startDate', new Date(dateNow)]},
									{'$lt': ['$$campaign.endDate', new Date(dateNow)]}
								]
							}
						}
					}
				}
			},
			{'$unwind': '$campaigns' },
			{
				'$project': {
					'_id': 0,
					'campaigns': 1
				}
			}
		])
		let expired: any = []
		rawGiveaway.forEach((item) => {
			const obj = item.campaigns
			expired.push({
				"id": obj.id,
				"name": obj.name,
				"type": obj.distributionType,
				"startDate": obj.startDate,
				"endDate": obj.endDate,
				"entriesTotal": obj.entries.length,
				"winnersTotal": obj.winnersTotal 
			})
		})
		console.log(expired)
		res.json(expired)
	} catch(err: any) {
		console.log(err)
	}
})

data.get('/campaigns/active', checkAuth, async (req, res) => {
	try {
		const dateNow = new Date().toISOString()
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const rawGiveaway = await Shop.aggregate([
			{'$match': {'shop': session.shop}},
			{
				'$project': {
					'campaigns': {
						'$filter': {
							'input': '$campaigns',
							'as': 'campaign',
							'cond': {
								'$and': [
									{'$lte': ['$$campaign.startDate', new Date(dateNow)]},
									{'$gte': ['$$campaign.endDate', new Date(dateNow)]}
								]
							}
						}
					}
				}
			},
			{'$unwind': '$campaigns' },
			{
				'$project': {
					'_id': 0,
					'campaigns': 1
				}
			}
		])
		let active: any = []
		rawGiveaway.forEach((item) => {
			const obj = item.campaigns
			active.push({
				"id": obj.id,
				"name": obj.name,
				"type": obj.distributionType,
				"startDate": obj.startDate,
				"endDate": obj.endDate,
				"entriesTotal": obj.entries.length,
				"winnersTotal": obj.winnersTotal 
			})
		})
		console.log(active)
		res.json(active)
	} catch(err: any) {
		console.log(err)
	}
})

data.get('/campaigns/upcoming', checkAuth, async (req, res) => {
	try {
		const dateNow = new Date().toISOString()
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const rawGiveaway = await Shop.aggregate([
			{'$match': {'shop': session.shop}},
			{
				'$project': {
					'campaigns': {
						'$filter': {
							'input': '$campaigns',
							'as': 'campaign',
							'cond': {
								'$and': [
									{'$gte': ['$$campaign.startDate', new Date(dateNow)]},
									{'$gte': ['$$campaign.endDate', new Date(dateNow)]}
								]
							}
						}
					}
				}
			},
			{'$unwind': '$campaigns' },
			{
				'$project': {
					'_id': 0,
					'campaigns': 1
				}
			}
		])
		let upcomig: any = []
		rawGiveaway.forEach((item) => {
			const obj = item.campaigns
			upcomig.push({
				"id": obj.id,
				"name": obj.name,
				"type": obj.distributionType,
				"startDate": obj.startDate,
				"endDate": obj.endDate,
				"entriesTotal": obj.entries.length,
				"winnersTotal": obj.winnersTotal 
			})
		})
		console.log(upcomig)
		res.json(upcomig)
	} catch(err: any) {
		console.log(err)
	}
})

data.get('/everything', checkAuth, async (req, res) => {
	try {
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const allData = await Shop.findOne({'shop': session.shop})
		res.json(allData)
	} catch(err: any) {
		console.log(err)
	}
})

export default data