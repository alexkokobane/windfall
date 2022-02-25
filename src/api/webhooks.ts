import express, { Request, Response, NextFunction } from 'express'
import Shopify from '@shopify/shopify-api'
import checkAuth from '../utils/middlewares/check-auth'
import { Shop, Long, Grand, SavedLong, Customers, Quota } from '../models/shop-model'
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

		const obj = JSON.parse(webhookRequestBody)
		
		const firstName = obj.customer.first_name
		const lastName = obj.customer.last_name
		const email = obj.customer.email
		const subtotal = Math.round(obj.subtotal_price)
		const shopExist = await Shop.findOne({
			'shop': shop
		})
		if(shopExist !== null) {
			const dateNow = new Date().toISOString()
			const checkActive = await Long.find({
				'shop': shop,
				'startDate': {'$lte': new Date(dateNow)},
				'endDate': {'$gte': new Date(dateNow)}
			})
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
									'points': subtotal
								}
							}
						}
					)
					console.log(con)
				} else {
					let peat = await Long.updateOne(
						{
							'shop': shop, 
							'startDate': {'$lte': new Date(dateNow)},
							'endDate': {'$gte': new Date(dateNow)},
							'entries.email': email
						},
						{
							'$inc': {'entries.$.points': subtotal}
						}
					)
					console.log(peat)
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