const generateDiscountCode = (length: number): string => {
	let result: string = '';
	let characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let charactersLength = characters.length;
	for ( let i = 0; i < length; i++ ) {
	  	result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

const newSubs = (plan: string): any[] => {	
	console.log(plan+ " from the func")
	let priorSix: any[] = []
	if(plan === "Starter"){	
		for(let i = -5; i <= 0; i++){
			const dateNow = new Date(Date.now())
			const month: number = dateNow.getMonth() + i
			priorSix.push({
				"month": new Date(dateNow.setMonth(month)).toISOString().substring(0, 7),
				"value": 0,
				"maxValue": 300,
				"plan": "Starter"
			})
		}
	} else if( plan === "Growth"){
		for(let i = -5; i <= 0; i++){
			const dateNow = new Date(Date.now())
			const month: number = dateNow.getMonth() + i
			priorSix.push({
				"month": new Date(dateNow.setMonth(month)).toISOString().substring(0, 7),
				"value": 0,
				"maxValue": 5000,
				"plan": "Growth"
			})
		}	
	} else if (plan === "Standard"){
		console.log("hi")
		for(let i = -5; i <= 0; i++){
			const dateNow = new Date(Date.now())
			const month: number = dateNow.getMonth() + i
			priorSix.push({
				"month": new Date(dateNow.setMonth(month)).toISOString().substring(0, 7),
				"value": 0,
				"maxValue": 100000,
				"plan": "Standard"
			})
		}
	} else if(plan === "Ultimate"){
		for(let i = -5; i <= 0; i++){
			const dateNow = new Date(Date.now())
			const month: number = dateNow.getMonth() + i
			priorSix.push({
				"month": new Date(dateNow.setMonth(month)).toISOString().substring(0, 7),
				"value": 0,
				"maxValue": 200000,
				"plan": "Ultimate"
			})
		}
	} else if(plan === "Enterprise"){
		for(let i = -5; i <= 0; i++){
			const dateNow = new Date(Date.now())
			const month: number = dateNow.getMonth() + i
			priorSix.push({
				"month": new Date(dateNow.setMonth(month)).toISOString().substring(0, 7),
				"value": 0,
				"maxValue": 10000000,
				"plan": "Enterprise"
			})
		}
	}

	return priorSix
}

export { generateDiscountCode, newSubs }