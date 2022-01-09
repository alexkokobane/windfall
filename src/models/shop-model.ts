import mongoose from 'mongoose'
import { ShopTypes } from './__types'

const ShopSchema = new mongoose.Schema({
	shop: {
		type: String,
		required: true,
		unique: true
	},
	pricePlan: String,
	scope: [String],
	email: String,
	entryNotificationTemplates: [{
		id: Number,
		name: String,
		receiptAddress: String,
		body: String,
		createdAt: {
			type: Date,
			default: Date.now()
		}
	}],
	winnerNotificationTemplates: [{
		id: Number,
		name: String,
		receiptAddress: String,
		body: String,
		createdAt: {
			type: Date,
			default: Date.now()
		}
	}],
	campaigns: [{
		id: Number,
		name: String,
		startDate: Date,
		endDate: Date,
		toSuper: Boolean,
		entries: [{
			id: Number,
			reference: Number,
			name: String,
			email: String,
			points: Number
		}],
		winners: [{
			prizeId: Number,
			productPrize: [{
				productId: String,
				productName: String,
				discountSize: String
			}],
			voucherPrize: {
				voucherId: Number,
				amount: Number
			},
			entryReference: Number,
			entrantId: Number,
			entrantName: String,
			entrantEmail: String
		}],
		createdAt: {
			type: Date,
			default: Date.now()
		},
	}],
	superGiveaway: [{
		id: Number,
		name: String,
		childCampaigns: [{
			id: Number,
			name: String,
			winners: [{
				entrantId: String,
				entrantName: String,
				entrantEmail: String
			}]
		}],
		createdAt: {
			type: Date,
			default: Date.now()
		}
	}],
	campaignTemplate: [{
		id: Number,
		name: String,
		toSuper: Boolean,
		winners: [Object],
		active: Boolean,
		createdAt: {
			type: Date,
			default: Date.now()
		}
	}],
	customerList: [{
		customerId: Number,
		email: String,
		name: String,
		totalCampaignsParticipated: Number,
		totalPoints: Number,
		autoindex: Number,
		lastIndex: Number,
		createdAt: {
			type: Date,
			default: Date.now()
		}
	}],
	createdAt: {
		type: Date,
		default: Date.now()
	}
})

const Shop = mongoose.model('Shop', ShopSchema)

export default Shop