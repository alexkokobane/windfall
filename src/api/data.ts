import express from 'express'
import Shopify from '@shopify/shopify-api'
import cors from 'cors'
import { Shop, Long, Grand, SavedLong, Customers, Quota, Rapid, RapidChild, SavedRapid } from '../models/shop-model'
import checkAuth, { checkApiAuth } from '../utils/middlewares/check-auth'
import loggedInCtx from '../utils/middlewares/loggedInCtx'

const data = express.Router()

// Customers
data.get('/customers/export-json', checkApiAuth, async (req, res) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const customers = await Customers.find({'shop': session.shop})
		const exportData: any = {}
		customers.forEach((item: any, index: number) => {
			index++
			exportData["customer"+index] = {
				"first_name": item.firstName,
				"last_name": item.lastName,
				"email": item.email
			}
		})

		console.log(exportData)
		res.json(exportData)
	} catch(err: any){
		console.log(err)
	}
})

data.get('/customers/counter', checkApiAuth, async (req, res) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const customers = await Customers.find({'shop': session.shop})

		console.log(customers.length)
		res.json(customers.length)
	} catch(err: any){
		console.log(err)
	}
})

// Various

data.get('/total-revenue', checkApiAuth, async (req, res) => {
	res.send("Revenue counter")
})

data.get('/products', checkApiAuth, async (req, res) => {
	try {
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const client = new Shopify.Clients.Graphql(session.shop, session.accessToken)
		const storeProducts: any = await client.query({
			data: `
				{
					products(first:90 ){
						edges{
							node{
								id,
								title,
								featuredImage{
									altText,
									url
								}
							}
						}
					}
				}
			`
		})
		console.log(storeProducts.body)
		res.json(storeProducts.body.data.products.edges)
	} catch(err: any) {
		console.log(err)
	}
})

data.get('/campaign/:id',  checkApiAuth, async (req, res) => {
	try{
		const giveawayId = parseInt(req.params.id)
		console.log(giveawayId)
		if(isNaN(giveawayId) === true){
			return res.status(404).send("Giveaway not found")
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const giveaway = await Long.findOne(
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
			"winnersChosen": giveaway.winnersChosen,
			"winnersGifted": giveaway.winnersGifted,
			"type": giveaway.distributionType,
			"endDate": giveaway.endDate,
			"entriesTotal": giveaway.entries.length,
			"winnersTotal": giveaway.winnersTotal,
			"winners": giveaway.winners,
			'qualifying': giveaway.qualifying,
			'qualifyingId': giveaway.qualifyingId,
			'qualifyingItems': giveaway.qualifyingItems,
			"currencyCode": giveaway.currencyCode
		}
		console.log(justOne)
		res.json(justOne)
	} catch(err: any) {
		console.log(err)
	}
})

data.get('/campaigns/expired', checkApiAuth, async (req, res) => {
	try {
		const dateNow = new Date().toISOString()
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const giveaway = await Long.find({
			'shop': session.shop,
			'startDate': {'$lt': new Date(dateNow)},
			'endDate': {'$lt': new Date(dateNow)}
		})
		let expired: any = []
		giveaway.forEach((item: any) => {
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
		const rapidEvents = await RapidChild.find({
			'shop': session.shop,
			'startDate': {'$lt': new Date(dateNow)},
			'endDate': {'$lt': new Date(dateNow)}
		})

		rapidEvents.forEach((item: any) => {
			if(item.name && item.eventType){
				expired.push({
					"id": item.id,
					"name": item.name,
					"parentId": item.parentId,
					"eventType": item.eventType,
					"startDate": item.startDate,
					"endDate": item.endDate,
					"entriesTotal": item.entries.length,
					"winnersTotal": item.winnersTotal 
				})
			}
		})
		console.log(expired)
		res.json(expired)
	} catch(err: any) {
		console.log(err)
	}
})

data.get('/campaigns/active', checkApiAuth, async (req, res) => {
	try {
		const dateNow = new Date().toISOString()
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const giveaway = await Long.find({
			'shop': session.shop,
			'startDate': {'$lte': new Date(dateNow)},
			'endDate': {'$gte': new Date(dateNow)}
		})

		const rapidEvents = await RapidChild.find({
			'shop': session.shop,
			'startDate': {'$lte': new Date(dateNow)},
			'endDate': {'$gte': new Date(dateNow)}
		})

		let active: any = []
		giveaway.forEach((item: any) => {
			active.push({
				"id": item.id,
				"name": item.name,
				"type": item.distributionType,
				"eventType": item.eventType,
				"startDate": item.startDate,
				"endDate": item.endDate,
				"entriesTotal": item.entries.length,
				"winnersTotal": item.winnersTotal 
			})
		})

		rapidEvents.forEach((item: any) => {
			active.push({
				"id": item.id,
				"name": item.name,
				"eventType": item.eventType,
				"parentId": item.parentId,
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

data.get('/campaigns/upcoming', checkApiAuth, async (req, res) => {
	try {
		const dateNow = new Date().toISOString()
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const longEvents = await Long.find({
			'shop': session.shop,
			'startDate': {'$gte': new Date(dateNow)},
			'endDate': {'$gte': new Date(dateNow)}
		}).limit(3)
		const rapidEvents = await RapidChild.find({
			'shop': session.shop,
			'startDate': {'$gte': new Date(dateNow)},
			'endDate': {'$gte': new Date(dateNow)}
		}).limit(3)
		let upcoming: any = []
		longEvents.forEach((item: any) => {
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

		rapidEvents.forEach((item: any) => {
			if(item.name && item.eventType){
				upcoming.push({
					"id": item.id,
					"name": item.name,
					"parentId": item.parentId,
					"eventType": item.eventType,
					"startDate": item.startDate,
					"endDate": item.endDate,
					"entriesTotal": item.entries.length,
					"winnersTotal": item.winnersTotal 
				})
			}
		})
		console.log(upcoming)
		res.json(upcoming)
	} catch(err: any) {
		console.log(err)
	}
})

data.get('/campaigns/unfinished', checkApiAuth, async (req, res) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const long = await Long.find(
			{
				'shop': session.shop
			}
		)
		const defects: any[] = []
		long.forEach((item) => {
			if(item.winners.length < 1 || !item.winners){
				defects.push({
					"name": item.name,
					"id": item.id,
					"eventType": item.eventType,
					"distributionType": item.distributionType
				})
			}
		})
		res.json(defects)
	} catch(err: any){
		console.log(err)
	}
})

data.get('/campaigns/hierarchical', checkApiAuth, async (req, res) => {
	try {
		const dateNow = new Date().toISOString()
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const giveaway = await Long.find({
			'shop': session.shop,
			'distributionType': 'Hierarchical'
		})

		let hierarchy: any = []
		giveaway.forEach((item: any) => {
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

data.get('/campaigns/equitable', checkApiAuth, async (req, res) => {
	try {
		const dateNow = new Date().toISOString()
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const giveaway = await Long.find({
			'shop': session.shop,
			'distributionType': 'Equitable'
		})

		let equity: any = []
		giveaway.forEach((item: any) => {
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

data.get('/campaigns/all', checkApiAuth, async (req, res) => {
	try {
		const dateNow = new Date().toISOString()
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const giveaway = await Long.find({
			'shop': session.shop,
		})

		let all: any = []
		giveaway.forEach((item: any) => {
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

data.get('/awaiting', checkApiAuth, async (req, res) => {
	try{
		const dateNow = new Date().toISOString()
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const long = await Long.find(
			{
				'shop': session.shop,
				'endDate': {'$lt': new Date(dateNow)},
				'$or': [
					{'winnersGifted': false},
					{'winnersChosen': false}
				]
			}
		)

		const rapid = await RapidChild.find(
			{
				'shop': session.shop,
				'endDate': {'$lt': new Date(dateNow)},
				'$or': [
					{'winnersGifted': false},
					{'winnersChosen': false}
				]
			}
		)

		const grand = await Grand.find(
			{
				'shop': session.shop,
				'awaiting': true
			}
		)

		const awaiting: any[] = []
		long.forEach((item: any) => {
			awaiting.push({
				"id": item.id,
				"name": item.name,
				"entriesTotal": item.entries.length,
			})
		})

		rapid.forEach((item: any) => {
			awaiting.push({
				"id": item.id,
				"name": item.name,
				"entriesTotal": item.entries.length,
				"parentId": item.parentId,
				"eventType": item.eventType
			})
		})

		grand.forEach((item: any) => {
			awaiting.push({
				"id": item.id,
				"name": item.name,
				"eventType": "Rapid",
				"entriesTotal": item.childrenEvents.length
			})
		})

		res.json(awaiting)
	} catch(err: any){
		console.log(err)
	}
})

data.get('/giveaway-templates', checkApiAuth, async (req, res) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const long = await SavedLong.find({
			'shop': session.shop,
			'active': false
		})

		const rapid =  await SavedRapid.find({
			'shop': session.shop,
			'active': false
		})

		let templates: any = []
		long.forEach((item: any) => {
			console.log(item)
			templates.push({
				"id": item.id,
				"name": item.name,
				"active": item.active,
				"type": item.eventType,
				"winnersTotal": item.winnersTotal,
			})
		})
		rapid.forEach((item: any) => {
			console.log(item)
			templates.push({
				"id": item.id,
				"name": item.name,
				"active": item.active,
				"type": item.eventType,
				"winnersTotal": item.dates.length,
			})
		})
		console.log(templates)
		res.json(templates)
	} catch(err: any){
		console.log(err)
	}
})

data.get('/template/:id', checkApiAuth, async (req, res) => {
	try{
		const templateId = parseInt(req.params.id)
		if(isNaN(templateId) === true){
			return res.status(404).send("This template does not exist")
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const template = await SavedLong.findOne(
			{
				'shop': session.shop,
				'id': templateId
			},
			{
				'_id': 0,
				'distributionType': 1,
				'winnersTotal': 1,
				'duration': 1,
				'id': 1,
				'name': 1,
				'active': 1,
				'winners': 1,
				'qualifyingItems': 1,
				'qualifying': 1,
				'currencyCode': 1,
				'eventType': 1
			}
		)
		console.log(template)
		if(template === null){
			return res.status(404).send("Giveaway does not exist")
		}
		res.json(template)
	} catch(err: any){
		console.log(err)
	}
})

data.get('/long-validator', checkApiAuth, async (req, res) => {
	try{
		let starter : string
		let ender : string 
		let eventId : number

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

		if (req.query.id && typeof req.query.id === 'string') {
		  eventId = parseInt(req.query.id)
		} else {
		  eventId = 0
		}

		if(starter === 'undefined' || ender === 'undefined'){
			return res.status(403).send("Please fill in both dates.")
		}

		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const checkAll: any[] = await Long.find({'shop': session.shop})
		const rapid: any[] = await RapidChild.find({'shop': session.shop})

		let keyValue: any = []
		console.log(eventId)
		if(eventId !== 0){
			if(isNaN(eventId) === true){
				return res.status(404).send("Oops! This event seems corrupt, try reload and if the problem persists contact support.")
			}

			if(checkAll.length !== 0){
				let cleaned: any[] = []
				checkAll.forEach((item: any) => {
					if(item.id !== eventId){
						cleaned.push(item)
					}
				})

				cleaned.forEach((item: any) => {
					const itemStart = new Date(item.startDate)
					const itemEnd = new Date(item.endDate)
					const givStart = new Date(starter)
					const givEnd = new Date(ender)

					const obj = {
						'name': item.name,
						'startDate': itemStart,
						'endDate': itemEnd
					}
					
					if(givStart >= itemStart && givEnd <= itemEnd){
						if(!keyValue.includes(obj)){
							keyValue.push(obj)
						}
					}
					if((givStart >= itemStart && givStart <= itemEnd) || (itemStart >= givStart && itemStart <= givEnd)){
						if(!keyValue.includes(obj)){
							keyValue.push(obj)
						}
					}
				})
				console.log(keyValue)
				if(keyValue.length !== 0) {
					return res.json(keyValue)
				}
			}

			if(rapid.length !== 0){
				let cleaned: any[] = []
				rapid.forEach((item: any) => {
					if(item.id !== eventId){
						cleaned.push(item)
					}
				})

				cleaned.forEach((item: any) => {
					const itemStart = new Date(item.startDate)
					const itemEnd = new Date(item.endDate)
					const givStart = new Date(starter)
					const givEnd = new Date(ender)

					const obj = {
						'name': item.name,
						'startDate': itemStart,
						'endDate': itemEnd
					}
					
					if(givStart >= itemStart && givEnd <= itemEnd){
						if(!keyValue.includes(obj)){
							keyValue.push(obj)
						}
					}
					if((givStart >= itemStart && givStart <= itemEnd) || (itemStart >= givStart && itemStart <= givEnd)){
						if(!keyValue.includes(obj)){
							keyValue.push(obj)
						}
					}
				})
				console.log(keyValue)
				if(keyValue.length !== 0) {
					return res.json(keyValue)
				}
			}
		} else {
			if(checkAll.length !== 0){
				checkAll.forEach((item: any) => {
					const itemStart = new Date(item.startDate)
					const itemEnd = new Date(item.endDate)
					const givStart = new Date(starter)
					const givEnd = new Date(ender)

					const obj = {
						'name': item.name,
						'startDate': itemStart,
						'endDate': itemEnd
					}
					
					if(givStart >= itemStart && givEnd <= itemEnd){
						if(!keyValue.includes(obj)){
							keyValue.push(obj)
						}
					}
					if((givStart >= itemStart && givStart <= itemEnd) || (itemStart >= givStart && itemStart <= givEnd)){
						if(!keyValue.includes(obj)){
							keyValue.push(obj)
						}
					}
				})
				console.log(keyValue)
				if(keyValue.length !== 0) {
					return res.json(keyValue)
				}
			}

			if(rapid.length !== 0){
				rapid.forEach((item: any) => {
					const itemStart = new Date(item.startDate)
					const itemEnd = new Date(item.endDate)
					const givStart = new Date(starter)
					const givEnd = new Date(ender)

					const obj = {
						'name': item.name,
						'startDate': itemStart,
						'endDate': itemEnd
					}
					
					if(givStart >= itemStart && givEnd <= itemEnd){
						if(!keyValue.includes(obj)){
							keyValue.push(obj)
						}
					}
					if((givStart >= itemStart && givStart <= itemEnd) || (itemStart >= givStart && itemStart <= givEnd)){
						if(!keyValue.includes(obj)){
							keyValue.push(obj)
						}
					}
				})
				console.log(keyValue)
				if(keyValue.length !== 0) {
					return res.json(keyValue)
				}
			}
		}

		res.json(keyValue)
	} catch(err: any){
		console.log(err)
	}
})

data.get('/:id/winners', checkApiAuth, async (req, res) => {
	try{
		const displayWinners: any = []
		const giveawayId = parseInt(req.params.id)
		if(isNaN(giveawayId) === true){
			return res.status(404).send("Giveaway not found, cannot display winners.")
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
				
		const goodMeasure: any = await Long.findOne(
			{
				'shop': session.shop,
				'id': giveawayId,
				'winnersChosen': true
			},
			{
				'_id': 0,
				'winners': 1
			}
		)

		if(goodMeasure !== null){
			goodMeasure.winners.forEach((what: any) => {
				displayWinners.push(what)
			})
		}
		res.json(displayWinners)
	} catch(err: any){
		console.log(err)
	}
})

// Rapid

data.get('/campaign/rapid/:id',  checkApiAuth, async (req, res) => {
	try{
		const eventId = parseInt(req.params.id)
		console.log(eventId)
		if(isNaN(eventId) === true){
			return res.status(404).send("Giveaway not found")
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const event = await Rapid.findOne(
			{
				'shop': session.shop,
				'id': eventId
			}
		)
		console.log(event)
		if(event === null){
			return res.status(404).send("Giveaway not found")
		}
		
		const justOne = {
			"id": event.id,
			"title": event.name,
			"dates": event.dates,
			"grandPrize": event.grandEvent,
			"winnersChosen": event.winnersChosen,
			"winnersGifted": event.winnersGifted,
			"winnersTotal": event.winnersTotal,
			"prizes": event.prizes,
			"grandEvent": event.grandEvent,
			'qualifying': event.qualifying,
			'qualifyingId': event.qualifyingId,
			'qualifyingItems': event.qualifyingItems,
			'currencyCode': event.currencyCode
		}
		console.log(justOne)
		res.json(justOne)
	} catch(err: any) {
		console.log(err)
	}
})

data.get('/campaign/rapid/:id/awaiting',  checkApiAuth, async (req, res) => {
	try{
		const dateNow = new Date().toISOString()
		const eventId = parseInt(req.params.id)
		//console.log(eventId)
		if(isNaN(eventId) === true){
			return res.status(404).send("Giveaway not correct")
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const event = await Rapid.findOne(
			{
				'shop': session.shop,
				'id': eventId
			}
		)
		//console.log(event)
		if(event === null){
			return res.status(404).send("Giveaway not found")
		}

		const child = await RapidChild.find(
			{
				'shop': session.shop,
				'parentId': eventId,
				'endDate': {'$lt': new Date(dateNow)},
				'$or': [
					{'winnersGifted': false},
					{'winnersChosen': false}
				]
			}
		)

		const awaiting: any[] = []
		child.forEach((item: any) => {
			awaiting.push({
				"id": item.id,
				"name": item.name,
				"entriesTotal": item.entries.length,
				"winnersChosen": item.winnersChosen,
				"winnersGifted": item.winnersGifted,
				"winner": item.winner,
				"endDate": item.endDate
			})
		})

		console.log(awaiting)
		res.json(awaiting)
	} catch(err: any) {
		console.log(err)
	}
})

data.get('/campaign/rapid/:id/upcoming',  checkApiAuth, async (req, res) => {
	try{
		const dateNow = new Date().toISOString()
		const eventId = parseInt(req.params.id)
		//console.log(eventId)
		if(isNaN(eventId) === true){
			return res.status(404).send("Giveaway not correct")
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const event = await Rapid.findOne(
			{
				'shop': session.shop,
				'id': eventId
			}
		)
		//console.log(event)
		if(event === null){
			return res.status(404).send("Giveaway not found")
		}

		const child = await RapidChild.find({
			'shop': session.shop,
			'parentId': eventId,
			'startDate': {'$gte': new Date(dateNow)},
			'endDate': {'$gte': new Date(dateNow)}
		}).limit(3)
		let upcoming: any = []

		child.forEach((item: any) => {
			if(item.name && item.eventType){
				upcoming.push({
					"id": item.id,
					"name": item.name,
					"parentId": item.parentId,
					"eventType": item.eventType,
					"startDate": item.startDate,
					"endDate": item.endDate,
					"entriesTotal": item.entries.length,
					"winnersTotal": item.winnersTotal 
				})
			}
		})

		console.log(upcoming)
		res.json(upcoming)
	} catch(err: any) {
		console.log(err)
	}
})

data.get('/campaign/rapid/:id/active',  checkApiAuth, async (req, res) => {
	try{
		const dateNow = new Date().toISOString()
		const eventId = parseInt(req.params.id)
		//console.log(eventId)
		if(isNaN(eventId) === true){
			return res.status(404).send("Giveaway not correct")
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const event = await Rapid.findOne(
			{
				'shop': session.shop,
				'id': eventId
			}
		)
		//console.log(event)
		if(event === null){
			return res.status(404).send("Giveaway not found")
		}

		const child = await RapidChild.findOne({
			'shop': session.shop,
			'parentId': eventId,
			'startDate': {'$lte': new Date(dateNow)},
			'endDate': {'$gte': new Date(dateNow)}
		})
		if(child === null){
			return res.json({"id": 404})
		}
		const active: any = {
			"id": child.id,
			"name": child.name,
			"eventType": child.distributionType,
			"startDate": child.startDate,
			"endDate": child.endDate,
			"entriesTotal": child.entries.length,
			"winnersTotal": child.winnersTotal 
		}

		console.log(active)
		res.json(active)
	} catch(err: any) {
		console.log(err)
	}
})

data.get('/campaign/rapid/template/:id', checkApiAuth, async (req, res) => {
	try{
		const templateId = parseInt(req.params.id)
		if(isNaN(templateId) === true){
			return res.status(404).send("This template does not exist")
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)

		const template = await SavedRapid.findOne(
			{
				'shop': session.shop,
				'id': templateId
			},
			{
				'_id': 0,
				'id': 1,
				'name': 1,
				'active': 1,
				'winners': 1,
				'qualifyingItems': 1,
				'qualifying': 1,
				'currencyCode': 1,
				'eventType': 1,
				'prizes': 1,
				'goals': 1,
				'dates': 1
			}
		)
		res.json(template)
	} catch(err: any){
		console.log(err)
		return err
	}
})


// Grand

data.get('/campaign/grand/:id', checkApiAuth, async (req, res) => {
	try{
		const dateNow = new Date().toISOString()
		const eventId = parseInt(req.params.id)
		//console.log(eventId)
		if(isNaN(eventId) === true){
			return res.status(404).send("Giveaway not correct")
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const event = await Grand.findOne(
			{
				'shop': session.shop,
				'id': eventId
			}
		)
		const participants = await Grand.aggregate([
			{'$match': {'shop': session.shop}},
			{'$match': {'id': eventId}},
			{'$unwind': '$childrenEvents'},
			{'$match': {'childrenEvents.winnersChosen': true}}
		])
		console.log(participants)
		if(event === null){
			return res.status(404).send("Giveaway not found")
		}
		const grand: any = {
			"id": event.id,
			"name": event.name,
			"winnersChosen": event.winnersChosen,
			"winnersGifted": event.winnersGifted,
			"winner": event.winners[0],
			"completedEvents": participants.length,
			"allEvents": event.childrenEvents.length
		}
		console.log(grand)
		res.json(grand)
	} catch(err: any){
		console.log(err)
	}
})

// Misc

data.get('/quota-watch', checkApiAuth, async (req, res) => {
	try{

	} catch(err: any){
		console.log(err)
	}
})

data.get('/all-event-dates', checkApiAuth, async (req, res) => {
	try{
		let allEventsEver: any[] = []
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const long = await Long.find({'shop': session.shop})
		long.forEach((item) => {
			let start = Number(new Date(item.startDate))
			let end = Number(new Date(item.endDate))
			for(let i = 0; start <= end; i++){
				allEventsEver.push(new Date(start).toLocaleDateString('en-ZA'))
				start = Number(new Date(item.startDate))+(1000*60*60*24*i)
			}
		})
		const rapid = await RapidChild.find({'shop': session.shop})
		rapid.forEach((item: any) => {
			allEventsEver.push(new Date(item.startDate).toLocaleDateString('en-ZA'))
		})
		console.log(allEventsEver)
		res.json(allEventsEver)
	} catch(err: any){
		console.log(err)
		return err
	}
})

data.get('/everything', checkApiAuth, async (req, res) => {
	try {
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const shop = await Shop.findOne({'shop': session.shop})
		const usage = await Quota.findOne({'shop': session.shop})
		const longEvents = await Long.find({'shop': session.shop})
		const templates = await SavedLong.find({'shop': session.shop})
		const customers = await Customers.find({'shop': session.shop})
		const grandEvents = await Grand.find({'shop': session.shop})
		const rapidEvents = await Rapid.find({'shop': session.shop})
		const rapidChildEvents = await RapidChild.find({'shop': session.shop})
		const rapidTemplates = await SavedRapid.find({'shop': session.shop})

		const allData = {
			shop,
			usage,
			longEvents,
			rapidEvents,
			rapidChildEvents,
			grandEvents,
			longTemplate: templates,
			rapidTemplates,
			customers,
		}
		res.json(allData)
	} catch(err: any) {
		console.log(err)
	}
})

export default data