import express, { Request, Response, NextFunction } from 'express'
import Shopify from '@shopify/shopify-api'
import checkAuth from '../utils/middlewares/check-auth'
import { Shop, Long, Grand, SavedLong, Customers, Quota, Rapid, RapidChild } from '../models/shop-model'
import ActiveShop from '../models/session-model'

const webhooks = express.Router()

export const handleAppUninstall = async (topic: string, shop: string, webhookRequestBody: string) => {
	try{
		await Shop.deleteOne({'shop': shop})
		await Long.deleteMany({'shop': shop})
		await SavedLong.deleteMany({'shop': shop})
		await Grand.deleteMany({'shop': shop})
		await Customers.deleteMany({'shop': shop})
		const session = await ActiveShop.find({'shop': shop})
		if(session.length !== 0){
			await ActiveShop.deleteMany({'shop': shop})
		}
		console.log(`${shop} has been obliterated.`)
		console.log(webhookRequestBody)
	} catch(err: any){
		console.log(err)
	}
}

export const handleOrdersPaid = async (topic: string, shop: string, webhookRequestBody: any) => {
	try{
		console.log(topic+" was fired.")
		console.log(`${shop} has an order that has been paid.`)
		//console.log(webhookRequestBody)
		const obj = JSON.parse(webhookRequestBody)
		console.log(obj.id)
		const duplicate = await Shop.findOne({
			'shop': shop,
			'lastOrderPaidId': obj.id
		})
		if(duplicate === null){			
			const firstName = obj.customer.first_name
			const lastName = obj.customer.last_name
			const email = obj.customer.email
			const subtotal = Math.round(obj.subtotal_price)
			const money = obj.subtotal_price
			const shopExist = await Shop.findOne({
				'shop': shop
			})
			if(shopExist !== null) {
				const addId = await Shop.updateOne(
					{'shop': shop},
					{
						'$set': {
							'lastOrderPaidId': obj.id
						}
					}
				)
				const dateNow = new Date().toISOString()
				const checkActive = await Long.findOne({
					'shop': shop,
					'startDate': {'$lte': new Date(dateNow)},
					'endDate': {'$gte': new Date(dateNow)}
				})

				const checkRapid = await RapidChild.findOne({
					'shop': shop,
					'startDate': {'$lte': new Date(dateNow)},
					'endDate': {'$gte': new Date(dateNow)}
				})
				console.log(checkActive)
				console.log(checkRapid)
				if(checkActive !== null){
					
					const participant = await Long.findOne(
						{
							'shop': shop, 
							'startDate': {'$lte': new Date(dateNow)},
							'endDate': {'$gte': new Date(dateNow)},
							'entries.email': email
						},
						{
							'entries': {
								'$elemMatch': {'email': email}
							}
						}
					)
					console.log(participant)
					if(participant === null) {
						let con: any = await Long.updateOne(
							{
								'shop': shop, 
								'startDate': {'$lte': new Date(dateNow)},
								'endDate': {'$gte': new Date(dateNow)}
							},
							{
								'$push': { 
									'entries' : {
										'firstName': firstName,
										'lastName': lastName,
										'email': email,
										'points': subtotal,
										'spent': money
									}
								}
							}
						)
						console.log("This is on long "+con)
					} else {
						let peat = await Long.updateOne(
							{
								'shop': shop, 
								'startDate': {'$lte': new Date(dateNow)},
								'endDate': {'$gte': new Date(dateNow)},
								'entries.email': email
							},
							{
								'$inc': {
									'entries.$.points': subtotal,
									'entries.$.spent': money
								}
							}
						)
						console.log("This is on long "+peat)
					}
					const long = await Long.findOne({
						'shop': shop,
						'id': checkActive.id
					})
					const moneyMade: number = long.entries.length > 0 ? long.entries.reduce((sum: number, num: any) => sum+num.spent, 0) : 0
					const avgSpent: number = moneyMade > 0 ? moneyMade/long.entries.length : 0
					const projectedAvgSpent: number = long.goals.totalEntries > 0 ? long.goals.totalRevenue/long.goals.totalEntries : 0 
					const avgSpentProgress: number = projectedAvgSpent > 0 ? (avgSpent/projectedAvgSpent)*100 : 0
					let now: number = Date.now()
					if(checkActive.timer && now-checkActive.timer >= 1000*60*60){
						const hourly = await Long.updateOne(
							{
								'shop': shop,
								'id': checkActive.id
							},
							{
								'$set': {
									'timer': new Date(now)
								},
								'$push': {
									'analytics.avgSpentCounter': {
										'time': new Date(now),
										'value': avgSpentProgress
									}
								}
							}
						)
					} else if(!checkActive.timer){
						const hourly = await Long.updateOne(
							{
								'shop': shop,
								'id': checkActive.id
							},
							{
								'$set': {
									'timer': new Date(now)
								},
								'$push': {
									'analytics.avgSpentCounter': {
										'time': new Date(now),
										'value': avgSpentProgress
									}
								}
							}
						)
					}
				} else if(checkRapid !== null){
					const participant = await RapidChild.findOne(
						{
							'shop': shop, 
							'startDate': {'$lte': new Date(dateNow)},
							'endDate': {'$gte': new Date(dateNow)},
							'entries.email': email
						},
						{
							'entries': {
								'$elemMatch': {'email': email}
							}
						}
					)
					console.log(participant)
					if(participant === null) {
						let con: any = await RapidChild.updateOne(
							{
								'shop': shop, 
								'startDate': {'$lte': new Date(dateNow)},
								'endDate': {'$gte': new Date(dateNow)}
							},
							{
								'$push': { 
									'entries' : {
										'firstName': firstName,
										'lastName': lastName,
										'email': email,
										'points': subtotal,
										'spent': money
									}
								}
							}
						)
						console.log("This is on rapid "+con)
					} else {
						let peat = await RapidChild.updateOne(
							{
								'shop': shop, 
								'startDate': {'$lte': new Date(dateNow)},
								'endDate': {'$gte': new Date(dateNow)},
								'entries.email': email
							},
							{
								'$inc': {
									'entries.$.points': subtotal,
									'entries.$.spent': money
								}
							}
						)
						console.log("This is on rapid "+peat)
					}
				}
			}
		}
	} catch(err: any){
		console.log(err)
	}
}

webhooks.post('/', async (req, res) => {
	try{
		await Shopify.Webhooks.Registry.process(req, res)		
	} catch(err: any){
		console.log(err)
	}
})

export default webhooks