declare interface ShopTypes {
	shop: string,
	pricePlan?: string,
	scope?: [string],
	email?: string,
	entryNotificationTemplate?: [{
		id: number,
		name?: string,
		receiptAddress?: string,
		body?: string,
		createdAt?: number
	}],
	winnerNotificationTemplate?: [{
		id: number,
		name?: string,
		receiptAddress?: string,
		body?: string,
		createdAt?: number
	}],
	campaigns?: [{
		id: number,
		name?: string,
		startDate?: string,
		endDate?: string,
		toSuper?: boolean,
		entries?: [{
			id: number,
			reference?: number,
			name?: string,
			email?: string,
			points?: number
		}],
		winners?: [{
			prizeId: number,
			productPrize: [{
				productId: string,
				productName?: string,
				discountSize?: string 
			}],
			voucherPrize?: [{
				voucherId: number,
				amount?: number
			}],
			entryReference?: number,
			entrantId?: number,
			entrantName?: string,
			entrantEmail?: string
		}],
		createdAt?: number
	}],
	superGiveaway?: [{
		id: number,
		name?: string,
		childCampaign: [{
			id: number,
			name?: string,
			winners?: [{
				entrantId: number,
				entrantName?: string,
				entrantEmail?: string
			}]
		}],
		createdAt?: string
	}],
	campaignTemplate?: [{
		id: number,
		name?: string,
		toSuper?: boolean,
		winners?: [object],
		active?: boolean,
		createdAt: number
	}],
	customerList?: [{
		customerId: number,
		email?: string,
		name?: string,
		totalCampaignsParticipate?: number,
		totalPoints?: number,
		autoindex?: number,
		lastIndex?: number,
		createdAt?: number
	}],
	createdAt?: number
}

export { ShopTypes }