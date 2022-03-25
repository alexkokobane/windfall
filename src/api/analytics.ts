import express from 'express'
import Shopify from '@shopify/shopify-api'
import { Shop, Long, Grand, SavedLong, Customers, Quota, Rapid, RapidChild } from '../models/shop-model'
import checkAuth, { checkApiAuth } from '../utils/middlewares/check-auth'
import { deleteIncompleteLogin } from '../utils/middlewares/experimental'
import { templateGate } from '../utils/quotas'
import { forCommon, forStarter, forStandard, forUltimate } from '../utils/middlewares/price-plan'
import { divide, renderFor } from '../utils/render-divider'
import { generateDiscountCode } from '../utils/functions'

const analytics = express.Router()

analytics.get('/', checkApiAuth, async (req, res) => {
	try{
		res.send("Ha ha ha! Gotcha, this is a dummy URL.")
	} catch(err: any){
		console.log(err)
		return err
	}
})

analytics.get('/long/:id', checkApiAuth, async (req, res) => {
	try{
		const eventId = parseInt(req.params.id)
		if(isNaN(eventId) === true){
			return res.status(404).send("Error! Something is wrong with this event's id.")
		}

		const session = await Shopify.Utils.loadCurrentSession(req, res, true)

		const long =  await Long.findOne({
			'shop': session.shop,
			'id': eventId
		})

		if(long === null){
			return res.status(404).send("Error! Event could not be found.")
		}
		if(long.goals.totalRevenue === 0 && long.goals.totalEntries === 0){
			return res.json({"status": false})
		}
		const moneyMade: number = long.entries.length > 0 ? long.entries.reduce((sum: number, num: any) => sum+num.spent, 0) : 0
		const avgSpent: number = moneyMade > 0 ? moneyMade/long.entries.length : 0
		const revenueProgress: number = long.goals.totalRevenue > 0 ? (moneyMade/long.goals.totalRevenue)*100 : 0
		const projectedAvgSpent: number = long.goals.totalEntries > 0 ? long.goals.totalRevenue/long.goals.totalEntries : 0 
		const avgSpentProgress: number = projectedAvgSpent > 0 ? (avgSpent/projectedAvgSpent)*100 : 0
		const avgSpentData : number = long.analytics.avgSpentCounter
		const netProfit: number = moneyMade - long.winners.reduce((sum: number, num: any) => sum+num.voucherPrize, 0)
		const stats = {
			"averageSpent": avgSpent,
			"revenueGoal": long.goals.totalRevenue,
			"revenueGross": moneyMade,
			"revenueProgress": revenueProgress,
			"averageSpentProjected": projectedAvgSpent,
			"averageSpentProgress": avgSpentProgress,
			"revenueNet": netProfit,
			"status": true
		}
		res.json(stats)
	} catch(err: any){
		console.log(err)
		return err
	}
})

analytics.get('/rapid/:id', checkApiAuth, async (req, res) => {
	try{
		const eventId = parseInt(req.params.id)
		if(isNaN(eventId) === true){
			return res.status(404).send("Error! Something is wrong with this event's id.")
		}

		const session = await Shopify.Utils.loadCurrentSession(req, res, true)

		const parent =  await Rapid.findOne({
			'shop': session.shop,
			'id': eventId
		})

		const children = await RapidChild.find({
			'shop': session.shop,
			'parentId': eventId
		})

		if(parent === null){
			return res.status(404).send("Error! Event could not be found.")
		}
		if(parent.goals.totalRevenue === 0 && parent.goals.totalEntries === 0){
			return res.json({"status": false})
		}
		let moneyMade: number = 0
		let allEntries: number = 0
		children.forEach((item: any) => {
			moneyMade+= item.entries.length > 0 ? item.entries.reduce((sum: number, num: any) => sum+num.spent, 0) : 0
			allEntries+= item.entries.length
		})
		const totalPrizes: number = parent.prizes.grandPrize+(parent.prizes.normalPrize*parent.dates.length)
		const avgSpent: number = moneyMade > 0 ? moneyMade/allEntries : 0
		const revenueProgress: number = parent.goals.totalRevenue > 0 ? (moneyMade/parent.goals.totalRevenue)*100 : 0
		const projectedAvgSpent: number = parent.goals.totalEntries > 0 ? parent.goals.totalRevenue/parent.goals.totalEntries : 0 
		const avgSpentProgress: number = projectedAvgSpent > 0 ? (avgSpent/projectedAvgSpent)*100 : 0
		const netProfit: number = moneyMade - totalPrizes
		const stats = {
			"averageSpent": avgSpent,
			"revenueGoal": parent.goals.totalRevenue,
			"revenueGross": moneyMade,
			"revenueProgress": revenueProgress,
			"averageSpentProjected": projectedAvgSpent,
			"averageSpentProgress": avgSpentProgress,
			"revenueNet": netProfit,
			"totalPrizes": totalPrizes,
			"status": true
		}
		console.log(stats)
		res.json(stats)
	} catch(err: any){
		console.log(err)
		return err
	}
})

analytics.get('/all-revenue', checkApiAuth, async (req, res) => {
	try{
		let total = 0
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const long = await Long.find({
			'shop': session.shop,
		})
		const rapid = await RapidChild.find({
			'shop': session.shop
		})
		long.forEach((item: any) => {
		 	const money: number = item.entries.length > 0 ? item.entries.reduce((sum: number, num: any) => sum+num.spent, 0) : 0
		 	total+=money
		})
		rapid.forEach((item: any) => {
			const money: number = item.entries.length > 0 ? item.entries.reduce((sum: number, num: any) => sum+num.spent, 0) : 0
		 	total+=money
		})
		res.send(total.toString())
	} catch(err: any){
		console.log(err)
		return err
	}
})

analytics.get('/qouta', checkApiAuth, async (req, res) => {
	try{
		const dateNow = new Date(Date.now())
		const priorSix = []
		for(let i: number = -5, i > 0; i++){
			const month: number = dateNow.getMonth() + i
			priorSix.push(new Date(dateNow.setMonth(month)))
		}
	} catch(err: any){
		console.log(err)
		return err
	}
})

export default analytics