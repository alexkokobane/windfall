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
	const dateNow = new Date(Date.now())
	const priorSix: any[] = []
	if(plan === "Starter"){		
		for(let i: number = -5; i > 0; i++){
			const month: number = dateNow.getMonth() + i
			priorSix.push({
				"month": new Date(dateNow.setMonth(month)).toISOString().substring(0, 8),
				"value": 0,
				"maxValue": 200,
				"plan": "Starter"
			})
		}
	} else if( plan === "StarterPlus"){
		for(let i: number = -5; i > 0; i++){
			const month: number = dateNow.getMonth() + i
			priorSix.push({
				"month": new Date(dateNow.setMonth(month)).toISOString().substring(0, 8),
				"value": 0,
				"maxValue": 2000,
				"plan": "StarterPlus"
			})
		}	
	} else if (plan === "Standard"){
		for(let i: number = -5; i > 0; i++){
			const month: number = dateNow.getMonth() + i
			priorSix.push({
				"month": new Date(dateNow.setMonth(month)).toISOString().substring(0, 8),
				"value": 0,
				"maxValue": 20000,
				"plan": "Standard"
			})
		}
	} else if(plan === "Ultimate"){
		for(let i: number = -5; i > 0; i++){
			const month: number = dateNow.getMonth() + i
			priorSix.push({
				"month": new Date(dateNow.setMonth(month)).toISOString().substring(0, 8),
				"value": 0,
				"maxValue": 200000,
				"plan": "Ultimate"
			})
		}
	} else if(plan === "Enterprise"){
		for(let i: number = -5; i > 0; i++){
			const month: number = dateNow.getMonth() + i
			priorSix.push({
				"month": new Date(dateNow.setMonth(month)).toISOString().substring(0, 8),
				"value": 0,
				"maxValue": 10000000,
				"plan": "Enterprise"
			})
		}
	}

	return priorSix
}

export { generateDiscountCode, newSubs }