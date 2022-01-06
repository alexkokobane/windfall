import mongoose from 'mongoose'
//Example shop schema
const ShopSchema = new mongoose.Schema({
	shop: {
		type: String,
		required: true,
		unique: true
	},
	pricePlan: String,
	scope: [String],
	email: String,
	emailTemplate: String,
	createdAt: {
		type: Date,
		default: Date.now()
	}
})

const Shop = mongoose.model('Shop', ShopSchema)

export default Shop

