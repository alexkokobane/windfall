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

analytics.get('/long/:id/revenue', checkApiAuth, async (req, res) => {
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

		const stats = {
			"averageSpent": "",
			"revenueGoal": "",
			"revenue": "",
			"toRevenueGoal": "",
			"projectedAverageSpent": ""
		}
		res.json(stats)
	} catch(err: any){
		console.log(err)
		return err
	}
})

export default analytics