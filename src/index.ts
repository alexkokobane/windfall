import express, { Request, Response, NextFunction } from 'express'
import path from 'path'
import morgan from 'morgan'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import expressLayouts from 'express-ejs-layouts'
import Shopify from '@shopify/shopify-api'
require('dotenv').config()

const { DB_URL, API_SECRET_KEY } = process.env

import checkAuth from './utils/middlewares/check-auth'
import { setActiveCampaign } from './utils/campaign-worker'
import { divide, renderFor } from './utils/render-divider'

import auth from './routes/auth'
import home from './routes/home'
import settings from './routes/settings'
import billing from './routes/billing'
import campaign from './routes/campaign'
import participants from './routes/participants'

import login from './api/login'
import customers from './api/customers'
import shopInfo from './api/shop-info'
import data from './api/data'
import webhooks from './api/webhooks'
import analytics from './api/analytics'
import gdpr from './api/gdpr'

const app = express()

app.use(morgan('tiny'))

// Workers
//setActiveCampaign()

// Special routes
app.use('/auth', auth)
app.use('/webhooks', webhooks)

app.use(express.static(path.resolve(__dirname, 'public')))
app.use('/files', express.static(path.resolve(__dirname, 'files')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(expressLayouts)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
app.set('layout', 'layouts/main')

let options = {
	useNewUrlParser: true,
	useUnifiedTopology: true
} as mongoose.ConnectOptions
mongoose.connect(DB_URL, options )
let db = mongoose.connection
db.on('error', console.error.bind(console, "MongoDB connection errors"))

app.use((req: Request, res: Response, next: NextFunction) => {
	if (req.secure) {
		res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
	}
	next()
})

app.use((req: Request, res: Response, next: NextFunction) =>{
	res.setHeader(
		"Content-Security-Policy", 
		"default-src 'self' makamuta.com *.makamuta.com *.ngrok.io; style-src 'self' 'unsafe-inline' https://client.crisp.chat; script-src 'self' https://cdn.jsdelivr.net https://client.crisp.chat; img-src 'self' data: https://client.crisp.chat https://image.crisp.chat https://storage.crisp.chat https://cdn.shopify.com; connect-src 'self' wss://client.relay.crisp.chat https://storage.crisp.chat https://client.crisp.chat; font-src 'self' https://client.crisp.chat; media-src https://client.crisp.chat; frame-src 'self' https://game.crisp.chat;"
		)
	next()
})

// Controller routes
app.use('/', home)
app.use('/settings', settings)
app.use('/billing', billing)
app.use('/campaign', campaign)
app.use('/participants', participants)
// App API routes
app.use('/gdpr', gdpr)
app.use('/login', login)
app.use('/customers', customers)
app.use('/shop', shopInfo)
app.use('/data', data)
app.use('/analytics', analytics)

app.get('/_ah/start', (req, res, next) => {
	res.status(200).send("Working")
})
//Catch All
app.use(/^(?!.*_ah).*$/, checkAuth, async (req: Request, res: Response, next: NextFunction) => {
	
	const render: renderFor = [
			{
				"plan": "Ultimate",
				"page": "pages/404",
				"layer": "layouts/main-ultimate"
			},
			{
				"plan": "Standard",
				"page": "pages/404",
				"layer": "layouts/main-standard"
			},
			{
				"plan": "Starter",
				"page": "pages/404",
				"layer": "layouts/main-starter"
			}
		]
		divide(req, res, render, true)
})
// Run the app

const port = process.env.PORT || 4000

app.listen(port, () => {
	console.log('your app is now listening on port '+port+' :)... https://'+process.env.HOST);
})