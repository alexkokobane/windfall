import express from 'express'
import checkAuth from '../utils/middlewares/check-auth'
import { forCommon, forStarter, forStandard, forUltimate } from '../utils/middlewares/price-plan'

const settings = express.Router()

settings.get('/', checkAuth, forCommon, async (req, res) => {

  res.render('pages/settings')
})

export default settings