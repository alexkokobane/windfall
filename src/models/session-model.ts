import mongoose from 'mongoose'
//explample session schema
const Party = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  session: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
})

Party.index({"createdAt": 1}, { expireAfterSeconds: 86400})
const ActiveShop = mongoose.model('Session', Party)

export default ActiveShop