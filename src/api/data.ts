import express from 'express'
import Shopify from '@shopify/shopify-api'
import cors from 'cors'
import { Shop, Saved, Super, Campaign, Customers } from '../models/shop-model'
import checkAuth from '../utils/middlewares/check-auth'
import loggedInCtx from '../utils/middlewares/loggedInCtx'
//import querySanitizer from '../utils/query-sanitizer'

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
		const giveaway = await Campaign.findOne(
			{
				'shop': session.shop,
				'id': giveawayId
			}
		)
		console.log(giveaway)
		if(giveaway === null){
			return res.status(404).send("Giveaway not found")
		}
		
		const justOne = {
			"id": giveaway.id,
			"title": giveaway.name,
			"startDate": giveaway.startDate,
			"type": giveaway.distributionType,
			"endDate": giveaway.endDate,
			"entriesTotal": giveaway.entries.length,
			"winnersTotal": giveaway.winnersTotal,
			"winners": giveaway.winners
		}
		console.log(justOne)
		res.json(justOne)
	} catch(err: any) {
		console.log(err)
	}
})

data.get('/campaigns/expired', checkAuth, async (req, res) => {
	try {
		const dateNow = new Date().toISOString()
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const giveaway = await Campaign.find({
			'shop': session.shop,
			'startDate': {'$lt': new Date(dateNow)},
			'endDate': {'$lt': new Date(dateNow)}
		})
		let expired: any = []
		giveaway.forEach((item) => {
			expired.push({
				"id": item.id,
				"name": item.name,
				"type": item.distributionType,
				"startDate": item.startDate,
				"endDate": item.endDate,
				"entriesTotal": item.entries.length,
				"winnersTotal": item.winnersTotal 
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
		const giveaway = await Campaign.find({
			'shop': session.shop,
			'startDate': {'$lte': new Date(dateNow)},
			'endDate': {'$gte': new Date(dateNow)}
		})

		let active: any = []
		giveaway.forEach((item) => {
			active.push({
				"id": item.id,
				"name": item.name,
				"type": item.distributionType,
				"startDate": item.startDate,
				"endDate": item.endDate,
				"entriesTotal": item.entries.length,
				"winnersTotal": item.winnersTotal 
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
		const giveaway = await Campaign.find({
			'shop': session.shop,
			'startDate': {'$gte': new Date(dateNow)},
			'endDate': {'$gte': new Date(dateNow)}
		})

		let upcoming: any = []
		giveaway.forEach((item) => {
			upcoming.push({
				"id": item.id,
				"name": item.name,
				"type": item.distributionType,
				"startDate": item.startDate,
				"endDate": item.endDate,
				"entriesTotal": item.entries.length,
				"winnersTotal": item.winnersTotal 
			})
		})
		console.log(upcoming)
		res.json(upcoming)
	} catch(err: any) {
		console.log(err)
	}
})

data.get('/campaigns/hierarchical', checkAuth, async (req, res) => {
	try {
		const dateNow = new Date().toISOString()
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const giveaway = await Campaign.find({
			'shop': session.shop,
			'distributionType': 'Hierarchical'
		})

		let hierarchy: any = []
		giveaway.forEach((item) => {
			hierarchy.push({
				"id": item.id,
				"name": item.name,
				"type": item.distributionType,
				"startDate": item.startDate,
				"endDate": item.endDate,
				"entriesTotal": item.entries.length,
				"winnersTotal": item.winnersTotal 
			})
		})
		console.log(hierarchy)
		res.json(hierarchy)
	} catch(err: any) {
		console.log(err)
	}
})

data.get('/campaigns/equitable', checkAuth, async (req, res) => {
	try {
		const dateNow = new Date().toISOString()
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const giveaway = await Campaign.find({
			'shop': session.shop,
			'distributionType': 'Equitable'
		})

		let equity: any = []
		giveaway.forEach((item) => {
			equity.push({
				"id": item.id,
				"name": item.name,
				"type": item.distributionType,
				"startDate": item.startDate,
				"endDate": item.endDate,
				"entriesTotal": item.entries.length,
				"winnersTotal": item.winnersTotal 
			})
		})
		console.log(equity)
		res.json(equity)
	} catch(err: any) {
		console.log(err)
	}
})

data.get('/campaigns/all', checkAuth, async (req, res) => {
	try {
		const dateNow = new Date().toISOString()
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const giveaway = await Campaign.find({
			'shop': session.shop,
		})

		let all: any = []
		giveaway.forEach((item) => {
			all.push({
				"id": item.id,
				"name": item.name,
				"type": item.distributionType,
				"startDate": item.startDate,
				"endDate": item.endDate,
				"entriesTotal": item.entries.length,
				"winnersTotal": item.winnersTotal 
			})
		})
		console.log(all)
		res.json(all)
	} catch(err: any) {
		console.log(err)
	}
})

data.get('/giveaway-templates', checkAuth, async (req, res) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const template = await Saved.find({
			'shop': session.shop,
		})

		let templates: any = []
		template.forEach((item) => {
			templates.push({
				"id": item.id,
				"name": item.name,
				"type": item.distributionType,
				"winnersTotal": item.winnersTotal,
			})
		})
		console.log(templates)
		res.json(templates)
	} catch(err: any){
		console.log(err)
	}
})

data.get('/campaign-validator', checkAuth, async (req, res) => {
	try{
		let starter : string
		let ender : string 

		if (req.query.start && typeof req.query.start === 'string') {
		  starter = req.query.start
		} else {
		  starter = 'undefined'
		}

		if (req.query.end && typeof req.query.end === 'string') {
		  ender = req.query.end
		} else {
		  ender = 'undefined'
		}

		if(starter === 'undefined' || ender === 'undefined'){
			return res.status(403).send("Please fill in both dates.")
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const checkAll = await Campaign.find(
			{
				'shop': session.shop,
			}
		)
		let keyValue: any = []
		if(checkAll.length !== 0){
			checkAll.forEach((item) => {
				const itemStart = new Date(item.startDate)
				const itemEnd = new Date(item.endDate)
				const givStart = new Date(starter)
				const givEnd = new Date(ender)
				
				if(givStart >= itemStart && givEnd <= itemEnd){
					keyValue.push({
						'name': item.name,
						'startDate': itemStart,
						'endDate': itemEnd
					})
				}
				if((givStart >= itemStart && givStart <= itemEnd) || (itemStart >= givStart && itemStart <= givEnd)){
					keyValue.push({
						'name': item.name,
						'startDate': itemStart,
						'endDate': itemEnd
					})
				}
			})
			console.log(keyValue)
			if(keyValue.length !== 0) {
				return res.json(keyValue)
			}
		}

		res.json(keyValue)
	} catch(err: any){
		console.log(err)
	}
})

data.get('/everything', checkAuth, async (req, res) => {
	try {
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const shop = await Shop.findOne({'shop': session.shop})
		const campaigns = await Campaign.find({'shop': session.shop})
		const templates = await Saved.find({'shop': session.shop})
		const customers = await Customers.find({'shop': session.shop})
		const superCampaigns = await Super.find({'shop': session.shop})
		const allData = {
			shop,
			campaigns,
			superCampaigns,
			campaignTemplate: templates,
			customers
		}
		res.json(allData)
	} catch(err: any) {
		console.log(err)
	}
})

export default data