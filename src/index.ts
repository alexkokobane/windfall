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

const app = express()

app.post('/webhooks', async (req, res) => {
  try{
    await Shopify.Webhooks.Registry.process(req, res)    
  } catch(err: any){
    console.log(err)
  }
})

app.use(morgan('tiny'))
app.use(express.static(path.resolve(__dirname, 'public')))
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

// Controller routes
app.use('/auth', auth)
app.use('/', home)
app.use('/settings', settings)
app.use('/billing', billing)
app.use('/campaign', campaign)
app.use('/participants', participants)
// App API routes
app.use('/login', login)
app.use('/customers', customers)
app.use('/shop', shopInfo)
app.use('/data', data)

//Catch All
app.use('*', checkAuth, async (req: Request, res: Response, next: NextFunction) => {
  res.status(404).render('pages/404')
})
// Run the app
app.listen(4000, () => {
  console.log('your app is now listening on port 4000 :)');
})