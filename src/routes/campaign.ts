import express from 'express'
import Shopify from '@shopify/shopify-api'
import checkAuth from '../utils/middlewares/check-auth'
import { deleteIncompleteLogin } from '../utils/middlewares/experimental'


const campaign = express.Router()

campaign.get('/new', checkAuth, async (req, res) => {
	
	res.render('pages/campaign-create')
})


export default campaign