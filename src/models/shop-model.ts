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
	newChargeDetails: {
		plan: String,
		id: String,
		createdAt: {
			type: Date,
			default: Date.now()
		}
	},
	shopifyPlan: String,
	name: String,
	billingAddress: {
		address1: String,
		address2: String,
		city: String,
		zip: String,
		country: String
	},
	metaDescription:String,
	id: String,
	shopUrl: String,
	scope: [String],
	email: String,
	currencyCode: String,
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
	longTermGoals: {
		totalRevenue: Number
	},
	emailTemplate: Object,
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
	currencyCode: String,
	qualifying: String,
	qualifyingId: [String],
	qualifyingItems: [Array],
	entries: [{
		firstName: String,
		lastName: String,
		email: String,
		points: Number,
		spent: Number,
		presentedCurrency: String,
		tip: Number,
		marketing: Boolean,
		city: String,
		country: String,
		metadata: [{
			spent: Number,
			presentedCurrency: String,
			timestamp: Date
		}]
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
		totalRevenue: Number,
		totalEntries: Number
	},
	analytics: {
		avgSpentCounter: [{
			time: String,
			value: Number
		}]
	},
	timer: Date,
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
	eventType: String,
	grandEvent: {
		id: Number
	},
	goals: {
		totalRevenue: Number,
		totalEntries: Number
	},
	winnersChosen: Boolean,
	winnersGifted: Boolean,
	winnersTotal: Number,
	currencyCode: String,
	qualifying: String,
	qualifyingId: [String],
	qualifyingItems: [Array],
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
	templateId: Number,
	eventType: String,
	startDate: Date,
	endDate: Date,
	winnersChosen: Boolean,
	winnersGifted: Boolean,
	currencyCode: String,
	qualifying: String,
	qualifyingId: [String],
	qualifyingItems: [Array],
	entries: [{
		firstName: String,
		lastName: String,
		email: String,
		points: Number,
		spent: Number,
		presentedCurrency: String,
		tip: Number,
		marketing: Boolean,
		city: String,
		country: String,
		metadata: [{
			spent: Number,
			presentedCurrency: String,
			timestamp: Date
		}]
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
	currencyCode: String,
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
	eventType: String,
	distributionType: String,
	duration: Number,
	winnersTotal: Number,
	qualifying: String,
	qualifyingId: [String],
	qualifyingItems: [Array],
	currencyCode: String,
	toSuper: [String],
	winners: [Object],
	goals: {
		totalRevenue: Number,
		totalEntries: Number
	},
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
		durationFrom: Number
	}],
	goals: {
		totalRevenue: Number,
		totalEntries: Number
	},
	qualifying: String,
	qualifyingId: [String],
	qualifyingItems: [Array],
	currencyCode: String,
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
	entries: [{
		month: String,
		value: Number,
		maxValue: Number,
		plan: String
	}]
})

const transactionSchema = new mongoose.Schema({
	shop: {
		type: String,
		required: true,
	},
	country: String,
	city: String,
	spent: Number,
	currencyCode: String,
	createdAt: {
		type: Date,
		default: Date.now()
	}
})

const Shop = mongoose.model('Shop', ShopSchema)
const Long = mongoose.model('Campaign', longEventSchema)
const Grand = mongoose.model('Super', grandEventSchema)
const SavedLong = mongoose.model('SavedCampaign', longEventTemplateSchema)
const Customers = mongoose.model('Customers', customerListSchema)
const Quota = mongoose.model('Quota', quotaSchema)
const Rapid = mongoose.model('Rapid',  rapidEventSchema)
const RapidChild = mongoose.model('RapidChild', rapidChildsSchema)
const SavedRapid = mongoose.model('SavedRapid', rapidEventTemplateSchema)
const Purchase = mongoose.model('Transaction', transactionSchema)

export { Shop, Long, Grand, SavedLong, Customers, Quota, Rapid, RapidChild, SavedRapid, Purchase }