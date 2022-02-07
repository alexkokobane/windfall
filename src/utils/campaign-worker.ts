import express, { Request, Response, NextFunction } from 'express'
import Shopify from '@shopify/shopify-api'
import axios from 'axios'
import Shop from '../models/shop-model'
import getShop from './get-shop'

export const setActiveCampaign = () => {
	setInterval(async () => {
		try {
			const dateNow = new Date().toISOString()
			const active = await Shop.aggregate([
				{'$match': {'campaigns.startDate': {'$lt': new Date(dateNow)}}},
				{'$match': {'campaigns.endDate': {'$gt': new Date(dateNow)}}},
				{'$addFields': {'campaigns.state': 'Active'}},
				{'$unwind': '$campaigns'},
				{'$project': {'_id': 0, 'campaigns': 1}}
			])
			console.log(active)
		} catch(err: any){
			console.log(err)
		}
	}, 1000*60)
}

export const setExpiredCampaign = () => {
	setInterval(async () => {
		try {
			const dateNow = new Date().toISOString()
			const active = await Shop.aggregate([
				{'$match': {'campaigns.startDate': {'$lt': new Date(dateNow)}}},
				{'$match': {'campaigns.endDate': {'$lt': new Date(dateNow)}}},
				{'$addFields': {'campaigns.state': 'Active'}},
				{'$unwind': '$campaigns'},
				{'$project': {'_id': 0, 'campaigns': 1}}
			])
			console.log(active)
		} catch(err: any){
			console.log(err)
		}
	}, 1000*60*2)
}