import express from 'express'
import Shopify from '@shopify/shopify-api'
import checkAuth from '../utils/middlewares/check-auth'
import detectScope from '../utils/middlewares/detect-scope'
import { forCommon, forStarter, forStandard, forUltimate } from '../utils/middlewares/price-plan'

const home = express.Router()

home.get('/', checkAuth, async (req, res) => {
	
	res.render('pages/home')
})

export default home