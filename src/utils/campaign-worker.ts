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
				{
					'$project': {
						'campaigns': {
							'$filter': {
								'input': '$campaigns',
								'as': 'campaign',
								'cond': {
									'$and': [
										{'$lte': ['$$campaign.startDate', new Date(dateNow)]},
										{'$gte': ['$$campaign.endDate', new Date(dateNow)]}
									]
								}
							}
						}
					}
				},
				{'$addFields': {'campaigns.state': 'Active'}},
				{'$unwind': '$campaigns'},
				{'$project': {'_id': 0, 'campaigns': 1}}
			])
			console.log(active)
		} catch(err: any){
			console.log(err)
		}
	}, 1000*10)
}

export const setExpiredCampaign = () => {
	setInterval(async () => {
		try {
			const dateNow = new Date().toISOString()
			const active = await Shop.aggregate([
				{
					'$project': {
						'campaigns': {
							'$filter': {
								'input': '$campaigns',
								'as': 'campaign',
								'cond': {
									'$and': [
										{'$lt': ['$$campaign.startDate', new Date(dateNow)]},
										{'$lt': ['$$campaign.endDate', new Date(dateNow)]}
									]
								}
							}
						}
					}
				},
				{'$addFields': {'campaigns.state': 'Expired'}},
				{'$unwind': '$campaigns'},
				{'$project': {'_id': 0, 'campaigns': 1}}
			])
			console.log(active)
		} catch(err: any){
			console.log(err)
		}
	}, 1000*60)
}