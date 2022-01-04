import express from 'express'
import Shopify from '@shopify/shopify-api'
import checkAuth from '../utils/middlewares/check-auth'
import { deleteIncompleteLogin } from '../utils/middlewares/experimental'


const home = express.Router()

home.get('/', deleteIncompleteLogin, checkAuth, async (req, res) => {
	
	res.send("Homepage")
})

export default home