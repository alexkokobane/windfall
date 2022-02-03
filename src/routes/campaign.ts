import express from 'express'
import Shopify from '@shopify/shopify-api'
import Shop from '../models/shop-model'
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
		const store = await Shop.findOne({shop: session.shop})
		console.log(new Date(`${data.startDate}T${data.startTime}:00`))
		console.log(new Date(`${data.endDate}T${data.endTime}:00`))
		if(store === null){
			return res.status(404).send("Error, shop was not found")
		} else {
			await Shop.findOneAndUpdate(
				{shop: session.shop},
				{
					$push: {
						campaigns: {
							id: giveawayId,
							name: data.name,
							startDate: new Date(`${data.startDate}T${data.startTime}:00`),
							endDate: new Date(`${data.endDate}T${data.endTime}:00`),
							distributionType: data.distribution,
							winnersTotal: parseInt(data.ofWinners)
						}
					}
				},
				{new: true}
			)
		}

		if(data.distribution === "Equitable"){
			res.send(`/campaign/new/equitable?id=${giveawayId}`)
		} else if (data.distribution === "Hierarchical"){
			res.send(`/campaign/new/hierarchical?id=${giveawayId}&winners=${data.ofWinners}`)
		} else {
			res.status(401).send("Error, choose a distribution type")
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
		const giveawayData = await Shop.findOne({
			'shop': session.shop, 'campaigns.id': giveawayId
		}) 
		
		if(giveawayData === null){
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
		const shop = await Shop.findOne({'shop': session.shop, 'campaigns.id': giveawayId}) 
		if(shop === null){
			return res.status(404).render('pages/404')
		}
		const giveawayData = shop.campaigns.find((item: any) => item.id === giveawayId )

		if(giveawayData.winnersTotal !== giveawayWinners){
			res.status(404).render('pages/404')
		}
		res.render('pages/hierarchical', { data: giveawayData})
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
		const shop = await Shop.findOne({'shop': session.shop, 'campaigns.id': giveawayId})
		if(shop === null){
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
		//console.log(await Shop.findOne({'shop': session.shop, 'campaigns.id': giveawayId}))
		await Shop.findOneAndUpdate(
			{'shop': session.shop, 'campaigns.id': giveawayId },
			{ '$set': {'campaigns.$.winners' : winnerInfo}}
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
		const giveaway = await Shop.findOne(
			{'campaigns.id': giveawayId}, 
			{
				'shop': session.shop, 
				campaigns : {'$elemMatch' : {'id': giveawayId}}
			}
		)
		if(giveaway === null){
			return res.status(404).send('Invalid giveaway')
		}
		const ofWinners: number = giveaway.campaigns[0].winnersTotal
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
		await Shop.findOneAndUpdate(
			{'shop': session.shop, 'campaigns.id': giveawayId },
			{ '$set': {'campaigns.$.winners' : winnerInfo}}
		)
		res.send(`/campaign/${giveawayId}`)
	} catch(err: any) {
		console.log(err)
	}
})

campaign.get('/:id', checkAuth, async (req, res) => {
	try {
		const giveawayId = parseInt(req.params.id)
		if(giveawayId == null){
			return res.status(404).render('pages/404')
		}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const giveaway = await Shop.findOne({'shop': session.shop, 'campaigns.id': giveawayId})
		if(giveaway === null){
			return res.status(404).render('pages/404')
		}
		const realObject = await Shop.findOne(
			{'campaigns.id': giveawayId}, 
			{
				'shop': session.shop, 
				campaigns : {'$elemMatch' : {'id': giveawayId}}
			}
		)
		console.log(realObject)
		res.render('pages/campaign', {data: realObject})
	} catch(err: any) {
		console.log(err)
	}
})

campaign.put('/:id', checkAuth, async (req, res) => {
	res.send("The give away has been edited")
})

campaign.delete('/:id', checkAuth, async (req, res) => {
	res.send("Ressource has been deleted")
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
		const realObject = await Shop.findOne(
			{
				'campaigns.id': giveawayId,
				'shop': session.shop
			}, 
			{
				'shop': session.shop, 
				campaigns : {'$elemMatch' : {'id': giveawayId}}
			}
		)
		if(realObject === null){
			return res.status(404).send("Did not save, giveaway does not exist")
		}
		const data: any = realObject.campaigns[0]
		await Shop.findOneAndUpdate(
			{shop: session.shop},
			{
				$push: {
					campaignTemplate: {
						id: data.id,
						name: data.name,
						distributionType: data.distributionType,
						winnersTotal: data.winnersTotal,
						winners: data.winners
					}
				}
			},
			{new: true}
		)
		res.send("Successfully saved your giveaway")
	} catch(err: any) {
		console.log(err)
	}
})

export default campaign

