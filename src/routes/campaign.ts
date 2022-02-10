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
		
		if(new Date(`${data.endDate}T${data.endTime}:00`) < new Date()){
			return res.status(403).send("The end date of a giveaway cannot be in the past")
		}

		if(store === null){
			return res.status(404).send("Error, shop was not found")
		}
		if(parseInt(data.ofWinners) > 10 || parseInt(data.ofWinners) <= 0){
			return res.status(403).send("You cannot hve more than 10 winners or a zero (0) winner")
		}
		const checkActive = await Campaign.aggregate([
			{'$match': {'shop': session.shop}},
			{'$match': {'campaigns.state': 'Active'}},
		])
		const checkUpcoming = await Campaign.aggregate([
			{'$match': {'shop': session.shop}},
			{'$match': {'campaigns.startDate': new Date(`${data.startDate}T${data.startTime}:00`) }},
			{'$match': {'campaigns.endDate': new Date(`${data.endDate}T${data.endTime}:00`) }}
		])
		const status: string = new Date(`${data.startDate}T${data.startTime}:00`) > new Date() ? 'Upcoming' : 'Active'
		if(status === 'Active' && checkActive.length !== 0){
			if(new Date(checkActive[0].campaigns.endDate) > new Date(`${data.startDate}T${data.startTime}:00`)){
				return res.status(403).send(`The next giveaway can only start from ${new Date(checkActive[0].campaigns.endDate)}`)
			}
			return res.status(403).send("Choose another date, there can only be a single giveaway at a time")
		}
		if(status === 'Upcoming' && checkUpcoming.length !== 0){
			let keyValue = []
			
			checkUpcoming.forEach((item) => {
				const upStart = new Date(item.campaigns.startDate)
				const upEnd = new Date(item.campaigns.endDate)
				const givStart = new Date(`${data.startDate}T${data.startTime}:00`)
				const givEnd = new Date(`${data.endDate}T${data.endTime}:00`)
				keyValue.push(upStart)
			})
			return res.status(403).send("Giveaway scheduling conflict detected")
		}
		new Campaign(
			{
				shop: session.shop,
				id: giveawayId,
				name: data.name,
				state: status ,
				startDate: new Date(`${data.startDate}T${data.startTime}:00`),
				endDate: new Date(`${data.endDate}T${data.endTime}:00`),
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
		const giveawayId = parseInt(req.params.id)
		if(isNaN(giveawayId) === true){
			return res.status(404).render('pages/404')
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const giveaway = await Campaign.findOne({'shop': session.shop, 'id': giveawayId})
		if(giveaway === null){
			return res.status(404).render('pages/404')
		}
		const goodMeasure: any = await Campaign.findOne({
			'shop': session.shop,
			'id': giveawayId
		})
		if(new Date(goodMeasure.endDate) > new Date()){
			return res.status(403).send("Cannot choose a winner on a giveaway that is either upcoming or currently active.")
		}
		let iter: any = []
		for (let i = 0; i < goodMeasure.winnersTotal; i++){
			iter.push(i)
		}
		const entries: any[] = await Campaign.aggregate([
			{'$match': {'shop': session.shop}},
			{'$match': {'campaigns.id': giveawayId}},
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
			return res.status(403).send("Not enough entries to select a winners")
		}
		let prizedWinners: any = []
		let checker: any = []
		iter.forEach((head: any) => {
			let winner = head++
			let theOne = entries[Math.floor(Math.random() * entries.length)]
			if(checker.includes(theOne) === true){
				// To include a time out
				while (checker.includes(theOne) === true){
					theOne = entries[Math.floor(Math.random() * entries.length)]
				}
			}
			checker.push(theOne)
			prizedWinners.push({winner: theOne})
		})
		if(prizedWinners.length !== goodMeasure.winnersTotal){
			return res.status(403).send("Could choose a winner, try again!")
		}
		console.log(entries)
		console.log(prizedWinners)
		res.json(prizedWinners)
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
		const giveaway: any = Campaign.findOne(
			{
				'id': giveawayId,
				'shop': session.shop
			}
		)
		if(giveaway === null){
			return res.status(404).send("Did not save, giveaway does not exist")
		}
		const doesExist = await Saved.findOne(
			{
				'id': giveawayId,
				'shop': session.shop
			}
		)
		if(doesExist !== null){
			return res.status(403).send("This giveaway template already exist")
		}
		new Saved(
			{
				shop: session.shop,
				id: giveaway.id,
				name: giveaway.name,
				distributionType: giveaway.distributionType,
				winnersTotal: giveaway.winnersTotal,
				winners: giveaway.winners
			}
		)
		res.send("Successfully saved your giveaway")
	} catch(err: any) {
		console.log(err)
	}
})

export default campaign

