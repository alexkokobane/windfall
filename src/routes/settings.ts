import express from 'express'
import checkAuth from '../utils/middlewares/check-auth'

const settings = express.Router()

settings.get('/', checkAuth,(req, res) => {

  res.send('example /settings route')
})

export default settings