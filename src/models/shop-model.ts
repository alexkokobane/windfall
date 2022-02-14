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
	createdAt: {
		type: Date,
		default: Date.now()
	}
})

const campaignSchema = new mongoose.Schema({
	shop: {
		type: String,
		required: true,
	},
	id: Number,
	name: String,
	templateId: Number,
	startDate: Date,
	endDate: Date,
	toSuper: [Number],
	distributionType: String,
	winnersChosen: Boolean,
	winnersGifted: Boolean,
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
		entrantName: String,
		entrantEmail: String
	}],
	createdAt: {
		type: Date,
		default: Date.now()
	},
})

const superCampaignSchema = new mongoose.Schema({
	shop: {
		type: String,
		required: true,
	},
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
})

const campaignTemplateSchema = new mongoose.Schema({
	shop: {
		type: String,
		required: true,
	},
	id: Number,
	name: String,
	distributionType: String,
	duration: Number,
	winnersTotal: Number,
	toSuper: [String],
	winners: [Object],
	active: Boolean,
	createdAt: {
		type: Date,
		default: Date.now()
	}
})

const customerListSchema = new mongoose.Schema({
	shop: {
		type: String,
		required: true,
	},
	email: String,
	firstName: String,
	lastName: String,
	totalCampaignsParticipated: Number,
	totalPoints: Number,
	autoindex: Number,
	lastIndex: Number,
	totalCampaignsWon: Number,
	createdAt: {
		type: Date,
		default: Date.now()
	}
})



const Shop = mongoose.model('Shop', ShopSchema)
const Campaign = mongoose.model('Campaign', campaignSchema)
const Super = mongoose.model('Super', superCampaignSchema)
const Saved = mongoose.model('SavedCampaign', campaignTemplateSchema)
const Customers = mongoose.model('Customers', customerListSchema)

export { Shop, Campaign, Super, Saved, Customers }