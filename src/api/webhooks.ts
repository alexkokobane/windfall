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

export const handleOrdersPaid = async (topic: string, shop: string, webhookRequestBody: any): Promise<any> => {
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
			let subtotal = Math.round(obj.subtotal_price)
			let money = obj.subtotal_price
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
					// update entries
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
					// check for qualifying products and respond accordingly
					if(checkActive.qualifying === "all"){
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
					} else if(checkActive.qualifying === "select"){
						let products: any[] = []
						obj.line_items.forEach((item: any) => {
							checkActive.qualifyingId.includes(item.product_id) ? products.push(parseFloat(item.price)*item.quantity) : 0
						})
						console.log(products)
						subtotal = Math.round(products.reduce((sum: number, num: any) => sum+num, 0))
						money = products.reduce((sum: number, num: any) => sum+num, 0)
						console.log(subtotal)
						console.log(money)
						if(subtotal < 1){
							return null
						}

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
					// The setting up of chosen priducts rapid events
					if(checkRapid.qualifying === "all"){
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
					} else if(checkRapid.qualifying === "select"){

						let products: any[] = []
						obj.line_items.forEach((item: any) => {
							checkRapid.qualifyingId.includes(item.product_id) ? products.push(parseFloat(item.price)*item.quantity) : 0
						})
						console.log(products)
						subtotal = Math.round(products.reduce((sum: number, num: any) => sum+num, 0))
						money = products.reduce((sum: number, num: any) => sum+num, 0)
						console.log(subtotal)
						console.log(money)
						if(subtotal < 1){
							return null
						}

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