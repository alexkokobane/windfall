import express from 'express'
import Shopify from '@shopify/shopify-api'
import checkAuth from '../utils/middlewares/check-auth'
import { deleteIncompleteLogin } from '../utils/middlewares/experimental'


const campaign = express.Router()

campaign.get('/new', checkAuth, async (req, res) => {
	
	res.render('pages/campaign-create')
})

campaign.post('/new', checkAuth, async (req, res) => {
	res.send("Ressource created")
})

campaign.get('/:id', checkAuth, async (req, res) => {
	res.send("This is where a giveaway will display")
})

campaign.put('/:id', checkAuth, async (req, res) => {
	res.send("The give away has been edited")
})

campaign.delete('/:id', checkAuth, async (req, res) => {
	res.send("Ressource has been deleted")
})


export default campaign