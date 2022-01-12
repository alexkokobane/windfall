import express from 'express'
import Shopify from '@shopify/shopify-api'
import checkAuth from '../utils/middlewares/check-auth'


const home = express.Router()

home.get('/', checkAuth, async (req, res) => {
	
	res.render('pages/home')
})


export default home