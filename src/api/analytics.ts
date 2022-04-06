import express from 'express'
import Shopify from '@shopify/shopify-api'
import { Shop, Long, Grand, SavedLong, Customers, Quota, Rapid, RapidChild } from '../models/shop-model'
import checkAuth, { checkApiAuth } from '../utils/middlewares/check-auth'
import { deleteIncompleteLogin } from '../utils/middlewares/experimental'
import { templateGate } from '../utils/quotas'
import { forCommon, forStarter, forStandard, forUltimate, forStandardApi } from '../utils/middlewares/price-plan'
import { divide, renderFor } from '../utils/render-divider'
import { generateDiscountCode, newSubs } from '../utils/functions'

const analytics = express.Router()

analytics.get('/', checkApiAuth, forStandard, async (req, res) => {
	try{
		//res.send("Ha ha ha! Gotcha, this is a dummy URL.")
		const render: renderFor = [
			{
				"plan": "Ultimate",
				"page": "pages/home",
				"layer": "layouts/main-ultimate"
			},
			{
				"plan": "Standard",
				"page": "pages/standard/analytics-standard",
				"layer": "layouts/main-standard"
			},
			{
				"plan": "Starter",
				"page": "pages/starter/home-starter",
				"layer": "layouts/main-starter"
			}
		]
		divide(req, res, render)
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

analytics.get('/quota/usage', checkApiAuth, async (req, res) => {
	try{
		const usage: any = {}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const quotaFind = await Quota.findOne({'shop': session.shop})
		const shop = await Shop.findOne({'shop': session.shop})
		// update usage quota
		const month = new Date(Date.now()).toISOString().substring(0, 7)			
		if(quotaFind === null){
			const entryQuotas: any[] = newSubs(shop.pricePlan)
			new Quota({
				shop: session.shop,
				plan: shop.pricePlan,
				entries: entryQuotas
			}).save()
		} else if(quotaFind.entries.length === 0){
			const entryQuotas: any[] = newSubs(shop.pricePlan)
			const updateEntries = await Quota.updateOne(
				{
					'shop': session.shop
				},
				{
					'$set': {
						'plan': shop.pricePlan,
						'entries': entryQuotas
					}
				}
			)
		} else {
			const newbie = await Quota.findOne({
				'shop': session.shop,
				'entries.month': month
			})
			console.log(newbie)
			
			if(newbie === null){
				const newMonth = newSubs(shop.pricePlan)
				console.log(newMonth)
				console.log({
					'month': newMonth[newMonth.length - 1].month,
					'value': 0,
					'maxValue': newMonth[newMonth.length - 1].maxValue,
					'plan': newMonth[newMonth.length - 1].plan
				})
				const upQplus = await Quota.updateOne(
					{
						'shop': session.shop
					},
					{
						'$push': {
							'entries': {
								'month': newMonth[newMonth.length - 1].month,
								'value': 0,
								'maxValue': newMonth[newMonth.length - 1].maxValue,
								'plan': newMonth[newMonth.length - 1].plan
							}
						}
					}
				)
				console.log(upQplus)
			}
		}

		const quota = await Quota.findOne({'shop': session.shop})

		usage.max = quota.entries[quota.entries.length - 1].maxValue
		usage.usage = (quota.entries[quota.entries.length - 1].value/quota.entries[quota.entries.length - 1].maxValue)*100
		usage.entries = quota.entries.slice(quota.entries.length - 6)
		res.json(usage)
	} catch(err: any){
		console.log(err)
		return err
	}
})

analytics.get('/long-distribution', checkApiAuth, forStandardApi, async (req, res) => {
	try{
		let results: any = {}
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const hierarchical = await Long.find({
			'shop': session.shop,
			'distributionType': "Hierarchical"
		})
		const equitable = await Long.find({
			'shop': session.shop,
			'distributionType': "Equitable"
		})
		//const shop = await Shop.findOne({'shop': session.shop})

		// This must be fixed ASAP
		results.currencyCode = hierarchical[hierarchical.length - 1].currencyCode
		console.log(hierarchical[hierarchical.length - 1].currencyCode)
		console.log(hierarchical.length)
		// goal success rate
		let hiGoalSuccess: number = 0, eqGoalSuccess: number = 0
		hierarchical.forEach((item) => {
			if(item.goals.totalRevenue < item.entries.reduce((sum: number, num: any) => sum+num.spent, 0)){
				hiGoalSuccess+=1
			}

			if(item.goals.totalEntries < item.entries.length){
				hiGoalSuccess+=1
			}
		})
		equitable.forEach((item) => {
			if(item.goals.totalRevenue < item.entries.reduce((sum: number, num: any) => sum+num.spent, 0)){
				eqGoalSuccess+=1
			}

			if(item.goals.totalEntries < item.entries.length){
				eqGoalSuccess+=1
			}
		})
		results.goalSuccess = {
			'hiRate': (hiGoalSuccess/hierarchical.length)*100,
			'eqRate': (eqGoalSuccess/equitable.length)*100
		}

		// profitability rate
		let hiNetRevenue: number = 0, eqNetRevenue: number = 0
		hierarchical.forEach((item) => {
			const moneyMade: number = item.entries.length > 0 ? item.entries.reduce((sum: number, num: any) => sum+num.spent, 0) : 0
			const budget: number = item.winners.reduce((sum: number, num: any) => sum+num.voucherPrize, 0)
			if(moneyMade > budget*2){
				hiNetRevenue+=1
			}
		})
		equitable.forEach((item) => {
			const moneyMade: number = item.entries.length > 0 ? item.entries.reduce((sum: number, num: any) => sum+num.spent, 0) : 0
			const budget: number = item.winners.reduce((sum: number, num: any) => sum+num.voucherPrize, 0)
			if(moneyMade > budget*2){
				eqNetRevenue+=1
			}
		})
		results.revenueSuccess = {
			'hiRate': (hiNetRevenue/hierarchical.length)*100,
			'eqRate': (eqNetRevenue/equitable.length)*100
		}

		// spending rate
		let hiMoney: number = 0, eqMoney: number = 0, hiEntries: number = 0, eqEntries: number = 0
		hierarchical.forEach((item) => {
			hiMoney+=item.entries.reduce((sum: number, num: any) => sum+num.spent, 0)
			hiEntries+=item.entries.length
		})
		equitable.forEach((item) => {
			eqMoney+=item.entries.reduce((sum: number, num: any) => sum+num.spent, 0)
			eqEntries+=item.entries.length
		})
		console.log(`${hiMoney} divided by ${hiEntries}`)
		results.spendingAverage = {
			'hiRate': hiMoney/hiEntries,
			'eqRate': eqMoney/eqEntries
		}

		// overall performance
		const hiTotal = ((hiGoalSuccess/hierarchical.length)*100) + ((hiNetRevenue/hierarchical.length)*100) + (hiMoney/hiEntries)
		const eqTotal = ((eqGoalSuccess/equitable.length)*100) + ((eqGoalSuccess/equitable.length)*100) + (eqMoney/eqEntries)
		results.totalPerformance = {
			hiTotal,
			eqTotal
		}

		res.json(results)
	} catch(err: any){
		console.log(err)
		return err	
	}
})

analytics.get('/lucky-days', checkApiAuth, forStandardApi, async (req, res) => {
	try{
		let sun = 0, mon = 0, tue = 0, wed = 0, thu = 0, fri = 0, sat = 0
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const long = await Long.find({'shop': session.shop})
		const rapid = await RapidChild.find({'shop': session.shop})
		let transactions: any[] = []
		let metadata: any[] = []
		long.forEach((item: any) => {
			item.entries.forEach((person: any) => {
				metadata.push(person.metadata)
			})
		})
		rapid.forEach((item: any) => {
			item.entries.forEach((person: any) => {
				metadata.push(person.metadata)
			})
		})
		metadata.forEach((item: any) => {
			item.forEach((arr: any) => {
				transactions.push(arr)
			})
		})

		//const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
		transactions.forEach((item: any) => {
			let day: number = new Date(item.timestamp).getDay()
			console.log(day)
			switch(day){
				case 0:
					sun+=item.spent
					break;
				case 1:
					mon+=item.spent
					break;
				case 2:
					tue+=item.spent
					break;
				case 3:
					wed+=item.spent
					break;
				case 4:
					thu+=item.spent
					break;
				case 5:
					fri+=item.spent
					break;
				case 6:
					sat+=item.spent
					break;
				default:
					return null
					break;
			}
		})

		const results = {
			"Sunday": sun,
			"Monday": mon,
			"Tuesday": tue,
			"Wednesday": wed,
			"Thursday": thu,
			"Friday": fri,
			"Saturday": sat
		}

		res.json(results)
	} catch(err: any){
		console.log(err)
		return err
	}
})

export default analytics