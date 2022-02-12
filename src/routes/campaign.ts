import express from 'express'
import Shopify from '@shopify/shopify-api'
import { Shop, Saved, Super, Campaign, Customers } from '../models/shop-model'
import checkAuth from '../utils/middlewares/check-auth'
import { deleteIncompleteLogin } from '../utils/middlewares/experimental'


const campaign = express.Router()

campaign.get('/giveaways', checkAuth, async (req, res) => {
	res.render('pages/campaigns')
})

campaign.get('/new', checkAuth, async (req, res) => {
	
	res.render('pages/campaign-create')
})

campaign.post('/new', checkAuth, async (req, res) => {
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
		if(parseInt(data.ofWinners) > 10 || parseInt(data.ofWinners) <= 0){
			return res.status(403).send("You cannot have more than 10 winners or a zero (0) winner")
		}

		const checkAll = await Campaign.find(
			{
				'shop': session.shop,
			}
		)
		
		if(checkAll.length !== 0){
			let keyValue = []
			
			checkAll.forEach((item) => {
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
			if(keyValue.length !== 0) {
				return res.status(403).send("Cannot create giveaway, scheduling conflict detected.")
			}
		}
		//const status: string = new Date(`${data.startDate}`) > new Date() ? 'Upcoming' : 'Active'
		new Campaign(
			{
				shop: session.shop,
				id: giveawayId,
				name: data.name,
				winnersChosen: false,
				winnersGifted: false,
				startDate: new Date(`${data.startDate}`),
				endDate: new Date(`${data.endDate}`),
				distributionType: data.distribution,
				winnersTotal: parseInt(data.ofWinners)
			}
			
		).save()
		
		if(data.distribution === "Equitable"){
			res.send(`/campaign/new/equitable?id=${giveawayId}`)
		} else if (data.distribution === "Hierarchical"){
			res.send(`/campaign/new/hierarchical?id=${giveawayId}&winners=${data.ofWinners}`)
		} else {
			res.status(403).send("Error, choose a distribution type")
		}
	} catch(err: any){
		console.log(err)
		//res.status(401).send("Error, could not submit the form")
	}
})

campaign.get('/new/equitable', checkAuth, async (req, res) => {
	try {
		let decoyId: string
		if (req.query.id && typeof req.query.id === 'string') {
		  	decoyId = req.query.id
		} else {
		  	return undefined
		}
		const giveawayId: number = parseInt(decoyId)
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const giveaway = await Campaign.findOne({
			'shop': session.shop, 'id': giveawayId
		}) 
		
		if(giveaway === null){
			return res.status(404).render('pages/404')
		}
		res.render('pages/equitable')
	} catch(err: any) {
		console.log(err)
	}
})

campaign.get('/new/hierarchical', checkAuth, async (req, res) => {
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
			return null
		}
		const giveawayId: number = parseInt(decoyId)
		const giveawayWinners: number = parseInt(decoyWinners)
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const giveaway = await Campaign.findOne({'shop': session.shop, 'id': giveawayId}) 
		if(giveaway === null){
			return res.status(404).render('pages/404')
		}
		
		if(giveaway.winnersTotal !== giveawayWinners){
			res.status(404).render('pages/404')
		}
		res.render('pages/hierarchical')
	} catch(err: any) {
		console.log(err)
	}
})

campaign.post('/new/hierarchical/create', checkAuth, async (req, res) => {
	try {
		const amounts = req.body.amounts
		const giveawayId = req.body.id
		console.log(amounts)
		console.log(giveawayId)
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const giveaway = await Campaign.findOne({'shop': session.shop, 'id': giveawayId})
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
		
		await Campaign.updateOne(
			{'shop': session.shop, 'id': giveawayId },
			{ '$set': {'winners' : winnerInfo}}
		)
		res.send(`/campaign/${giveawayId}`)
	} catch(err: any) {
		console.log(err)
	}
})

campaign.post('/new/equitable/create', checkAuth, async (req, res) => {
	try {
		const amount = req.body.amounts
		const giveawayId = req.body.id
		console.log(amount)
		console.log(giveawayId)
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const giveaway = await Campaign.findOne(
			{
				'shop': session.shop, 
				'id': giveawayId
			}
		)
		if(giveaway === null){
			return res.status(404).send('Invalid giveaway')
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
		await Campaign.updateOne(
			{'shop': session.shop, 'id': giveawayId },
			{ '$set': {'winners' : winnerInfo}}
		)
		res.send(`/campaign/${giveawayId}`)
	} catch(err: any) {
		console.log(err)
	}
})

campaign.get('/:id', checkAuth, async (req, res) => {
	try {
		const giveawayId = parseInt(req.params.id)
		if(isNaN(giveawayId) === true){
			return res.status(404).render('pages/404')
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const giveaway = await Campaign.findOne({'shop': session.shop, 'id': giveawayId})
		if(giveaway === null){
			return res.status(404).render('pages/404')
		}
		res.render('pages/campaign')
	} catch(err: any) {
		console.log(err)
	}
})

campaign.post('/:id/edit', checkAuth, async (req, res) => {
	res.send("The give away has been edited")
})

campaign.post('/:id/delete', checkAuth, async (req, res) => {
	try{
		const giveawayId = parseInt(req.params.id)
		if(isNaN(giveawayId) === true){
			return res.status(404).send("This giveaway does not exist")
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const giveaway = await Campaign.findOne(
			{
				'shop': session.shop,
				'id': giveawayId
			}
		)
		if(giveaway === null){
			return res.status(404).send("Giveaway does not exist")
		}
		await Campaign.deleteOne({
			'shop': session.shop,
			'id': giveawayId
		})
		res.send("/campaign/giveaways")
	} catch(err: any){
		console.log(err)
	}
})

campaign.post('/:id/choose-winners', checkAuth, async (req, res) => {
	try{
		const displayWinners: any = []
		const giveawayId = parseInt(req.params.id)
		if(isNaN(giveawayId) === true){
			return res.status(404).send("Giveaway not found, cannot display winners.")
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
				
		const goodMeasure: any = await Campaign.findOne({
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
			const entries: any[] = await Campaign.aggregate([
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
				const finder = await Campaign.findOne(
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
				
				await Campaign.updateOne(
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
			const closer = await Campaign.updateOne(
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
		const anotherMeasure = await Campaign.findOne(
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

campaign.post('/store', checkAuth, async (req, res) => {
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
		const giveaway: any = await Campaign.findOne(
			{
				'id': giveawayId,
				'shop': session.shop
			}
		)
		console.log(giveaway)
		if(giveaway === null){
			return res.status(404).send("Did not save, giveaway does not exist")
		}
		const doesExist = await Saved.findOne(
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
		new Saved(
			{
				shop: session.shop,
				id: giveaway.id,
				name: giveaway.name,
				duration: time,
				distributionType: giveaway.distributionType,
				winnersTotal: giveaway.winnersTotal,
				winners: giveaway.winners
			}
		).save()
		res.send(`/campaign/template/${giveawayId}`)
	} catch(err: any) {
		console.log(err)
	}
})

campaign.get('/template/:id', checkAuth, async (req, res) => {
	try{
		const templateId = parseInt(req.params.id)
		if(isNaN(templateId) === true){
			return res.status(404).render('pages/404')
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const template = await Saved.findOne(
			{
				'shop': session.shop,
				'id': templateId
			}
		)
		if(template === null){
			return res.status(404).render('pages/404')
		}
		res.render('pages/campaign-template')
	} catch(err: any){
		console.log(err)
	}
})

campaign.post('/template/:id/delete', checkAuth, async (req, res) => {
	try{
		const templateId = parseInt(req.params.id)
		if(isNaN(templateId) === true){
			return res.status(404).send("This giveaway does not exist")
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const template = await Campaign.findOne(
			{
				'shop': session.shop,
				'id': templateId
			}
		)
		if(template === null){
			return res.status(404).send("Giveaway does not exist")
		}
		await Saved.deleteOne({
			'shop': session.shop,
			'id': templateId
		})
		res.send("/")
	} catch(err: any){
		console.log(err)
	}
})

export default campaign

