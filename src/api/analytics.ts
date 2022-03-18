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
			"revenue": moneyMade,
			"revenueProgress": revenueProgress,
			"projectedAverageSpent": projectedAvgSpent,
			"averageSpentProgress": avgSpentProgress,
			"netProfit": netProfit,
			"averageSpentCounter": avgSpentData,
			"status": true
		}
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
		 	total+money
		})
		rapid.forEach((item: any) => {
			const money: number = item.entries.length > 0 ? item.entries.reduce((sum: number, num: any) => sum+num.spent, 0) : 0
		 	total+money
		})
		res.send(total)
	} catch(err: any){
		console.log(err)
		return err
	}
})

export default analytics