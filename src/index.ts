import express, { Request, Response, NextFunction } from 'express'
import path from 'path'
import morgan from 'morgan'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import expressLayouts from 'express-ejs-layouts'
require('dotenv').config()

const { DB_URL, API_SECRET_KEY } = process.env

import checkAuth from './utils/middlewares/check-auth'

import auth from './routes/auth'
import home from './routes/home'
import settings from './routes/settings'
import pricing from './routes/pricing'
import campaign from './routes/campaign'

import login from './api/login'
import customers from './api/customers'
import shopInfo from './api/shop-info'

const app = express()


app.use(morgan('tiny'))
app.use(express.static(path.resolve(__dirname, 'public')))
app.use(cookieParser(API_SECRET_KEY))
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
app.use('/pricing', pricing)
app.use('/campaign', campaign)
// App API routes
app.use('/login', login)
app.use('/customers', customers)
app.use('/shop', shopInfo)

//Catch All
app.use('*', async (req: Request, res: Response, next: NextFunction) => {
  res.status(404).send("Not found my dear")
})
// Run the app
app.listen(4000, () => {
  console.log('your app is now listening on port 4000 :)');
})