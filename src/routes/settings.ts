import express from 'express'
import checkAuth from '../utils/middlewares/check-auth'

const settings = express.Router()

settings.get('/', checkAuth, async (req, res) => {

  res.render('pages/settings')
})

export default settings