import express, { Request, Response, NextFunction } from 'express'
import Shopify from '@shopify/shopify-api'
import checkAuth, { checkApiAuth } from '../utils/middlewares/check-auth'
import { Shop } from '../models/shop-model'

const customers = express.Router()

customers.get('/', checkAuth, async(req, res) => {
	try {
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		console.log(session)
		const client = new Shopify.Clients.Graphql(session.shop, session.accessToken)
		const storeCustomers = await client.query({
			data: `
				{
					customers(first:100 ){
						edges{
							node{
								id,
								displayName,
								acceptsMarketing
							}
						}
					}
				}
			`
		})

		return res.json(storeCustomers)
	} catch(err: any) {
		console.log(err)
	}
})

customers.post('/', checkApiAuth, async(req, res) => {
	try{
		const session = await Shopify.Utils.loadCurrentSession(req, res, true)
		const client = new Shopify.Clients.Graphql(session.shop, session.accessToken)
		const data = req.body.data
		console.log(data)
		const returnData = await client.query({
			data: `mutation {
				customerCreate(input: {
			    firstName: "${data.firstName}",
			    lastName: "${data.lastName}"
			  }){
			    customer{
			    	firstName
			      	lastName
			    }
			  }
			}`
		})
		console.log(returnData)
		res.json(returnData)
	} catch(err: any){
		console.log(err)
	}
})

export default customers