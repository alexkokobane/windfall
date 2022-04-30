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
	//console.log(plan+ " from the func")
	let priorSix: any[] = []
	if(plan === "Freebie"){	
		for(let i = -5; i <= 0; i++){
			const dateNow = new Date(Date.now())
			const month: number = dateNow.getMonth() + i
			priorSix.push({
				"month": new Date(dateNow.setMonth(month)).toISOString().substring(0, 7),
				"value": 0,
				"maxValue": 350,
				"plan": "Freebie"
			})
		}
	} else if( plan === "Appetizer"){
		for(let i = -5; i <= 0; i++){
			const dateNow = new Date(Date.now())
			const month: number = dateNow.getMonth() + i
			priorSix.push({
				"month": new Date(dateNow.setMonth(month)).toISOString().substring(0, 7),
				"value": 0,
				"maxValue": 10000,
				"plan": "Appetizer"
			})
		}	
	} else if (plan === "Main"){
		//console.log("hi")
		for(let i = -5; i <= 0; i++){
			const dateNow = new Date(Date.now())
			const month: number = dateNow.getMonth() + i
			priorSix.push({
				"month": new Date(dateNow.setMonth(month)).toISOString().substring(0, 7),
				"value": 0,
				"maxValue": 100000,
				"plan": "Main"
			})
		}
	}

	return priorSix
}

export { generateDiscountCode, newSubs }