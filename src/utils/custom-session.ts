import { Session } from '@shopify/shopify-api'
import ActiveShop from '../models/session-model'

interface StringSession {
	id: string,
	session: string
}

export const storeSession = async (session: Session): Promise<boolean> => {
	try {
		const check =  await ActiveShop.findOne({id: session.id})
		if(check !== null ) {
			await ActiveShop.findOneAndUpdate({id: session.id},{
				session: JSON.stringify(session)
			},{ new: true })
		} else {
			const store = new ActiveShop({
				id: session.id ,
				session: JSON.stringify(session),
				shop: session.shop
			})
			await store.save()
		 }
		return true
	} catch(err: any) {
		console.log(err)
		console.log("THE ERROR IS ON THE storeCallback")
	}
}

export const loadSession = async (id: string): Promise<Session | undefined> => {
	try {
		const load: StringSession = await ActiveShop.findOne({id: id})
		if(load) {
			const session: Session = JSON.parse(load.session)
			return session
		} else {
			return undefined
		}
	} catch(err: any) {
		console.log(err)
		console.log("THE ERROR IS ON THE loadCallback")
	}
}

export const deleteSession = async (id: string): Promise<boolean> => {
	try {
		await ActiveShop.findOneAndDelete({id: id})
		return true
	} catch(err: any) {
		console.log(err)
		console.log("THE ERROR IS ON THE deleteCallback")
	}
}