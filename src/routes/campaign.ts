import express from 'express'
import Shopify from '@shopify/shopify-api'
import { Shop, Long, Grand, SavedLong, Customers, Quota, Rapid, RapidChild } from '../models/shop-model'
import checkAuth, { checkApiAuth } from '../utils/middlewares/check-auth'
import { deleteIncompleteLogin } from '../utils/middlewares/experimental'
import { templateGate } from '../utils/quotas'
import { forCommon, forStarter, forStandard, forUltimate } from '../utils/middlewares/price-plan'
import { divide, renderFor } from '../utils/render-divider'
import { generateDiscountCode } from '../utils/functions'

const campaign = express.Router()

campaign.get('/giveaways', checkAuth, async (req, res) => {
	try{
		const render: renderFor = [
			{
				"plan": "Ultimate",
				"page": "pages/campaigns",
				"layer": "layouts/main-ultimate"
			},
			{
				"plan": "Standard",
				"page": "pages/campaigns",
				"layer": "layouts/main-standard"
			},
			{
				"plan": "Starter",
				"page": "pages/campaigns",
				"layer": "layouts/main-starter"
			}
		]
		divide(req, res, render)
	} catch(err: any){
		console.log(err)
	}
})

// Long events

campaign.get('/long/new', checkAuth, async (req, res) => {
	try{
		const render: renderFor = [
			{
				"plan": "Ultimate",
				"page": "pages/longevent-create",
				"layer": "layouts/main-ultimate"
			},
			{
				"plan": "Standard",
				"page": "pages/longevent-create",
				"layer": "layouts/main-standard"
			},
			{
				"plan": "Starter",
				"page": "pages/longevent-create",
				"layer": "layouts/main-starter"
			}
		]
		divide(req, res, render)
	} catch(err: any){
		console.log(err)
	}
})

campaign.post('/long/new', checkApiAuth, async (req, res) => {
	try {
		const data = req.body.form
		console.log(req.body.form)
		const giveawayId = Math.floor(Math.random() * 1000000000)
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const store = await Shop.findOne({'shop': session.shop})
		
		if(new Date(`${data.endDate}`) < new Date()){
			return res.status(403).send("The end date of a giveaway cannot be in the past")
		}

		if(store === null){
			return res.status(404).send("Error, shop was not found")
		}
		const longEvents: any = await Long.find({'shop': session.shop})
		let count = longEvents.length
		let plan = store.pricePlan
		console.log("It runs and the count is "+count+" on a "+plan+" plan")
		if(plan === "Starter" && count > 15) {
			console.log("It passes here")
			return res.status(403).send("Sorry, you have reached your quota")
		} else if(plan === "Standard" && count > 5){
			return res.status(403).send("Sorry, you have reached your quota")
		} else if(plan ==="Ultimate" && count > 1000){
			return res.status(403).send("Sorry, you have reached your quota")
		}
		if(parseInt(data.ofWinners) > 10 || parseInt(data.ofWinners) <= 0){
			return res.status(403).send("You cannot have more than 10 winners or a zero (0) winner")
		}

		let keyValue: any[] = []

		if(longEvents.length !== 0){			
			longEvents.forEach((item: any) => {
				const itemStart = new Date(item.startDate)
				const itemEnd = new Date(item.endDate)
				const givStart = new Date(`${data.startDate}`)
				const givEnd = new Date(`${data.endDate}`)
				
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
		}

		const rapidEvent = await RapidChild.find({'shop': session.shop})
		if(rapidEvent.length !== 0){
			rapidEvent.forEach((item: any) => {
				const itemStart = new Date(item.startDate)
				const itemEnd = new Date(item.endDate)
				const givStart = new Date(`${data.startDate}`)
				const givEnd = new Date(`${data.endDate}`)

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
		}

		if(keyValue.length !== 0) {
			return res.status(403).send("Cannot create giveaway, scheduling conflict detected.")
		}
		//const status: string = new Date(`${data.startDate}`) > new Date() ? 'Upcoming' : 'Active'
		new Long(
			{
				shop: session.shop,
				id: giveawayId,
				name: data.name,
				eventType: 'Long',
				winnersChosen: false,
				winnersGifted: false,
				startDate: new Date(`${data.startDate}`),
				endDate: new Date(`${data.endDate}`),
				distributionType: data.distribution,
				winnersTotal: parseInt(data.ofWinners),
				goals: {
					totalRevenue: data.totalRevenue,
					totalEntries: data.totalEntries
				},
				qualifying: data.qualifying,
				qualifyingId: data.qualifyingId,
				qualifyingItems: data.qualifyingItems
			}			
		).save()
		
		if(data.distribution === "Equitable"){
			res.send(`/campaign/long/new/equitable?id=${giveawayId}`)
		} else if (data.distribution === "Hierarchical"){
			res.send(`/campaign/long/new/hierarchical?id=${giveawayId}&winners=${data.ofWinners}`)
		} else {
			res.status(403).send("Error, choose a distribution type")
		}
	} catch(err: any){
		console.log(err)
		//res.status(401).send("Error, could not submit the form")
	}
})

campaign.get('/long/new/equitable', checkAuth, forCommon, async (req, res) => {
	try {
		let decoyId: string
		if (req.query.id && typeof req.query.id === 'string') {
					decoyId = req.query.id
		} else {
					return undefined
		}
		const giveawayId: number = parseInt(decoyId)
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const giveaway = await Long.findOne({
			'shop': session.shop, 'id': giveawayId
		}) 
		
		if(giveaway === null){
			return res.status(404).render('pages/404')
		}
		const render: renderFor = [
			{
				"plan": "Ultimate",
				"page": "pages/equitable",
				"layer": "layouts/main-ultimate"
			},
			{
				"plan": "Standard",
				"page": "pages/equitable",
				"layer": "layouts/main-standard"
			},
			{
				"plan": "Starter",
				"page": "pages/equitable",
				"layer": "layouts/main-starter"
			}
		]
		divide(req, res, render)
	} catch(err: any) {
		console.log(err)
	}
})

campaign.get('/long/new/hierarchical', checkAuth, forCommon, async (req, res) => {
	try {
		let decoyId: string
		let decoyWinners: string
		if (req.query.id && typeof req.query.id === 'string') {
					decoyId = req.query.id
		} else {
					return undefined
		}
		if(req.query.winners && typeof req.query.winners === 'string') {
			decoyWinners = req.query.winners
		} else {
			return undefined
		}
		const giveawayId: number = parseInt(decoyId)
		const giveawayWinners: number = parseInt(decoyWinners)
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const giveaway = await Long.findOne({'shop': session.shop, 'id': giveawayId}) 
		if(giveaway === null){
			return res.status(404).render('pages/404')
		}
		
		if(giveaway.winnersTotal !== giveawayWinners){
			res.status(404).render('pages/404')
		}
		const render: renderFor = [
			{
				"plan": "Ultimate",
				"page": "pages/hierarchical",
				"layer": "layouts/main-ultimate"
			},
			{
				"plan": "Standard",
				"page": "pages/hierarchical",
				"layer": "layouts/main-standard"
			},
			{
				"plan": "Starter",
				"page": "pages/hierarchical",
				"layer": "layouts/main-starter"
			}
		]
		divide(req, res, render)
	} catch(err: any) {
		console.log(err)
	}
})

campaign.get('/long/:id', checkAuth, async (req, res) => {
	try {
		const giveawayId = parseInt(req.params.id)
		if(isNaN(giveawayId) === true){
			return res.status(404).render('pages/404')
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const giveaway = await Long.findOne({'shop': session.shop, 'id': giveawayId})
		if(giveaway === null){
			return res.status(404).render('pages/404')
		}
		const render: renderFor = [
			{
				"plan": "Ultimate",
				"page": "pages/campaign",
				"layer": "layouts/main-ultimate"
			},
			{
				"plan": "Standard",
				"page": "pages/campaign",
				"layer": "layouts/main-standard"
			},
			{
				"plan": "Starter",
				"page": "pages/campaign",
				"layer": "layouts/main-starter"
			}
		]
		divide(req, res, render)
	} catch(err: any) {
		console.log(err)
	}
})

campaign.post('/long/new/hierarchical/create', checkApiAuth, async (req, res) => {
	try {
		const amounts = req.body.amounts
		const giveawayId = req.body.id
		console.log(amounts)
		console.log(giveawayId)
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const giveaway = await Long.findOne({'shop': session.shop, 'id': giveawayId})
		if(giveaway === null){
			return res.status(404).send('Invalid giveaway')
		}
		let winnerInfo: any = []
		Object.keys(amounts).forEach((key) => {
			winnerInfo.push({
				prizeId: parseInt(key),
				voucherPrize: parseInt(amounts[key])
			})
		})
		console.log(winnerInfo)
		
		await Long.updateOne(
			{'shop': session.shop, 'id': giveawayId },
			{ '$set': {'winners' : winnerInfo}}
		)
		res.send(`/campaign/long/${giveawayId}`)
	} catch(err: any) {
		console.log(err)
	}
})

campaign.post('/long/new/equitable/create', checkApiAuth, async (req, res) => {
	try {
		const amount = req.body.amounts
		const giveawayId = req.body.id
		console.log(amount)
		console.log(giveawayId)
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const giveaway = await Long.findOne(
			{
				'shop': session.shop, 
				'id': giveawayId
			}
		)
		if(giveaway === null){
			return res.status(404).send('Invalid giveaway')
		}
		if(isNaN(amount) || parseFloat(amount) <= 0){
			return res.send("The voucher amount has to be a number greater than zero.")
		}
		const ofWinners: number = giveaway.winnersTotal
		const winnerArray: any = []  
		for(let i = 0; i < ofWinners; i++){
			winnerArray.push(i)
		}
		let winnerInfo: any = []
		winnerArray.forEach((item: number) => {
			item++
			winnerInfo.push({
				prizeId: item,
				voucherPrize: parseInt(amount)
			})
		})
		console.log(winnerInfo)
		//console.log(await Shop.findOne({'shop': session.shop, 'campaigns.id': giveawayId}))
		await Long.updateOne(
			{'shop': session.shop, 'id': giveawayId },
			{ '$set': {'winners' : winnerInfo}}
		)
		res.send(`/campaign/long/${giveawayId}`)
	} catch(err: any) {
		console.log(err)
	}
})

campaign.post('/long/:id/choose-winners', checkApiAuth, async (req, res) => {
	try{
		const displayWinners: any = []
		const giveawayId = parseInt(req.params.id)
		if(isNaN(giveawayId) === true){
			return res.status(404).send("Giveaway not found, cannot display winners.")
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
				
		const goodMeasure: any = await Long.findOne({
			'shop': session.shop,
			'id': giveawayId
		})
		if(goodMeasure === null){
			return res.status(404).send("Giveaway not found, cannot display winners.")		
		}
		if(goodMeasure.winnersChosen === false){
			if(new Date(goodMeasure.endDate) > new Date()){
				return res.status(403).send("Cannot choose a winner on a giveaway that is either upcoming or currently active.")
			}
			let iter: any[] = []
			for (let i = 0; i < goodMeasure.winnersTotal; i++){
				iter.push(i)
			}
			const entries: any[] = await Long.aggregate([
				{'$match': {'shop': session.shop}},
				{'$match': {'id': giveawayId}},
				{'$unwind': '$entries'},
				{'$project': {
					'_id': 0,
					'entries': 1
				}}
			])
			if(entries.length === 0){
				return res.status(404).send("Nobody wins when not a single person has entered your giveaway.")
			}
			if(entries.length < goodMeasure.winnersTotal){
				return res.status(403).send("Not enough entries to select a winners, the number of entries must be more than the total possible winners.")
			}
			let prizedWinners: any[] = []
			let checker: any = []
			let counter: number = 0
			let allCombined: any[] = []

			entries.forEach((person: any) => {
				const obj = person.entries
				for(let i = 0; i < obj.points; i++){
					allCombined.push(obj)
				}
			})
			//console.log(allCombined)

			let shuffle = (entries: any[]): any[] => {
				let currentIndex = entries.length
				let randomIndex: number

				while(currentIndex != 0){
					randomIndex = Math.floor(Math.random() * currentIndex)
					currentIndex--
					[entries[currentIndex], entries[randomIndex]] = [entries[randomIndex], entries[currentIndex]]
				}

				return entries
			}
			let shuffledEntries = shuffle(allCombined)
			//console.log(shuffledEntries)
			iter.forEach((head: any) => {
				head++
				let theOne = shuffledEntries[Math.floor(Math.random() * shuffledEntries.length)]
				if(checker.includes(theOne) === true){
					// To include a time out
					while (checker.includes(theOne) === true){
						theOne = shuffledEntries[Math.floor(Math.random() * shuffledEntries.length)]
					}
				}
				theOne.position = head
				checker.push(theOne)
				prizedWinners.push(theOne)
			})
			if(prizedWinners.length !== goodMeasure.winnersTotal){
				return res.status(403).send("Could not choose a winner, try again!")
			}
			prizedWinners.forEach(async (pusher: any) => {
				const finder = await Long.findOne(
					{
						'shop': session.shop,
						'id': giveawayId,
					},
					{
						'_id': 0,
						'winners': {
							'$elemMatch': {'prizeId': pusher.position}
						}
					}
				)
				const exact = finder.winners[0]
				//console.log(exact)
				
				await Long.updateOne(
					{
						'shop': session.shop,
						'id': giveawayId,
						'winners.prizeId': pusher.position
					},
					{
						'$set': {
							'winners.$.prizeId': exact.prizeId,
							'winners.$.voucherPrize': exact.voucherPrize,
							'winners.$.entrantName': `${pusher.firstName} ${pusher.lastName}`,
							'winners.$.entrantEmail': pusher.email
						}
					}
				)
			})
			const closer = await Long.updateOne(
				{
					'shop': session.shop,
					'id': giveawayId
				},
				{
					'$set': {
						'winnersChosen': true
					}
				}
			)

			if(closer.modifiedCount !== 1){
				return res.status(403).send("Could not choose a winner, try again!")
			}
		}
		const anotherMeasure = await Long.findOne(
			{
				'shop': session.shop,
				'id': giveawayId
			},
			{
				'_id': 0,
				'winners': 1
			}
		)

		anotherMeasure.winners.forEach((what: any) => {
			displayWinners.push(what)
		})

		//console.log(prizedWinners)
		res.json(displayWinners)
	} catch(err: any) {
		console.log(err)
	}
})

campaign.post('/long/delete/all', checkApiAuth, async (req, res) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const longs = await Long.find({
			'shop': session.shop
		})

		longs.forEach(async (item: any) => {
			await Grand.deleteMany({
				'shop': session.shop,
				'id': item.grandEventId
			})
		})
		await Long.deleteMany({
			'shop': session.shop
		})

		res.send("Successfully deleted every long event.")
	} catch(err: any){
		console.log(err)
		return err
	}
})

campaign.get('/:id/gift', checkApiAuth, async (req, res) => {
	try{
		console.log("at least here")
		const giveawayId = parseInt(req.params.id)
		if(isNaN(giveawayId) === true){
			return res.status(404).send("This giveaway does not exist")
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const giveaway = await Long.findOne(
			{
				'shop': session.shop,
				'id': giveawayId,
				'winnersChosen': true
			}
		)
		if(giveaway === null){
			return res.status(404).send("Choose winners first before you attempt to send them gifts")
		}
		
		const checkDuplication = await Long.findOne(
			{
				'shop': session.shop,
				'id': giveawayId,
				'winnersGifted': true
			}
		)
		if(checkDuplication !== null){
			return res.status(403).send("The gifts have already been sent.")
		}
		const errorCounter: any[] = []

		giveaway.winners.forEach(async (item: any) => {
			const disCode: string = generateDiscountCode(8)
			const amount: string = item.voucherPrize.toString()+".00"
			//console.log(disCode)
			console.log(amount)
			const client = new Shopify.Clients.Graphql(session.shop, session.accessToken)
			const discount: any = await client.query({
				data: {
					"query": `mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
						discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
							codeDiscountNode {
								codeDiscount{
									...on DiscountCodeBasic {
										codes(first: 1) {
											edges {
												node {
													code
												}
											}
										}
									}
								}
							}
							userErrors {
								field
								message
							}
						}
					}`,
					"variables": {
						"basicCodeDiscount": {
							"appliesOncePerCustomer": true,
							"code": disCode,
							"customerGets": {
								"items": {
									"all": true
								},
								"value": {
									"discountAmount": {
										"amount": amount,
										"appliesOnEachItem": false
									}
								}
							},
							"customerSelection": {
								"all": true
							},
							"endsAt": null,
							"minimumRequirement": {
								"quantity": {
									"greaterThanOrEqualToQuantity": "1"
								}
							},
							"startsAt": new Date(Date.now()).toISOString(),
							"title": giveaway.name,
							"usageLimit": 1
						}
					}
				}
			})

			const logger = discount.body.data.discountCodeBasicCreate.codeDiscountNode.codeDiscount.codes.edges[0].node.code
			console.log(logger)
			
			if(!logger){
				errorCounter.push("something")
			}

			const updateWinner = await Long.updateOne(
				{
					'shop': session.shop,
					'id': giveawayId,
					'winners.prizeId': item.prizeId
				},
				{
					'$set': {
						'winners.$.discountCode': disCode
					}
				}
			)

			console.log(updateWinner)
		})
		console.log(errorCounter)
		if(errorCounter.length !== 0){
			return res.status(403).send("Error! Please try again and if this persists contact support.")
		}

		giveaway.entries.forEach(async (item: any) => {
			try{
				let doesExist = await Customers.findOne({
					'shop': session.shop,
					'email': item.email
				})
				//console.log(item)
				let ph: number 
				giveaway.winners.forEach((gman: any) => {
					gman.entrantEmail === item.email ? ph = 1 : ph = 0
				})
				console.log(ph)
				if(doesExist === null){
					new Customers({
						'shop': session.shop,
						'email': item.email,
						'lastName': item.lastName,
						'firstName': item.firstName,
						'totalCampaignsParticipated': 1,
						'totalPoints': item.points,
						'totalCampaignsWon': ph
					}).save()
				} else {
					const updateCustomers = await Customers.updateOne(
						{
							'shop': session.shop,
							'email': item.email
						},
						{
							'$inc': {
								'totalPoints': item.points,
								'totalCampaignsParticipated': 1,
								'totalCampaignsWon': ph
							}
						}
					)

					console.log(updateCustomers)
				}
			} catch(err: any){
				console.log(err)
			}
		})		

		await Long.updateOne(
			{
				'shop': session.shop,
				'id': giveawayId
			},
			{
				'$set': {
					'winnersGifted': true
				}
			}
		)
		if(giveaway.templateId){
			await SavedLong.findOne(
				{
					'shop': session.shop,
					'id': giveaway.templateId
				},
				{
					'$set': {'active': false}
				}
			)
		}

		res.send("Successfully sent gifts")
	} catch(err: any){
		console.log(err)
	}
})

campaign.get('/long/:id/edit', checkApiAuth, async (req, res) => {
	try{
		const render: renderFor = [
			{
				"plan": "Ultimate",
				"page": "pages/longevent-edit",
				"layer": "layouts/main-ultimate"
			},
			{
				"plan": "Standard",
				"page": "pages/longevent-edit",
				"layer": "layouts/main-standard"
			},
			{
				"plan": "Starter",
				"page": "pages/longevent-edit",
				"layer": "layouts/main-starter"
			}
		]
		divide(req, res, render)
	} catch(err: any){
		console.log(err)
	}
})

campaign.post('/long/:id/edit', checkApiAuth, async (req, res) => {
	try {
		const data = req.body.form
		console.log(req.body.form)
		const giveawayId = parseInt(req.params.id)
		if(isNaN(giveawayId) === true){
			return res.status(404).send("This giveaway does not exist")
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const store = await Shop.findOne({'shop': session.shop})
		
		const long =  await Long.findOne({
			'shop': session.shop,
			'id': giveawayId
		})

		if(long === null){
			return res.status(404).send("Error, it appears that this event does not exist.")
		}

		if(new Date(long.endDate) < new Date()){
			return res.status(403).send("Error! You cannot edit an event that has already past.")
		}

		if(new Date(`${data.endDate}`) < new Date()){
			return res.status(403).send("The end date of a giveaway cannot be in the past")
		}

		if(store === null){
			return res.status(404).send("Error, shop was not found")
		}

		if(parseInt(data.ofWinners) > 10 || parseInt(data.ofWinners) <= 0){
			return res.status(403).send("You cannot have more than 10 winners or a zero (0) winner")
		}

		const longEvents: any = await Long.find({'shop': session.shop})
		const rapidEvents = await RapidChild.find({'shop': session.shop})
		let keyValue: any[] = []

		if(longEvents.length !== 0){
			let cleaned: any[] = []	
			longEvents.forEach((item: any) => {
				if(item.id !== giveawayId){
					cleaned.push(item)
				}
			})		
			cleaned.forEach((item: any) => {
				const itemStart = new Date(item.startDate)
				const itemEnd = new Date(item.endDate)
				const givStart = new Date(`${data.startDate}`)
				const givEnd = new Date(`${data.endDate}`)
				
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
		}
		
		if(rapidEvents.length !== 0){
			let cleaned: any[] = []	
			rapidEvents.forEach((item: any) => {
				if(item.id !== giveawayId){
					cleaned.push(item)
				}
			})
			cleaned.forEach((item: any) => {
				const itemStart = new Date(item.startDate)
				const itemEnd = new Date(item.endDate)
				const givStart = new Date(`${data.startDate}`)
				const givEnd = new Date(`${data.endDate}`)

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
		}

		if(keyValue.length !== 0) {
			return res.status(403).send("Cannot create giveaway, scheduling conflict detected.")
		}

		const longUpdate =  await Long.updateOne(
			{
				'shop': session.shop,
				'id': giveawayId
			},
			{
				'$set': {
					'name': data.name,
					'startDate': new Date(data.startDate),
					'endDate': new Date(data.endDate),
					'distributionType': data.distribution,
					'winnersTotal': parseInt(data.ofWinners)
				}
			}
		)

		console.log(longUpdate)
		
		if(data.distribution === "Equitable"){
			res.send(`/campaign/long/new/equitable?id=${giveawayId}`)
		} else if (data.distribution === "Hierarchical"){
			res.send(`/campaign/long/new/hierarchical?id=${giveawayId}&winners=${data.ofWinners}`)
		} else {
			res.status(403).send("Error, choose a distribution type")
		}
	} catch(err: any){
		console.log(err)
		//res.status(401).send("Error, could not submit the form")
	}
})

// Rapid events

campaign.get('/rapid/new', checkAuth, async (req, res) => {
	try{
		const render: renderFor = [
			{
				"plan": "Ultimate",
				"page": "pages/rapidevent-create",
				"layer": "layouts/main-ultimate"
			},
			{
				"plan": "Standard",
				"page": "pages/rapidevent-create",
				"layer": "layouts/main-standard"
			},
			{
				"plan": "Starter",
				"page": "pages/rapidevent-create",
				"layer": "layouts/main-starter"
			}
		]
		divide(req, res, render)
	} catch(err: any){
		console.log(err)
	}
})

campaign.post('/rapid/new', checkApiAuth, async (req, res) => {
	try{
		const data = req.body.event
		const giveawayId = Math.floor(Math.random() * 1000000000)
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		//const store = await Shop.findOne({'shop': session.shop})

		// Validator
		const dates: any[] = data.dates
		let allEventsEver: any[] = []
		const long = await Long.find({'shop': session.shop})
		long.forEach((item) => {
			let start = Number(new Date(item.startDate))
			let end = Number(new Date(item.endDate))
			for(let i = 0; start <= end; i++){
				start = Number(new Date(item.startDate))+(1000*60*60*24*i)
				allEventsEver.push(new Date(start).toLocaleDateString('en-ZA'))
			}
		})
		const rapid = await RapidChild.find({'shop': session.shop})
		rapid.forEach((item: any) => {
			allEventsEver.push(new Date(item.startDate).toLocaleDateString('en-ZA'))
		})
		let clashingDates: any[] = []
		if(allEventsEver.length !== 0){
			allEventsEver.forEach((item: string) => {
				if(dates.includes(item) && !clashingDates.includes(item)){
					clashingDates.push(item)
				}
			})
		}
		if(clashingDates.length !== 0){
			return res.status(403).send("Clashing dates have been found, please use the provided validator to check.")
		}

		// The creation of a rapid event
		const rapidId = Math.floor(Math.random() * 1000000000)
		const grandId = Math.floor(Math.random() * 1000000000)
		const formattedDates: any[] = []
		dates.forEach((item: string) => {
			formattedDates.push(new Date(item))
		})
		new Rapid({
			'shop': session.shop,
			'id': rapidId,
			'name': data.name,
			'dates': formattedDates,
			'grandEvent': {
				'id': grandId
			},
			'goals': {
				'totalRevenue': data.totalRevenue,
				'totalEntries': data.totalEntries
			},
			'winnersChosen': false,
			'winnersGifted': false,
			'winnersTotal': formattedDates.length,
			'prizes': {
				'normalPrize': parseInt(data.normal),
				'grandPrize': parseInt(data.grand)
			},
			'qualifying': data.qualifying,
			'qualifyingId': data.qualifyingId,
			'qualifyingItems': data.qualifyingItems
		}).save()

		

		let childrenEvents: any[] = []
		formattedDates.forEach(async (item: any) => {
			const childId = Math.floor(Math.random() * 1000000000)
			new RapidChild({
				'shop': session.shop,
				'id': childId,
				'name': data.name,
				'eventType': 'Rapid',
				'parentId': rapidId,
				'startDate': item,
				'endDate': new Date(Number(new Date(item))+(1000*60*60*23)),
				'winnersChosen': false,
				'winnersGifted': false,
				'winnersTotal': 1,
				'winner': {
					'prizeId': 1,
					'voucherPrize': parseInt(data.normal)
				},
				'qualifying': data.qualifying,
				'qualifyingId': data.qualifyingId,
				'qualifyingItems': data.qualifyingItems
			}).save()

			childrenEvents.push({
				'id': childId,
				'name': data.name,
				'eventType': 'Rapid'
			})
		})

		new Grand({
			'shop': session.shop,
			'id': grandId,
			'name': data.name,
			'awaiting': false,
			'winnersChosen': false,
			'winnersGifted': false,
			'winners': [{
				'prizeId': 1,
				'voucherPrize': parseInt(data.grand)
			}],
			'childrenEvents': childrenEvents
		}).save()

		res.send(`/campaign/rapid/${rapidId}`)
	} catch(err: any){
		console.log(err)
		return err
	}
})

campaign.post('/rapid/validator', checkApiAuth, async (req, res) => {
	try{
		const dates: any[] = req.body.dates
		if(dates.length === 0){
			return res.status(403).send("Please choose a date before validating.")
		}
		let allEventsEver: any[] = []
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const long = await Long.find({'shop': session.shop})
		long.forEach((item) => {
			let start = Number(new Date(item.startDate))
			let end = Number(new Date(item.endDate))
			for(let i = 0; start <= end; i++){
				start = Number(new Date(item.startDate))+(1000*60*60*24*i)
				allEventsEver.push(new Date(start).toLocaleDateString('en-ZA'))
			}
		})
		const rapid = await RapidChild.find({'shop': session.shop})
		rapid.forEach((item: any) => {
			allEventsEver.push(new Date(item.startDate).toLocaleDateString('en-ZA'))
		})
		let clashingDates: any[] = []
		if(allEventsEver.length !== 0){
			allEventsEver.forEach((item: string) => {
				if(dates.includes(item) && !clashingDates.includes(item)){
					clashingDates.push(item)
				}
			})
		}

		res.json(clashingDates)
	} catch(err: any){
		console.log(err)
		return err
	}
})

campaign.get('/rapid/:id', checkAuth, async (req, res) => {
	try {
		const eventId = parseInt(req.params.id)
		if(isNaN(eventId) === true){
			return res.status(404).render('pages/404')
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const event = await Rapid.findOne({'shop': session.shop, 'id': eventId})
		if(event === null){
			return res.status(404).render('pages/404')
		}
		const render: renderFor = [
			{
				"plan": "Ultimate",
				"page": "pages/rapidevent",
				"layer": "layouts/main-ultimate"
			},
			{
				"plan": "Standard",
				"page": "pages/rapidevent",
				"layer": "layouts/main-standard"
			},
			{
				"plan": "Starter",
				"page": "pages/rapidevent",
				"layer": "layouts/main-starter"
			}
		]
		divide(req, res, render)
	} catch(err: any) {
		console.log(err)
	}
})

campaign.post('/rapid/delete/all', checkApiAuth, async (req, res) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const rapids = await Rapid.find({
			'shop': session.shop
		})

		rapids.forEach(async (item: any) => {
			await Grand.deleteMany({
				'shop': session.shop,
				'id': item.grandEvent.id
			})
		})
		await Rapid.deleteMany({
			'shop': session.shop
		})
		await RapidChild.deleteMany({
			'shop': session.shop
		})
		res.send("Successfully deleted every rapid event.")
	} catch(err: any){
		console.log(err)
		return err
	}
})

campaign.post('/rapid/:id/choose-winners', checkApiAuth, async (req, res) => {
	try{
		const eventId = parseInt(req.params.id)
		if(isNaN(eventId) === true){
			return res.status(404).send("Event not found, cannot display winners.")
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
				
		const goodMeasure: any = await RapidChild.findOne({
			'shop': session.shop,
			'id': eventId
		})
		if(goodMeasure === null){
			return res.status(404).send("Event not found, cannot display winners.")		
		}
		if(goodMeasure.winnersChosen === false){
			if(new Date(goodMeasure.endDate) > new Date()){
				return res.status(403).send("Cannot choose a winner on a giveaway that is either upcoming or currently active.")
			}
			let iter: any[] = []
			for (let i = 0; i < goodMeasure.winnersTotal; i++){
				iter.push(i)
			}
			const entries: any[] = await RapidChild.aggregate([
				{'$match': {'shop': session.shop}},
				{'$match': {'id': eventId}},
				{'$unwind': '$entries'},
				{'$project': {
					'_id': 0,
					'entries': 1
				}}
			])
			if(entries.length === 0){
				return res.status(404).send("Nobody wins when not a single person has entered your giveaway.")
			}
			if(entries.length < goodMeasure.winnersTotal){
				return res.status(403).send("Not enough entries to select a winners, the number of entries must be more than the total possible winners.")
			}
			let prizedWinners: any[] = []
			let checker: any = []
			let counter: number = 0
			let allCombined: any[] = []
			//console.log(entries)
			entries.forEach((person: any) => {
				const obj = person.entries
				for(let i = 0; i < obj.points; i++){
					allCombined.push(obj)
				}
			})

			//console.log(allCombined)

			let shuffle = (entries: any[]): any[] => {
				let currentIndex = entries.length
				let randomIndex: number

				while(currentIndex != 0){
					randomIndex = Math.floor(Math.random() * currentIndex)
					currentIndex--
					[entries[currentIndex], entries[randomIndex]] = [entries[randomIndex], entries[currentIndex]]
				}

				return entries
			}
			let shuffledEntries = shuffle(allCombined)
			console.log(shuffledEntries.length)
			iter.forEach((head: any) => {
				head++
				let theOne = shuffledEntries[Math.floor(Math.random() * shuffledEntries.length)]
				if(checker.includes(theOne) === true){
					// To include a time out
					while (checker.includes(theOne) === true){
						theOne = shuffledEntries[Math.floor(Math.random() * shuffledEntries.length)]
					}
				}
				theOne.position = head
				checker.push(theOne)
				prizedWinners.push(theOne)
			})
			console.log(prizedWinners)
			console.log(goodMeasure.winnersTotal)
			if(prizedWinners.length !== goodMeasure.winnersTotal){
				return res.status(403).send("Could not choose a winner, try again!")
			}

			prizedWinners.forEach(async (pusher: any) => {
				const finder = await RapidChild.findOne(
					{
						'shop': session.shop,
						'id': eventId,
					},
					{
						'_id': 0,
						'winner': 1
					}
				)
				const exact = goodMeasure.winner
				//console.log(exact)
				
				const p = await RapidChild.updateOne(
					{
						'shop': session.shop,
						'id': eventId
					},
					{
						'$set': {
							'winner.prizeId': exact.prizeId,
							'winner.voucherPrize': exact.voucherPrize,
							'winner.entrantName': `${pusher.firstName} ${pusher.lastName}`,
							'winner.entrantEmail': pusher.email
						}
					}
				)
				//console.log(p)
			})
			const closer = await RapidChild.updateOne(
				{
					'shop': session.shop,
					'id': eventId
				},
				{
					'$set': {
						'winnersChosen': true
					}
				}
			)
			console.log(closer)
			
			if(closer.modifiedCount !== 1){
				return res.status(403).send("Could not choose a winner, try again!")
			}
			const retrieve = await Rapid.findOne({
				'shop': session.shop,
				'id': goodMeasure.parentId
			})
			const updateGrand = await Grand.updateOne(
				{
					'shop': session.shop,
					'id': retrieve.grandEvent.id,
					'childrenEvents.id': eventId
				},
				{
					'$set': {
						'childrenEvents.$.winnersChosen': true,
						'childrenEvents.$.winners': [{
							'entrantName': `${prizedWinners[0].firstName} ${prizedWinners[0].lastName}`,
							'entrantEmail': prizedWinners[0].email
						}]
					}
				}
			)

			console.log(updateGrand)

			const isLast = await RapidChild.find(
				{
					'shop': session.shop,
					'parentId': goodMeasure.parentId,
					'winnersChosen': false
				}
			)

			if(isLast.length === 0){
				const updateGrand = await Grand.updateOne(
					{
						'shop': session.shop,
						'id': retrieve.grandEvent.id
					},
					{
						'$set': {
							'awaiting': true
						}
					}
				)

				const updateRapid = await Rapid.updateOne(
					{
						'shop': session.shop,
						'id': retrieve.id
					},
					{
						'$set': {
							'winnersChosen': true
						}
					}
				)
			}
		}
		
		if(goodMeasure.winnersChosen === true){
			return res.status(403).send("Sorry! You have already chosen a winner.")
		}
		const anotherMeasure = await RapidChild.findOne(
			{
				'shop': session.shop,
				'id': eventId
			},
			{
				'_id': 0,
				'winner': 1
			}
		)

		const displayWinner = anotherMeasure.winner
		console.log(displayWinner)
		//console.log(prizedWinners)
		res.send("You have successfully picked a winner!")
	} catch(err: any) {
		console.log(err)
	}
})

campaign.get('/discount', checkApiAuth, async (req, res) => {

	const session = await Shopify.Utils.loadCurrentSession(req, res, true)
	const client = new Shopify.Clients.Graphql(session.shop, session.accessToken)
	const discount: any = await client.query({
		data: {
			"query": `mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
				discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
					codeDiscountNode {
						codeDiscount{
							...on DiscountCodeBasic {
								codes(first: 1) {
									edges {
										node {
											code
										}
									}
								}
							}
						}
					}
					userErrors {
						field
						message
					}
				}
			}`,
			"variables": {
				"basicCodeDiscount": {
					"appliesOncePerCustomer": true,
					"code": "ALEXISSS",
					"customerGets": {
						"items": {
							"all": true
						},
						"value": {
							"discountAmount": {
								"amount": "100.00",
								"appliesOnEachItem": false
							}
						}
					},
					"customerSelection": {
						"all": true
					},
					"endsAt": null,
					"minimumRequirement": {
						"quantity": {
							"greaterThanOrEqualToQuantity": "1"
						}
					},
					"startsAt": new Date(Date.now()).toISOString(),
					"title": "One giveaway",
					"usageLimit": 1
				}
			}
		}
	})
	const logger = discount.body.data.discountCodeBasicCreate.codeDiscountNode.codeDiscount.codes.edges[0].node.code
	console.log(logger)
	res.json(discount)
})

campaign.get('/rapid/:id/gift', checkApiAuth, async (req, res) => {
	try{
		const giveawayId = parseInt(req.params.id)
		if(isNaN(giveawayId) === true){
			return res.status(404).send("This giveaway does not exist")
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const giveaway = await RapidChild.findOne(
			{
				'shop': session.shop,
				'id': giveawayId,
				'winnersChosen': true
			}
		)
		if(giveaway === null){
			return res.status(404).send("Choose winners first before you attempt to send them gifts")
		}
		
		const checkDuplication = await RapidChild.findOne(
			{
				'shop': session.shop,
				'id': giveawayId,
				'winnersGifted': true
			}
		)
		if(checkDuplication !== null){
			return res.status(403).send("The gifts have already been sent.")
		}

		const disCode: string = generateDiscountCode(8)
		const amount: string = giveaway.winner.voucherPrize.toString()+".00"
		console.log(disCode)
		console.log(amount)
		const client = new Shopify.Clients.Graphql(session.shop, session.accessToken)
		const discount: any = await client.query({
			data: {
				"query": `mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
					discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
						codeDiscountNode {
							codeDiscount{
								...on DiscountCodeBasic {
									codes(first: 1) {
										edges {
											node {
												code
											}
										}
									}
								}
							}
						}
						userErrors {
							field
							message
						}
					}
				}`,
				"variables": {
					"basicCodeDiscount": {
						"appliesOncePerCustomer": true,
						"code": disCode,
						"customerGets": {
							"items": {
								"all": true
							},
							"value": {
								"discountAmount": {
									"amount": amount,
									"appliesOnEachItem": false
								}
							}
						},
						"customerSelection": {
							"all": true
						},
						"endsAt": null,
						"minimumRequirement": {
							"quantity": {
								"greaterThanOrEqualToQuantity": "1"
							}
						},
						"startsAt": new Date(Date.now()).toISOString(),
						"title": giveaway.name,
						"usageLimit": 1
					}
				}
			}
		})
		const logger = discount.body.data.discountCodeBasicCreate.codeDiscountNode.codeDiscount.codes.edges[0].node.code
		console.log(logger)
		
		if(!logger){
			return res.status(403).send("Error! Please try again and if this persists contact support.")
		}

		giveaway.entries.forEach(async (item: any) => {
			let doesExist = await Customers.findOne({
				'shop': session.shop,
				'email': item.email
			})
			//console.log(item)
			let ph: number
			giveaway.winner.entrantEmail === item.email ? ph = 1 : ph = 0
			
			if(doesExist === null){
				new Customers({
					'shop': session.shop,
					'email': item.email,
					'lastName': item.lastName,
					'firstName': item.firstName,
					'totalCampaignsParticipated': 1,
					'totalPoints': item.points,
					'totalCampaignsWon': ph
				}).save()
			} else {
				await Customers.updateOne(
					{
						'shop': session.shop,
						'email': item.email
					},
					{
						'$inc': {
							'totalPoints': item.points,
							'totalCampaignsParticipated': 1,
							'totalCampaignsWon': ph
						}
					}
				)
			}
		})

		const updateState = await RapidChild.updateOne(
			{
				'shop': session.shop,
				'id': giveawayId
			},
			{
				'$set': {
					'winnersGifted': true,
					'winner.discountCode': disCode
				}
			}
		)
		console.log(updateState)

		const isLast = await RapidChild.find(
			{
				'shop': session.shop,
				'parentId': giveaway.parentId,
				'winnersGifted': false
			}
		)

		if(isLast.length === 0){
			const parent = await Rapid.findOne({
				'shop': session.shop,
				'id': giveaway.parentId
			})

			const updateRapid = await Rapid.updateOne(
				{
					'shop': session.shop,
					'id': parent.id
				},
				{
					'$set': {
						'winnersGifted': true
					}
				}
			)
		}

		if(giveaway.templateId){
			await SavedLong.findOne(
				{
					'shop': session.shop,
					'id': giveaway.templateId
				},
				{
					'$set': {'active': false}
				}
			)
		}
		//res.json(discount)
		res.send("Successfully sent created and sent discount code to winner!")
	} catch(err: any){
		console.log(err)
	}
})

campaign.post('/rapid/:id/delete', checkApiAuth, async (req, res) => {
	try{
		const giveawayId = parseInt(req.params.id)
		if(isNaN(giveawayId) === true){
			return res.status(404).send("This giveaway does not exist")
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const giveaway = await Rapid.findOne(
			{
				'shop': session.shop,
				'id': giveawayId
			}
		)
		if(giveaway === null){
			return res.status(404).send("Giveaway does not exist")
		}

		await Rapid.deleteOne({
			'shop': session.shop,
			'id': giveawayId
		})

		await RapidChild.deleteMany({
			'shop': session.shop,
			'parentId': giveaway.id
		})

		await Grand.deleteOne({
			'shop': session.shop,
			'id': giveaway.grandEvent.id
		})

		res.send("/campaign/giveaways")
	} catch(err: any){
		console.log(err)
	}
})


// Grand events

campaign.post('/grand/:id/choose-winners', checkApiAuth, async (req, res) => {
	try{
		const displayWinners: any = []
		const giveawayId = parseInt(req.params.id)
		if(isNaN(giveawayId) === true){
			return res.status(404).send("Giveaway not found, cannot display winners.")
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
				
		const goodMeasure: any = await Grand.findOne({
			'shop': session.shop,
			'id': giveawayId
		})
		if(goodMeasure === null){
			return res.status(404).send("Giveaway not found, cannot display winners.")		
		}
		if(goodMeasure.winnersChosen === false){
			const isDone = await Grand.aggregate([
				{'$match': {'shop': session.shop}},
				{'$match': {'id': giveawayId}},
				{'$unwind': '$childrenEvents'},
				{'$match': {'childrenEvents.winnersChosen': false}}
			])
			console.log(isDone)
			if(isDone.length !== 0){
				return res.status(403).send("Sorry! Some participating events are still without winners, cannot pick a grand champion.")
			}
			const entries: any = []
			const stagedEntries: any[] = await Grand.aggregate([
				{'$match': {'shop': session.shop}},
				{'$match': {'id': giveawayId}},
				{'$unwind': '$childrenEvents'},
				{'$unwind': '$childrenEvents.winners'},
				{'$project': {
					'winners': '$childrenEvents.winners',
					'_id': 0
				}}
			])
			console.log(stagedEntries)
			stagedEntries.forEach((item: any) => {
					const payload = item.winners
					entries.push(payload)
			})

			console.log(entries)
			if(entries.length === 0){
				return res.status(404).send("Nobody wins when not a single participating events has winners yet.")
			}
			let prizedWinners: any[] = []
			let checker: any = []
			let counter: number = 0
			let allCombined: any[] = []

			let shuffle = (entries: any[]): any[] => {
				let currentIndex = entries.length
				let randomIndex: number

				while(currentIndex != 0){
					randomIndex = Math.floor(Math.random() * currentIndex)
					currentIndex--
					[entries[currentIndex], entries[randomIndex]] = [entries[randomIndex], entries[currentIndex]]
				}

				return entries
			}
			let shuffledEntries = shuffle(entries)
			let theOne = shuffledEntries[Math.floor(Math.random() * shuffledEntries.length)]
			theOne.position = 1
			console.log(theOne)
			const finder = await Grand.findOne(
				{
					'shop': session.shop,
					'id': giveawayId,
				},
				{
					'_id': 0,
					'winners': {
						'$elemMatch': {'prizeId': theOne.position}
					}
				}
			)
			//console.log(finder)
			const exact = finder.winners[0]
			await Grand.updateOne(
				{
					'shop': session.shop,
					'id': giveawayId,
					'winners.prizeId': theOne.position
				},
				{
					'$set': {
						'winners.$.prizeId': exact.prizeId,
						'winners.$.voucherPrize': exact.voucherPrize,
						'winners.$.entrantName': theOne.entrantName,
						'winners.$.entrantEmail': theOne.entrantEmail
					}
				}
			)
			
			const closer = await Grand.updateOne(
				{
					'shop': session.shop,
					'id': giveawayId
				},
				{
					'$set': {
						'winnersChosen': true
					}
				}
			)
			
			if(closer.modifiedCount !== 1){
				return res.status(403).send("Could not choose a winner, try again!")
			}
		}
		
		if(goodMeasure.winnersChosen === true){
			return res.status(403).send("Sorry! You have already chosen a winner.")
		}
		
		const anotherMeasure = await Grand.findOne(
			{
				'shop': session.shop,
				'id': giveawayId
			},
			{
				'_id': 0,
				'winners': 1
			}
		)

		anotherMeasure.winners.forEach((what: any) => {
			displayWinners.push(what)
		})

		console.log(displayWinners)
		res.send("Youu have successfully picked a grand winner!")
	} catch(err: any) {
		console.log(err)
	}
})

campaign.get('/grand/:id/gift', checkApiAuth, async (req, res) => {
	try{
		const giveawayId = parseInt(req.params.id)
		if(isNaN(giveawayId) === true){
			return res.status(404).send("This giveaway does not exist")
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const giveaway = await Grand.findOne(
			{
				'shop': session.shop,
				'id': giveawayId,
				'winnersChosen': true
			}
		)
		if(giveaway === null){
			return res.status(404).send("Choose winners first before you attempt to send them gifts")
		}
		
		const checkDuplication = await Grand.findOne(
			{
				'shop': session.shop,
				'id': giveawayId,
				'winnersGifted': true
			}
		)
		if(checkDuplication !== null){
			return res.status(403).send("The gifts have already been sent.")
		}
		const errorCounter: any[] = []

		giveaway.winners.forEach(async (item: any) => {
			const disCode: string = generateDiscountCode(8)
			const amount: string = item.voucherPrize.toString()+".00"
			console.log(disCode)
			console.log(amount)
			const client = new Shopify.Clients.Graphql(session.shop, session.accessToken)
			const discount: any = await client.query({
				data: {
					"query": `mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
						discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
							codeDiscountNode {
								codeDiscount{
									...on DiscountCodeBasic {
										codes(first: 1) {
											edges {
												node {
													code
												}
											}
										}
									}
								}
							}
							userErrors {
								field
								message
							}
						}
					}`,
					"variables": {
						"basicCodeDiscount": {
							"appliesOncePerCustomer": true,
							"code": disCode,
							"customerGets": {
								"items": {
									"all": true
								},
								"value": {
									"discountAmount": {
										"amount": amount,
										"appliesOnEachItem": false
									}
								}
							},
							"customerSelection": {
								"all": true
							},
							"endsAt": null,
							"minimumRequirement": {
								"quantity": {
									"greaterThanOrEqualToQuantity": "1"
								}
							},
							"startsAt": new Date(Date.now()).toISOString(),
							"title": giveaway.name,
							"usageLimit": 1
						}
					}
				}
			})

			const logger = discount.body.data.discountCodeBasicCreate.codeDiscountNode.codeDiscount.codes.edges[0].node.code
			console.log(logger)
			
			if(!logger){
				errorCounter.push("something")
			}

			const updateWinner = await Grand.updateOne(
				{
					'shop': session.shop,
					'id': giveawayId,
					'winners.prizeId': item.prizeId
				},
				{
					'$set': {
						'winners.$.discountCode': disCode
					}
				}
			)

			console.log(updateWinner)
		})

		if(errorCounter.length !== 0){
			return res.status(403).send("Error! Please try again and if this persists contact support.")
		}
		

		await Grand.updateOne(
			{
				'shop': session.shop,
				'id': giveawayId
			},
			{
				'$set': {
					'winnersGifted': true,
					'awaiting': false
				}
			}
		)
		if(giveaway.templateId){
			await SavedLong.findOne(
				{
					'shop': session.shop,
					'id': giveaway.templateId
				},
				{
					'$set': {'active': false}
				}
			)
		}

		res.send("Successfully sent gifts")
	} catch(err: any){
		console.log(err)
	}
})


// An event

campaign.post('/:id/delete', checkApiAuth, async (req, res) => {
	try{
		const giveawayId = parseInt(req.params.id)
		if(isNaN(giveawayId) === true){
			return res.status(404).send("This giveaway does not exist")
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const giveaway = await Long.findOne(
			{
				'shop': session.shop,
				'id': giveawayId
			}
		)
		if(giveaway === null){
			return res.status(404).send("Giveaway does not exist")
		}
		if(giveaway.templateId && giveaway.winnersGifted === false){
			await SavedLong.updateOne(
				{
					'shop': session.shop,
					'id': giveaway.templateId
				},
				{
					'$set': {
						'active': false
					}
				}
			)
		}
		await Long.deleteOne({
			'shop': session.shop,
			'id': giveawayId
		})

		res.send("/campaign/giveaways")
	} catch(err: any){
		console.log(err)
	}
})

campaign.post('/store', checkApiAuth, async (req, res) => {
	try {
		let decoyId: string
		if (req.query.id && typeof req.query.id === 'string') {
					decoyId = req.query.id
		} else {
					return undefined
		}
		if(decoyId === undefined) {
			return res.status(404).send("Giveaway ID not defined")
		}
		const giveawayId: number = parseInt(decoyId)
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const giveaway: any = await Long.findOne(
			{
				'id': giveawayId,
				'shop': session.shop
			}
		)
		console.log(giveaway)
		if(giveaway === null){
			return res.status(404).send("Did not save, giveaway does not exist")
		}
		// check for the quota
		//templateGate(req, res, session.shop)
		const templates: any = await SavedLong.find({'shop': session.shop})
		const shopper: any = await Shop.findOne({'shop': session.shop})
		let count = templates.length
		let plan = shopper.pricePlan
		console.log("It runs and the count is "+count+" on a "+plan+" plan")
		if(plan === "Starter" && count > 2) {
			console.log("It passes here")
			return res.status(403).send("Sorry, you have reached your quota")
		} else if(plan === "Standard" && count > 6){
			return res.status(403).send("Sorry, you have reached your quota")
		} else if(plan ==="Ultimate" && count > 1000){
			return res.status(403).send("Sorry, you have reached your quota")
		}
		// check weather it already has a template from which it was made.
		if(giveaway.templateId){
			const checker = await SavedLong.findOne({
				'shop': session.shop,
				'id': giveaway.templateId
			})
			if(checker !== null){
				return res.status(403).send("This giveaway template already exist")
			}
		}
		// check whether it has a template made from an original copy
		const doesExist = await SavedLong.findOne(
			{
				'id': giveawayId,
				'shop': session.shop
			}
		)
		console.log(doesExist)
		if(doesExist !== null){
			return res.status(403).send("This giveaway template already exist")
		}
		const time: number = new Date(giveaway.endDate).getTime() - new Date(giveaway.startDate).getTime()
		let prizes: any[] = []
		giveaway.winners.forEach((her: any) => {
			prizes.push({
				"prizeId": her.prizeId,
				"voucherPrize": her.voucherPrize
			})
		})
		new SavedLong(
			{
				shop: session.shop,
				id: giveaway.id,
				name: giveaway.name,
				duration: time,
				active: false,
				distributionType: giveaway.distributionType,
				winnersTotal: giveaway.winnersTotal,
				winners: prizes
			}
		).save()
		res.send(`/campaign/template/${giveawayId}`)
	} catch(err: any) {
		console.log(err)
	}
})


// Templates

campaign.post('/template/:id/activate', checkApiAuth, async (req, res) => {
	try{
		const templateId = parseInt(req.params.id)
		if(isNaN(templateId) === true){
			return res.status(404).send("Error, template does not exist.")
		}
		const starter: number = req.body.future
		console.log(starter)
		if(typeof starter !== 'number'){
			return res.status(403).send("Choose the an appropriate date in the future from the listed buttons")
		}
		if(starter > 30){
			return res.status(403).send("The date you specified is currently not supported")
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const doesExist = await SavedLong.findOne({'shop': session.shop, 'id': templateId, 'active': true})
		//console.log(`Logging doesExist: ${doesExist}`)
		if(doesExist !== null){
			return res.status(403).send("This template is currently active")
		}
		// Check for active campaigns created from this template
		const fromInUse = await Long.findOne(
			{
				'shop': session.shop,
				'templateId': templateId,
				'winnersGifted': false
			}
		)
		console.log(fromInUse)
		if(fromInUse !== null){Long
			return res.status(403).send("This template currently has a giveaway that is either active, upcoming or awaiting the picking and gifting of winners")
		}
		// Check active campaigns this template was created from
		const forParent = await Long.findOne(
			{
				'shop': session.shop,
				'id': templateId,
				'winnersGifted': false
			}
		)
		console.log(forParent)
		if(forParent !== null){
			return res.status(403).send("This template currently has a giveaway that is either active, upcoming or awaiting the picking and gifting of winners")
		}
		const template = await SavedLong.findOne({'shop': session.shop, 'id': templateId})
		if(template === null){
			return res.status(404).send("This template was not found")
		}

		const newId = Math.floor(Math.random() * 1000000000)
		const dateNow = Date.now()
		let newStart: any
		let newEnd: any
		switch(starter){
			case 0:
				newStart = new Date(dateNow);
				newEnd = new Date(dateNow+template.duration);
				break;
			case 1:
				newStart = new Date(dateNow+(1000*60*60*24));
				newEnd = new Date((dateNow+(1000*60*60*24))+template.duration);
				break;
			case 3:
				newStart = new Date(dateNow+(1000*60*60*24*3));
				newEnd = new Date((dateNow+(1000*60*60*24*3))+template.duration);
				break;
			case 7:
				newStart = new Date(dateNow+(1000*60*60*24*7));
				newEnd = new Date((dateNow+(1000*60*60*24*7))+template.duration);
				break;
			case 14:
				newStart = new Date(dateNow+(1000*60*60*24*7));
				newEnd = new Date((dateNow+(1000*60*60*24*14))+template.duration);
				break;
			case 30:
				newStart = new Date(dateNow+(1000*60*60*24*30));
				newEnd = new Date((dateNow+(1000*60*60*24*30))+template.duration);
				break;
			default:
				newStart = new Date(dateNow);
				newEnd = new Date(dateNow+template.duration);
				break;
		}
		// Check for scheduling conflict
		const checkAll = await Long.find(
			{
				'shop': session.shop,
			}
		)
		let keyValue: any = []
		if(checkAll.length !== 0){
			checkAll.forEach((item) => {
				const itemStart = new Date(item.startDate)
				const itemEnd = new Date(item.endDate)
				const givStart = new Date(newStart)
				const givEnd = new Date(newEnd)

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
		}

		const rapid = await RapidChild.find({'shop': session.shop})
		if(rapid.length !== 0){
			rapid.forEach((item: any) => {
				const itemStart = new Date(item.startDate)
				const itemEnd = new Date(item.endDate)
				const givStart = new Date(newStart)
				const givEnd = new Date(newEnd)

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
		}

		if(keyValue.length !== 0) {
			return res.status(403).json(keyValue)
		}

		new Long(
			{
				shop: session.shop,
				id: newId,
				name: template.name,
				templateId,
				winnersChosen: false,
				winnersGifted: false,
				startDate: newStart,
				endDate: newEnd,
				distributionType: template.distributionType,
				winnersTotal: template.winnersTotal,
				winners: template.winners
			}
			
		).save()

		await SavedLong.updateOne(
			{
				'shop': session.shop,
				'id': templateId
			},
			{
				'$set': {
					'active': true
				}
			}
		)
		res.send(`You have successfully scheduled ${template.name} to run from ${new Date(newStart).toDateString()} to ${new Date(newEnd).toDateString()}.`)
	} catch(err: any) {
		console.log(err)
	}
})

campaign.get('/template/:id', checkAuth, forCommon, async (req, res) => {
	try{
		const templateId = parseInt(req.params.id)
		if(isNaN(templateId) === true){
			return res.status(404).render('pages/404')
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const template = await SavedLong.findOne(
			{
				'shop': session.shop,
				'id': templateId
			}
		)
		if(template === null){
			return res.status(404).render('pages/404')
		}

		const render: renderFor = [
			{
				"plan": "Ultimate",
				"page": "pages/campaign-template",
				"layer": "layouts/main-ultimate"
			},
			{
				"plan": "Standard",
				"page": "pages/campaign-template",
				"layer": "layouts/main-standard"
			},
			{
				"plan": "Starter",
				"page": "pages/campaign-template",
				"layer": "layouts/main-starter"
			}
		]
		divide(req, res, render)
	} catch(err: any){
		console.log(err)
	}
})

campaign.post('/template/:id/delete', checkApiAuth, async (req, res) => {
	try{
		const templateId = parseInt(req.params.id)
		if(isNaN(templateId) === true){
			return res.status(404).send("This giveaway does not exist")
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const template = await Long.findOne(
			{
				'shop': session.shop,
				'id': templateId
			}
		)
		if(template === null){
			return res.status(404).send("Giveaway does not exist")
		}
		await SavedLong.deleteOne({
			'shop': session.shop,
			'id': templateId
		})
		res.send("/")
	} catch(err: any){
		console.log(err)
	}
})

campaign.post('/template/delete/all', checkApiAuth, async (req, res) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		await SavedLong.deleteMany({
			'shop': session.shop
		})
		res.send("Successfully deleted every event template.")
	} catch(err: any){
		console.log(err)
		return err
	}
})

export default campaign