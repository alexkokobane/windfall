import express from 'express'
import Shopify from '@shopify/shopify-api'
import checkAuth from '../utils/middlewares/check-auth'
import { forCommon, forStarter, forStandard, forUltimate } from '../utils/middlewares/price-plan'

const participants = express.Router()

participants.get('/', checkAuth, async (req, res) => {
	res.render('pages/participants')
})

export default participants