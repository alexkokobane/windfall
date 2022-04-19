import express from 'express'
import Shopify from '@shopify/shopify-api'
import axios from 'axios'
import { Shop, Long, Grand, SavedLong, Customers, Quota, Rapid, RapidChild, SavedRapid } from '../models/shop-model'
import checkAuth, { checkApiAuth } from '../utils/middlewares/check-auth'
import { deleteIncompleteLogin } from '../utils/middlewares/experimental'
import { templateGate } from '../utils/quotas'
import { 
	forCommon, 
	forCommonApi,
	forFreebie, 
	forAppetizer, 
	forMain, 
	forAppetizerApi, 
	forFreebieApi, 
	forMainApi 
} from '../utils/middlewares/price-plan'
import { divide, renderFor } from '../utils/render-divider'
import { generateDiscountCode, newSubs } from '../utils/functions'

const analytics = express.Router()

analytics.get('/long/:id', checkApiAuth, async (req, res) => {
	try{
		const eventId = parseInt(req.params.id)
		if(isNaN(eventId) === true){
			return res.status(404).send("Error! Something is wrong with this event's id.")
		}

		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const shop = await Shop.findOne({'shop': session.shop})
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
			"averageSpent": parseFloat(avgSpent.toFixed(2)),
			"revenueGoal": parseFloat(long.goals.totalRevenue.toFixed(2)),
			"revenueGross": parseFloat(moneyMade.toFixed(2)),
			"revenueProgress": parseFloat(revenueProgress.toFixed(2)),
			"averageSpentProjected": parseFloat(projectedAvgSpent.toFixed(2)),
			"averageSpentProgress": parseFloat(avgSpentProgress.toFixed(2)),
			"revenueNet": parseFloat(netProfit.toFixed(2)),
			"currencyCode": shop.currencyCode,
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
		const shop = await Shop.findOne({'shop': session.shop})
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
			"averageSpent": parseFloat(avgSpent.toFixed(3)),
			"revenueGoal": parseFloat(parent.goals.totalRevenue.toFixed(3)),
			"revenueGross": parseFloat(moneyMade.toFixed(3)),
			"revenueProgress": parseFloat(revenueProgress.toFixed(3)),
			"averageSpentProjected": parseFloat(projectedAvgSpent.toFixed(3)),
			"averageSpentProgress": parseFloat(avgSpentProgress.toFixed(3)),
			"revenueNet": parseFloat(netProfit.toFixed(3)),
			"totalPrizes": parseFloat(totalPrizes.toFixed(3)),
			"currencyCode": shop.currencyCode,
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
		const shop = await Shop.findOne({'shop': session.shop})
		const long = await Long.find({
			'shop': session.shop,
			'currencyCode': shop.currencyCode
		})
		const rapid = await RapidChild.find({
			'shop': session.shop,
			'currencyCode': shop.currencyCode
		})
		long.forEach((item: any) => {
			const money: number = item.entries.length > 0 ? item.entries.reduce((sum: number, num: any) => sum+num.spent, 0) : 0
			total+=money
		})
		rapid.forEach((item: any) => {
			const money: number = item.entries.length > 0 ? item.entries.reduce((sum: number, num: any) => sum+num.spent, 0) : 0
			total+=money
		})
		res.json({
			'total': parseFloat((total).toFixed(2)),
			'currencyCode': shop.currencyCode
		})
	} catch(err: any){
		console.log(err)
		return res.status(403).send("Oops! Couldn't gather the total revenue.")
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
			//console.log(newbie)
			
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
				//console.log(upQplus)
			}
		}

		const quota = await Quota.findOne({'shop': session.shop})

		usage.max = quota.entries[quota.entries.length - 1].maxValue
		usage.usage = parseFloat(((quota.entries[quota.entries.length - 1].value/quota.entries[quota.entries.length - 1].maxValue)*100).toFixed(2))
		usage.entries = quota.entries.slice(quota.entries.length - 6)
		res.json(usage)
	} catch(err: any){
		console.log(err)
		return err
	}
})

analytics.get('/long-distribution', checkApiAuth, forMainApi, async (req, res) => {
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
		const shop = await Shop.findOne({'shop': session.shop})

		results.currencyCode = shop.currencyCode

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
			'hiRate': parseFloat(((hiGoalSuccess/hierarchical.length)*100).toFixed(2)),
			'eqRate': parseFloat(((eqGoalSuccess/equitable.length)*100).toFixed(2))
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
			'hiRate': parseFloat(((hiNetRevenue/hierarchical.length)*100).toFixed(2)),
			'eqRate': parseFloat(((eqNetRevenue/equitable.length)*100).toFixed(2))
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
			'hiRate': parseFloat((hiMoney/hiEntries).toFixed(2)),
			'eqRate': parseFloat((eqMoney/eqEntries).toFixed(2))
		}

		// overall performance
		const hiTotal = Math.round(((hiGoalSuccess/hierarchical.length)*100) + ((hiNetRevenue/hierarchical.length)*100) + (hiMoney/hiEntries))
		const eqTotal = Math.round(((eqGoalSuccess/equitable.length)*100) + ((eqGoalSuccess/equitable.length)*100) + (eqMoney/eqEntries))
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

analytics.get('/events-performance', checkApiAuth, forMainApi, async (req, res) => {
	try {
		const dateNow = Date.now()
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const shop = await Shop.findOne({'shop': session.shop})
		const rapid = await RapidChild.find({
			'shop': session.shop,
			'startDate': {'$lt': new Date(dateNow)},
			'endDate': {'$lt': new Date(dateNow)},
			'currencyCode': shop.currencyCode
		})
		const long = await Long.find({
			'shop': session.shop,
			'startDate': {'$lt': new Date(dateNow)},
			'endDate': {'$lt': new Date(dateNow)},
			'currencyCode': shop.currencyCode
		})
		const rapidParent = await Rapid.find({
			'shop': session.shop,
			'currencyCode': shop.currencyCode
		})	
		const totalEvents = rapid.length+long.length

		// long events
		let goalsAchievedLong = 0 // goal achievement
		let avgSpendingLong = 0 // average spending
		let highProfitRateLong = 0 // profitability rate
		long.forEach((item: any) => {
			const revenue = item.entries.reduce((sum: number, num: any) => sum+num.spent, 0)
			const budget: number = item.winners.reduce((sum: number, num: any) => sum+num.voucherPrize, 0)
			if(item.goals.totalRevenue < revenue){
				goalsAchievedLong+=1
			}
			if(item.entries.length > 0){
				avgSpendingLong+= revenue/item.entries.length
			}
			//console.log(avgSpendingLong)
			if(revenue > budget*2){
				highProfitRateLong+=1
			}
		})

		// rapid events
		let goalsAchievedRapid = 0 // goal achievement
		let avgSpendingRapid = 0 // average spending
		let highProfitRateRapid = 0 // profitability rate
		rapid.forEach((item: any) => {
			// look for total budget in the parent
			let goal = 0
			const index = rapidParent.findIndex((meti: any) => meti.id === item.parentId)
			//console.log(index)
			if(index >= 0){
				goal+=rapidParent[index].goals.totalRevenue
			}

			// begin calculating
			const revenue = item.entries.reduce((sum: number, num: any) => sum+num.spent, 0)
			const budget: number = item.winner.voucherPrize
			if(goal < revenue){
				goalsAchievedLong+=1
			}
			if(item.entries.length > 0){
				avgSpendingRapid+= revenue/item.entries.length
			}
			if(revenue > budget*2){
				highProfitRateLong+=1
			}
		})

		// aggregate
		const goalsAchieved = goalsAchievedLong+goalsAchievedRapid // goal achievement
		const avgSpending = parseFloat((avgSpendingLong+avgSpendingRapid).toFixed(2)) // average spending
		const highProfitRate = highProfitRateLong+highProfitRateRapid // profitability rate

		const longPerformance = {
			goalsAchievedLong,
			"avgSpendingLong": parseFloat((avgSpendingLong).toFixed(2)),
			highProfitRateLong,
			"totalEvents": long.length,
			"goalsAchievedShare": parseFloat(((goalsAchievedLong/goalsAchieved)*100).toFixed(2)),
			"avgSpendingShare": parseFloat(((avgSpendingLong/avgSpending)*100).toFixed(2)),
			"highProfitRateShare": parseFloat(((highProfitRateLong/highProfitRate)*100).toFixed(2))
		}
		const rapidPerformance = {
			goalsAchievedRapid,
			"avgSpendingRapid": parseFloat((avgSpendingRapid).toFixed(2)),
			highProfitRateRapid,
			"totalEvents": rapid.length,
			"goalsAchievedShare": parseFloat(((goalsAchievedRapid/goalsAchieved)*100).toFixed(2)),
			"avgSpendingShare": parseFloat(((avgSpendingRapid/avgSpending)*100).toFixed(2)),
			"highProfitRateShare": parseFloat(((highProfitRateRapid/highProfitRate)*100).toFixed(2))
		}
		res.json({
			'aggregate': {
				goalsAchieved,
				avgSpending,
				highProfitRate,
				totalEvents
			},
			longPerformance,
			rapidPerformance,
			'currencyCode': shop.currencyCode
		})
	} catch(err: any){
		console.log(err)
		return res.status(403).send("Oops! Couldn't gather analytics for the performances of events.")
	}
})

analytics.get('/lucky-days', checkApiAuth, forMainApi, async (req, res) => {
	try{
		let sun = 0, mon = 0, tue = 0, wed = 0, thu = 0, fri = 0, sat = 0
		let jan = 0, feb = 0, mar = 0, apr = 0, may = 0, jun = 0, jul = 0, aug = 0, sep = 0, oct = 0, nov = 0, dec = 0
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const long = await Long.find({'shop': session.shop})
		const rapid = await RapidChild.find({'shop': session.shop})
		const shop = await Shop.findOne({'shop': session.shop})
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
			//console.log(day)
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

		transactions.forEach((item: any) => {
			let day: number = new Date(item.timestamp).getMonth()
			//console.log(day)
			switch(day){
				case 0:
					jan+=item.spent
					break;
				case 1:
					feb+=item.spent
					break;
				case 2:
					mar+=item.spent
					break;
				case 3:
					apr+=item.spent
					break;
				case 4:
					may+=item.spent
					break;
				case 5:
					jun+=item.spent
					break;
				case 6:
					jul+=item.spent
					break;
				case 7:
					aug+=item.spent
					break;
				case 8:
					sep+=item.spent
					break;
				case 9:
					oct+=item.spent
					break;
				case 10:
					nov+=item.spent
					break;
				case 11:
					dec+=item.spent
					break;
				default:
					return null
					break;
			}
		})

		const days = {
			"Sunday": sun,
			"Monday": mon,
			"Tuesday": tue,
			"Wednesday": wed,
			"Thursday": thu,
			"Friday": fri,
			"Saturday": sat
		}

		const months = {
			jan,
			feb,
			mar,
			apr,
			may,
			jun,
			jul,
			aug,
			sep,
			oct,
			nov,
			dec
		}

		const results = {
			days,
			months,
			'currencyCode': shop.currencyCode
		}

		res.json(results)
	} catch(err: any){
		console.log(err)
		return err
	}
})

analytics.get('/overall-impact', checkApiAuth, forMainApi, async (req, res) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const dateNow = Date.now()
		const shop = await Shop.findOne({'shop': session.shop})
		const long = await Long.find({
			'shop': session.shop,
			'startDate': {'$lt': new Date(dateNow)},
			'endDate': {'$lt': new Date(dateNow)},
			'winnersGifted': true
		})
		const rapid = await RapidChild.find({
			'shop': session.shop,
			'startDate': {'$lt': new Date(dateNow)},
			'endDate': {'$lt': new Date(dateNow)},
			'winnersGifted': true
		})

		let prizes: any[] = []
		long.forEach((item: any) => {
			item.winners.forEach((prize: any) => {
				prizes.push({
					"prizeId": prize.prizeId,
					"voucherPrize": prize.voucherPrize,
					"entrantName": prize.entrantName,
					"entrantEmail": prize.entrantEmail,
					"date": item.endDate,
					"currencyCode": item.currencyCode
				})
			})
		})

		rapid.forEach((item: any) => {
			const prize = item.winner
			prizes.push({
				"prizeId": prize.prizeId,
				"voucherPrize": prize.voucherPrize,
				"entrantName": prize.entrantName,
				"entrantEmail": prize.entrantEmail,
				"date": item.endDate,
				"currencyCode": item.currencyCode
			})
		})

		// Do some wild things with this data
		const winnersAllTime = prizes.length
		let payoutAllTime = 0
		let winnersThisYear = 0
		let payoutThisYear = 0
		//const money: any = await axios.get(`https://openexchangerates.org/api/latest.json?app_id=${process.env.EXCHANGE_ID}`)
		//console.log(money.data.rates)
		prizes.forEach((item: any) => {
			payoutAllTime+=item.voucherPrize
			const thisYear = new Date(Date.now()).getFullYear()
			const thatYear = new Date(item.date).getFullYear()
			if(thisYear === thatYear){
				winnersThisYear+=1
				payoutThisYear+=item.voucherPrize
			}
		})
		const results = {
			winnersAllTime,
			winnersThisYear,
			payoutAllTime,
			payoutThisYear,
			'currencyCode': shop.currencyCode
		}
		res.json(results)
	} catch(err: any){
		console.log(err)
		return res.status(403).json(err)
	}
})

analytics.get('/products', checkApiAuth, forMainApi, async (req, res) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const client = new Shopify.Clients.Graphql(session.shop, session.accessToken)

		let cursor: string | null = ""
		let proceed: boolean = true
		let products: any[] = []
		const firstBatch: any = await client.query({
			data: `
				{
					products(first:60){
						edges{
							node{
								id,
								priceRangeV2{
									maxVariantPrice {
										amount,
										currencyCode
									}
								}
							}
							cursor
						}
						pageInfo {
							hasNextPage
						}
					}
				}
			`
		})
		//console.log(firstBatch.body)
		const prods = firstBatch.body.data.products.edges
		prods.forEach((item: any) => {
			products.push(item.node.priceRangeV2.maxVariantPrice)
		})
		proceed = firstBatch.body.data.products.pageInfo.hasNextPage
		cursor = prods[prods.length - 1].cursor

		while(proceed){
			//console.log("running")
			const storeProducts: any = await client.query({
				data: `
					{
						products(first:60, after:"${cursor}" ){
							edges{
								node{
									id,
									priceRangeV2{
										amount,
										currencyCode
									}
								}
								cursor
							}
							pageInfo {
								hasNextPage
							}
						}
					}
				`
			})
			//console.log(storeProducts.body)
			const prods = storeProducts.body.data.products.edges
			prods.forEach((item: any) => {
				products.push(item.node.priceRangeV2.maxVariantPrice)
			})
			proceed = storeProducts.body.data.products.pageInfo.hasNextPage
			cursor = prods[prods.length - 1].cursor
			//console.log(cursor)
			//console.log(products)
		}
		//console.log(products)
		res.json(products)
	} catch(err: any){
		console.log(err)
		return err
	}
})

analytics.get('/prize-v-interest', checkApiAuth, forMainApi, async (req, res) => {
	try {
		let compiler: any[] = []
		const dateNow = Date.now()
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const shop = await Shop.findOne({'shop': session.shop})
		const rapid = await RapidChild.find({
			'shop': session.shop,
			'startDate': {'$lt': new Date(dateNow)},
			'endDate': {'$lt': new Date(dateNow)}
		})
		const long = await Long.find({
			'shop': session.shop,
			'startDate': {'$lt': new Date(dateNow)},
			'endDate': {'$lt': new Date(dateNow)}
		})
		//console.log(rapid)
		//console.log(long)
		let dataPoints: any[] = []
		let dataSetEntries: any[] = []
		let dataSetRevenue: any[] = []

		rapid.forEach((item: any) => {
			if(item.currencyCode === shop.currencyCode){
				const budget = item.winner.voucherPrize
				const revenue = item.entries.reduce((a: number, b: any) => a + b.spent, 0)
				const entries = item.entries.length
				if(!dataPoints.includes(budget)){
					//console.log(budget+" "+entries+" "+revenue)
					dataPoints.push(budget)
					dataSetEntries.push(entries)
					dataSetRevenue.push(revenue)
				} else {
					//console.log(budget+" "+entries+" "+revenue)
					const index = dataPoints.findIndex((meti: any) => meti === budget)
					dataSetEntries[index]+=entries
					dataSetRevenue[index]+=revenue
				}
			}
		})
		long.forEach((item: any) => {
			if(item.currencyCode === shop.currencyCode){
				const budget = item.winners.reduce((a: number, b: any) => a + b.voucherPrize, 0)
				const revenue = item.entries.reduce((a: number, b: any) => a + b.spent, 0)
				const entries = item.entries.length
				if(!dataPoints.includes(budget)){
					//console.log(budget+" "+entries+" "+revenue)
					dataPoints.push(budget)
					dataSetEntries.push(entries)
					dataSetRevenue.push(revenue)
				} else {
					//console.log(budget+" "+entries+" "+revenue)
					const index = dataPoints.findIndex((meti: any) => meti === budget)
					dataSetEntries[index]+=entries
					dataSetRevenue[index]+=revenue
				}
			}
		})

		
		// compile everything into an grouping array
		dataPoints.forEach((item: any, index: number) => {
			compiler.push({
				'x': item, 
				'y': dataSetEntries[index], 
				'r': dataSetRevenue[index]
			})
		})

		// reset the unsorted arrays
		dataPoints.length = 0
		dataSetEntries.length = 0
		dataSetRevenue.length = 0

		// sort through the grouped compilations and assign to appropriate arrays
		compiler.sort((a, b) => a.x - b.x).forEach((item: any) => {
			dataPoints.push(item.x)
			dataSetEntries.push(item.y)
			dataSetRevenue.push(item.r)
		})
		res.json({
			compiler,
			dataPoints,
			dataSetEntries,
			dataSetRevenue,
			'currencyCode': shop.currencyCode
		})
	} catch(err: any){
		console.log(err)
		res.status(403).send("We think there's a error, couldn't compute analytics.")
	}
})

analytics.get('/top-performing-events', checkApiAuth, forCommonApi, async (req, res) => {
	try{
		let compiled: any[] = []
		const dateNow = Date.now()
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const shop = await Shop.findOne({'shop': session.shop})
		const rapid = await RapidChild.find({
			'shop': session.shop,
			'startDate': {'$lt': new Date(dateNow)},
			'endDate': {'$lt': new Date(dateNow)},
			'entries.spent': {'$gte': 1}
		})
		const long = await Long.find({
			'shop': session.shop,
			'startDate': {'$lt': new Date(dateNow)},
			'endDate': {'$lt': new Date(dateNow)},
			'entries.spent': {'$gte': 1}
		})

		rapid.forEach((item: any) => {
			if(item.currencyCode === shop.currencyCode){
				compiled.push({
					"grossRevenue": item.entries.reduce((a: number, b: any) => a + b.spent, 0),
					"eventType": item.eventType,
					"name": item.name,
					"endDate": item.endDate,
					"currencyCode": item.currencyCode,
					"id": item.id,
					"parentId": item.parentId
				})
			}
		})
		long.forEach((item: any) => {
			if(item.currencyCode === shop.currencyCode){
				compiled.push({
					"grossRevenue": item.entries.reduce((a: number, b: any) => a + b.spent, 0),
					"eventType": item.eventType,
					"name": item.name,
					"endDate": item.endDate,
					"currencyCode": item.currencyCode,
					"id": item.id
				})
			}
		})
		const results = compiled.sort((a, b) => b.grossRevenue - a.grossRevenue).slice(0,5)
		res.json(results)
	} catch(err: any){
		return res.status(403).send("Oops! Couldn't return the top performing events.")
	}
})

analytics.get('/lucrative-templates', checkApiAuth, forMainApi, async (req, res) => {
	try {
		const liquidity: any[] = []
		const dateNow = Date.now()
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const shop = await Shop.findOne({'shop': session.shop})
		const longTemplates = await SavedLong.find({
			'shop': session.shop,
			'eventType': {'$exists': true}
		})
		const rapidTemplates = await SavedRapid.find({
			'shop': session.shop,
			'eventType': {'$exists': true}
		})
		longTemplates.forEach((item: any) => {
			liquidity.push({
				"id": item.id,
				"name": item.name,
				"eventType": item.eventType,
				"revenue": 0,
				"currencyCode": item.currencyCode
			})
		})
		rapidTemplates.forEach((item: any) => {
			liquidity.push({
				"id": item.id,
				"name": item.name,
				"eventType": item.eventType,
				"revenue": 0,
				"currencyCode": item.currencyCode
			})
		})

		const rapid = await RapidChild.find({
			'shop': session.shop,
			'startDate': {'$lt': new Date(dateNow)},
			'endDate': {'$lt': new Date(dateNow)},
			'entries.spent': {'$gte': 1},
			'templateId': {'$exists': true}
		})
		const long = await Long.find({
			'shop': session.shop,
			'startDate': {'$lt': new Date(dateNow)},
			'endDate': {'$lt': new Date(dateNow)},
			'entries.spent': {'$gte': 1},
			'templateId': {'$exists': true}
		})
		if(long.length === 0 && rapid.length === 0){
			return res.json({'status': false})
		}
		rapid.forEach((item: any) => {
			const index = liquidity.findIndex((meti: any) => meti.id === item.templateId)
			console.log(index)
			if(index >= 0){
				liquidity[index].revenue+=item.entries.reduce((a: number, b: any) => a + b.spent, 0)
			}
		})
		long.forEach((item: any) => {
			const index = liquidity.findIndex((meti: any) => meti.id === item.templateId)
			console.log(index)
			if(index >= 0){
				liquidity[index].revenue+=item.entries.reduce((a: number, b: any) => a + b.spent, 0)
			}
		})
		const results = liquidity.sort((a, b) => b.revenue - a.revenue).slice(0,5)
		res.json({
			results,
			'status': true
		})
	} catch (err: any){
		console.log(err)
		return res.status(403).send("Oops! Couldn't gather analytics for lucrative event templates.")
	}
})


// For the progress page

analytics.get('/long-term-goals', checkApiAuth, forMainApi, async (req, res) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const shop = await Shop.findOne({'shop': session.shop})
		//console.log(shop.longTermGoals)
		const results = {
			'status' : shop.longTermGoals.totalRevenue ? true : false,
			'totalRevenueGoal': shop.longTermGoals.totalRevenue ? shop.longTermGoals.totalRevenue : 0,
			'thisYear': new Date(Date.now()).getFullYear(),
			'currencyCode': shop.currencyCode
		}
		console.log(results)
		res.json(results)
	} catch(err: any){
		console.log(err)
		return err
	}
})

analytics.post('/long-term-goals/set', checkApiAuth, forMainApi, async (req, res) => {
	try{
		const data = req.body.setRevenueGoal
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const shop = await Shop.findOne({'shop': session.shop})
		//console.log(shop.longTermGoals)
		if(data <= 0){
			return res.status(403).send("You cannot do that, the goal must be any number above zero.")
		}
		const results = await Shop.updateOne(
			{'shop': session.shop},
			{
				'$set': {
					'longTermGoals.totalRevenue': data
				}
			}
		)
		console.log(results)
		res.json({'status': 'OK'})
	} catch(err: any){
		console.log(err)
		return res.status(403).send("Error, could not save goal, try again.")
	}
})

analytics.post('/long-term-goals/unset', checkApiAuth, forMainApi, async (req, res) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const shop = await Shop.findOne({'shop': session.shop})
		//console.log(shop.longTermGoals)
		
		const results = await Shop.updateOne(
			{'shop': session.shop},
			{
				'$unset': {
					'longTermGoals.totalRevenue': 1
				}
			}
		)
		console.log(results)
		res.json({'status': 'OK'})
	} catch(err: any){
		console.log(err)
		return res.status(403).send("Error, could not save goal, try again.")
	}
})

analytics.get('/forecast', checkApiAuth, forMainApi, async (req, res) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const client = new Shopify.Clients.Graphql(session.shop, session.accessToken)
		// get all products prices
		let cursor: string | null = ""
		let proceed: boolean = true
		let products: any[] = []
		const firstBatch: any = await client.query({
			data: `
				{
					products(first:60){
						edges{
							node{
								id,
								priceRangeV2{
									maxVariantPrice {
										amount,
										currencyCode
									}
								}
							}
							cursor
						}
						pageInfo {
							hasNextPage
						}
					}
				}
			`
		})
		const prods = firstBatch.body.data.products.edges
		prods.forEach((item: any) => {
			products.push(item.node.priceRangeV2.maxVariantPrice)
		})
		proceed = firstBatch.body.data.products.pageInfo.hasNextPage
		cursor = prods[prods.length - 1].cursor

		while(proceed){
			//console.log("running")
			const storeProducts: any = await client.query({
				data: `
					{
						products(first:60, after:"${cursor}" ){
							edges{
								node{
									id,
									priceRangeV2{
										amount,
										currencyCode
									}
								}
								cursor
							}
							pageInfo {
								hasNextPage
							}
						}
					}
				`
			})
			//console.log(storeProducts.body)
			const prods = storeProducts.body.data.products.edges
			prods.forEach((item: any) => {
				products.push(item.node.priceRangeV2.maxVariantPrice)
			})
			proceed = storeProducts.body.data.products.pageInfo.hasNextPage
			cursor = prods[prods.length - 1].cursor
			//console.log(cursor)
			//console.log(products)
		}

		// set up
		const dateNow = Date.now()
		const thisYear = new Date(dateNow).getFullYear()
		const shop = await Shop.findOne({'shop': session.shop})
		const long = await Long.find({
			'shop': session.shop,
			'startDate': {'$gte': new Date(thisYear+"-01-01")},
			'endDate': {'$lt': new Date(dateNow)},
			'entries.spent': {'$gte': 1},
			'currencyCode': shop.currencyCode
		})
		const rapid = await RapidChild.find({
			'shop': session.shop,
			'startDate': {'$gte': new Date(thisYear+"-01-01")},
			'endDate': {'$lt': new Date(dateNow)},
			'entries.spent': {'$gte': 1},
			'currencyCode': shop.currencyCode
		})
		const revenueGoal: number = shop.longTermGoals.totalRevenue ? shop.longTermGoals.totalRevenue : 0

		// forecasts calculations
		
		let totalProductsWorth = 0
		let productCount = 0
		let totalEntries = 0
		let totalSpent = 0
		products.forEach((item: any) => {
			if(item.currencyCode === shop.currencyCode){
				totalProductsWorth+=parseFloat(item.amount)
				productCount+=1
			}
		})
		long.forEach((item: any) => {
			totalEntries+=item.entries.length
			totalSpent+=item.entries.reduce((a: number, b: any) => a+b.spent, 0)
		})
		rapid.forEach((item: any) => {
			totalEntries+=item.entries.length
			totalSpent+=item.entries.reduce((a: number, b: any) => a+b.spent, 0)
		})
		console.log(totalEntries/(long.length+rapid.length))
		const forecast = (totalPrice: number, totalProducts: number, totalRevenue: number, totalEvents: number, totalEntries: number, goal: number): object => {
			const avgMaxProductPrice = parseFloat((totalPrice/totalProducts).toFixed(2))
			const avgGrossRevenue = parseFloat((totalRevenue/totalEvents).toFixed(2))
			const avgSpendingPerEvent = parseFloat((avgGrossRevenue/(totalEntries/totalEvents)).toFixed(2))
			const eventsRequired = Math.round((goal/avgGrossRevenue))
			const avgProductsSoldRequired = Math.round(avgGrossRevenue/avgMaxProductPrice)
			
			return {
				avgMaxProductPrice,
				avgGrossRevenue,
				avgSpendingPerEvent,			
				eventsRequired,
				avgProductsSoldRequired
			}
		}

		// realistic forecast
		const realistic = forecast(totalProductsWorth, productCount, totalSpent, (long.length+rapid.length), totalEntries, revenueGoal)

		// 10x optimistic forcast
		const tenfold = forecast(totalProductsWorth, productCount, (totalSpent*10), (long.length+rapid.length), totalEntries, revenueGoal)

		// 50X optimistic forcast
		const fiftyfold = forecast(totalProductsWorth, productCount, (totalSpent*50), (long.length+rapid.length), totalEntries, revenueGoal)
		res.json({
			realistic,
			tenfold,
			fiftyfold,
			'currencyCode': shop.currencyCode
		})
	} catch(err: any){
		console.log(err)
		return res.status(403).send("There must be an error in the server.")
	}
})

export default analytics