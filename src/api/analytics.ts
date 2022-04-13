import express from 'express'
import Shopify from '@shopify/shopify-api'
import axios from 'axios'
import { Shop, Long, Grand, SavedLong, Customers, Quota, Rapid, RapidChild } from '../models/shop-model'
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

		transactions.forEach((item: any) => {
			let day: number = new Date(item.timestamp).getMonth()
			console.log(day)
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
		const money: any = await axios.get(`https://openexchangerates.org/api/latest.json?app_id=${process.env.EXCHANGE_ID}`)
		console.log(money.data.rates)
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
					products(first:3){
						edges{
							node{
								id,
								title,
								featuredImage{
									altText,
									url
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
			products.push(item.node)
		})
		proceed = firstBatch.body.data.products.pageInfo.hasNextPage
		cursor = prods[prods.length - 1].cursor

		while(proceed){
			console.log("running")
			const storeProducts: any = await client.query({
				data: `
					{
						products(first:3, after:"${cursor}" ){
							edges{
								node{
									id,
									title,
									featuredImage{
										altText,
										url
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
			console.log(storeProducts.body)
			const prods = storeProducts.body.data.products.edges
			prods.forEach((item: any) => {
				products.push(item.node)
			})
			proceed = storeProducts.body.data.products.pageInfo.hasNextPage
			cursor = prods[prods.length - 1].cursor
			console.log(cursor)
			console.log(products)
		}
		//console.log(products)
		res.json(products)
	} catch(err: any){
		console.log(err)
		return err
	}
})

export default analytics