const generateDiscountCode = (length: number): string => {
	let result: string = '';
	let characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let charactersLength = characters.length;
	for ( let i = 0; i < length; i++ ) {
	  	result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

export { generateDiscountCode }