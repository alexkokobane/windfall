import mongoose from 'mongoose'
//Example shop schema
const ShopSchema = new mongoose.Schema({
	shop: {
		type: String,
		required: true,
		unique: true
	},
	pricePlan: String,
	warrantyAll: {
		warranty: String,
		evaldates: [String]
	},
	warrantyIndividual: [{
		productId: String,
		warranty: String,
		evaldates: [String]
	}],
	scope: [String],
	email: String,
	customers: [{
		firstName: String,
		displayName: String,
		email: String,
		allowsMarketing: Boolean,
		ratedProducts: [{
			productId: String,
			productName: String,
			avgRating: Number,
			orderDate: {
				type: Date,
				default: Date.now()
			},
			reviewDates: [String],
			comments: [{
				rating: Number,
				body: String,
				views: Number,
				replies: [String],
				createdAt: {
					type: Date,
					default: Date.now()
				}
			}]
		}]
	}],
	discountedProduct: {
		productId: String,
		defaultPrice: String,
		discountPercent: Number,
		discountedPrice: String
	},
	analytics: [{
		productId: String
	}],
	emailTemplate: String,
	createdAt: {
		type: Date,
		default: Date.now()
	}
})

const Shop = mongoose.model('Shop', ShopSchema)

export default Shop

