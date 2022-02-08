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
		toSuper: [String],
		distributionType: String,
		state: String,
		entries: [{
			firstName: String,
			lastName: String,
			email: String,
			points: Number
		}],
		winnersTotal: Number,
		winners: [{
			prizeId: Number,
			voucherPrize: Number,
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
		distributionType: String,
		winnersTotal: Number,
		toSuper: [String],
		winners: [Object],
		active: Boolean,
		createdAt: {
			type: Date,
			default: Date.now()
		}
	}],
	customerList: [{
		email: String,
		firstName: String,
		lastName: String,
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