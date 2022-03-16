import mongoose from 'mongoose'
import { ShopTypes } from './__types'

const ShopSchema = new mongoose.Schema({
	shop: {
		type: String,
		required: true,
		unique: true
	},
	pricePlan: String,
	chargeDetails: {
		plan: String,
		confirmed: Boolean,
		id: String,
		confirmedAt: Date,
		createdAt: {
			type: Date,
			default: Date.now()
		}
	},
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
	lastOrderPaidId: Number,
	createdAt: {
		type: Date,
		default: Date.now()
	}
})

const longEventSchema = new mongoose.Schema({
	shop: {
		type: String,
		required: true,
	},
	id: Number,
	name: String,
	templateId: Number,
	eventType: String,
	startDate: Date,
	endDate: Date,
	grandEventId: Number,
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
		entrantEmail: String,
		discountCode: String
	}],
	goals: {
		totalRevenue: Number
	},
	createdAt: {
		type: Date,
		default: Date.now()
	},
})

const rapidEventSchema = new mongoose.Schema({
	shop: {
		type: String,
		required: true,
	},
	id: Number,
	name: String,
	templateId: Number,
	dates: [Date],
	grandEvent: {
		id: Number
	},
	winnersChosen: Boolean,
	winnersGifted: Boolean,
	winnersTotal: Number,
	prizes: {
		normalPrize: Number,
		grandPrize: Number
	},
	createdAt: {
		type: Date,
		default: Date.now()
	},
})

const rapidChildsSchema = new mongoose.Schema({
	shop: {
		type: String,
		required: true,
	},
	id: Number,
	name: String,
	parentId: Number,
	eventType: String,
	startDate: Date,
	endDate: Date,
	winnersChosen: Boolean,
	winnersGifted: Boolean,
	entries: [{
		firstName: String,
		lastName: String,
		email: String,
		points: Number
	}],
	winnersTotal: Number,
	winner: {
		prizeId: Number,
		voucherPrize: Number,
		entrantName: String,
		entrantEmail: String,
		discountCode: String
	},
	createdAt: {
		type: Date,
		default: Date.now()
	},
})

const grandEventSchema = new mongoose.Schema({
	shop: {
		type: String,
		required: true,
	},
	id: Number,
	name: String,
	awaiting: Boolean,
	winnersChosen: Boolean,
	winnersGifted: Boolean,
	childrenEvents: [{
		id: Number,
		name: String,
		eventType: String,
		winnersChosen: Boolean,
		winners: [{
			entrantName: String,
			entrantEmail: String
		}]
	}],
	winners: [{
		prizeId: Number,
		voucherPrize: Number,
		entrantName: String,
		entrantEmail: String,
		discountCode: String
	}],
	createdAt: {
		type: Date,
		default: Date.now()
	}
})

const longEventTemplateSchema = new mongoose.Schema({
	shop: {
		type: String,
		required: true,
	},
	id: Number,
	name: String,
	type: String,
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

const rapidEventTemplateSchema = new mongoose.Schema({
	shop: {
		type: String,
		required: true,
	},
	id: Number,
	name: String,
	eventType: String,
	dates: [{
		day: Number,
		index: Number,
		durationFrom: Number
	}],
	winnersTotal: Number,
	prizes: {
		normalPrize: Number,
		grandPrize: Number
	},
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

const quotaSchema = new mongoose.Schema({
	shop: {
		type: String,
		required: true,
	},
	plan: {
		type: String,
		required: true
	},
	campaignTemplates: Number,
	eventCampaigns: {
		count: Number,
		days: Number
	},
	standaloneCampaigns: Number,
	grandCampaigns: Number,
})

const Shop = mongoose.model('Shop', ShopSchema)
const Long = mongoose.model('Campaign', longEventSchema)
const Grand = mongoose.model('Super', grandEventSchema)
const SavedLong = mongoose.model('SavedCampaign', longEventTemplateSchema)
const Customers = mongoose.model('Customers', customerListSchema)
const Quota = mongoose.model('Quota', quotaSchema)
const Rapid = mongoose.model('Rapid',  rapidEventSchema)
const RapidChild = mongoose.model('RapidChild', rapidChildsSchema)

export { Shop, Long, Grand, SavedLong, Customers, Quota, Rapid, RapidChild }