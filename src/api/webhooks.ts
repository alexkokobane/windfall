import express, { Request, Response, NextFunction } from 'express'
import Shopify from '@shopify/shopify-api'
import checkAuth from '../utils/middlewares/check-auth'
import { Shop, Long, Grand, SavedLong, Customers, Quota, Rapid, RapidChild, Purchase } from '../models/shop-model'
import ActiveShop from '../models/session-model'
import { generateDiscountCode, newSubs } from '../utils/functions' 

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
			const marketing = obj.customer.accepts_marketing
			const tip = parseFloat(obj.total_tip_received)
			const country = obj.billing_address.country
			const city = obj.billing_address.city
			const moneyCode = obj.currency
			let subtotal = Math.round(parseFloat(obj.subtotal_price))
			let money = parseFloat(obj.subtotal_price)

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

				// keep record of transaction
				new Purchase({
					'shop': shop,
					'country': country,
					'city': city,
					'spent': money,
					'currencyCode': moneyCode
				}).save()
				//console.log(checkActive)
				//console.log(checkRapid)

				// check and process the event type available, if any
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

						// update usage quota 
						const quota = await Quota.findOne({'shop': shop})
						const month = new Date(Date.now()).toISOString().substring(0, 7)
						const maxQuota = quota.entries[quota.entries.length - 1].maxValue
						const valueQuota = quota.entries[quota.entries.length - 1].value
						if(valueQuota > maxQuota){
							return null
						} else if(valueQuota+1 > maxQuota){
							return null
						} else {
							const upQ = await Quota.updateOne(
								{
									'shop': shop,
									'entries.month': month
								},
								{
									'$inc': {
										'entries.$.value': 1
									}
								}
							)

							if(upQ.modifiedCount !== 1){
								const newMonth = newSubs(shopExist.plan)
								const upQplus = await Quota.updateOne(
									{
										'shop': shop
									},
									{
										'$push': {
											'entries': {
												'month': newMonth[newMonth.length - 1].month,
												'value': 1,
												'maxValue': newMonth[newMonth.length - 1].maxValue,
												'plan': newMonth[newMonth.length - 1].plan
											}
										}
									}
								)
							}
						}


						// update event information
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
											'spent': money,
											'tip': tip,
											'marketing': marketing,
											'city': city,
											'country': country,
											'metadata': {
												'spent': money,
												'timestamp': Date.now()
											}
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
										'entries.$.spent': money,
										'entries.$.tip': tip
									},
									'$push': {
										'entries.$.metadata': {
											'spent': money,
											'timestamp': Date.now()
										}
									}
								}
							)
							console.log("This is on long "+peat)
						}
					} else if(checkActive.qualifying === "select"){

						// update usage quota
						const quota = await Quota.findOne({'shop': shop})
						const month = new Date(Date.now()).toISOString().substring(0, 7)
						const maxQuota = quota.entries[quota.entries.length - 1].maxValue
						const valueQuota = quota.entries[quota.entries.length - 1].value
						if(valueQuota > maxQuota){
							return null
						} else if(valueQuota+1 > maxQuota){
							return null
						} else {
							const upQ = await Quota.updateOne(
								{
									'shop': shop,
									'entries.month': month
								},
								{
									'$inc': {
										'entries.$.value': 1
									}
								}
							)

							if(upQ.modifiedCount !== 1){
								const newMonth = newSubs(shopExist.plan)
								const upQplus = await Quota.updateOne(
									{
										'shop': shop
									},
									{
										'$push': {
											'entries': {
												'month': newMonth[newMonth.length - 1].month,
												'value': 1,
												'maxValue': newMonth[newMonth.length - 1].maxValue,
												'plan': newMonth[newMonth.length - 1].plan
											}
										}
									}
								)
							}
						}

						// update event information
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
											'spent': money,
											'tip': tip,
											'marketing': marketing,
											'city': city,
											'country': country,
											'metadata': {
												'spent': money,
												'timestamp': Date.now()
											}
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
										'entries.$.spent': money,
										'entries.$.tip': tip
									},
									'$push': {
										'entries.$.metadata': {
											'spent': money,
											'timestamp': Date.now()
										}
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

						// update usage quota
						const quota = await Quota.findOne({'shop': shop})
						const month = new Date(Date.now()).toISOString().substring(0, 7)
						const maxQuota = quota.entries[quota.entries.length - 1].maxValue
						const valueQuota = quota.entries[quota.entries.length - 1].value
						if(valueQuota > maxQuota){
							return null
						} else if(valueQuota+1 > maxQuota){
							return null
						} else {
							const upQ = await Quota.updateOne(
								{
									'shop': shop,
									'entries.month': month
								},
								{
									'$inc': {
										'entries.$.value': 1
									}
								}
							)

							if(upQ.modifiedCount !== 1){
								const newMonth = newSubs(checkActive.plan)
								const upQplus = await Quota.updateOne(
									{
										'shop': shop
									},
									{
										'$push': {
											'entries': {
												'month': newMonth[newMonth.length - 1].month,
												'value': 1,
												'maxValue': newMonth[newMonth.length - 1].maxValue,
												'plan': newMonth[newMonth.length - 1].plan
											}
										}
									}
								)
							}
						}

						// update event information
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
											'spent': money,
											'tip': tip,
											'marketing': marketing,
											'city': city,
											'country': country,
											'metadata': {
												'spent': money,
												'timestamp': Date.now()
											}
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
										'entries.$.spent': money,
										'entries.$.tip': tip
									},
									'$push': {
										'entries.$.metadata': {
											'spent': money,
											'timestamp': Date.now()
										}
									}
								}
							)
							console.log("This is on rapid "+peat)
						}
					} else if(checkRapid.qualifying === "select"){

						// update usage quota
						const quota = await Quota.findOne({'shop': shop})
						const month = new Date(Date.now()).toISOString().substring(0, 7)
						const maxQuota = quota.entries[quota.entries.length - 1].maxValue
						const valueQuota = quota.entries[quota.entries.length - 1].value
						if(valueQuota > maxQuota){
							return null
						} else if(valueQuota+1 > maxQuota){
							return null
						} else {
							const upQ = await Quota.updateOne(
								{
									'shop': shop,
									'entries.month': month
								},
								{
									'$inc': {
										'entries.$.value': 1
									}
								}
							)

							if(upQ.modifiedCount !== 1){
								const newMonth = newSubs(checkActive.plan)
								const upQplus = await Quota.updateOne(
									{
										'shop': shop
									},
									{
										'$push': {
											'entries': {
												'month': newMonth[newMonth.length - 1].month,
												'value': 1,
												'maxValue': newMonth[newMonth.length - 1].maxValue,
												'plan': newMonth[newMonth.length - 1].plan
											}
										}
									}
								)
							}
						}


						// update event information
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
											'spent': money,
											'tip': tip,
											'marketing': marketing,
											'city': city,
											'country': country,
											'metadata': {
												'spent': money,
												'timestamp': Date.now()
											}
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
										'entries.$.spent': money,
										'entries.$.tip': tip
									},
									'$push': {
										'entries.$.metadata': {
											'spent': money,
											'timestamp': Date.now()
										}
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

export const handleShopUpdate = async (topic: string, shop: string, webhookRequestBody: any): Promise<any> => {
	try {
		const obj = JSON.parse(webhookRequestBody)
		console.log(obj)
	} catch(err: any){
		console.log(err)
		return err
	}
}

// Functional
webhooks.post('/orders-paid', async (req, res) => {
	try{
		await Shopify.Webhooks.Registry.process(req, res)		
	} catch(err: any){
		console.log(err)
	}
})

webhooks.post('/shop-update', async (req, res) => {
	try{
		await Shopify.Webhooks.Registry.process(req, res)		
	} catch(err: any){
		console.log(err)
	}
})


export default webhooks