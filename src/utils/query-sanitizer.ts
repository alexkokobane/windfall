import { Request, Response, NextFunction } from 'express'

const querySanitizer = (req: Request, res: Response, title: string): string => {
	let turner: string

	if (req.query.title && typeof req.query.title === 'string') {
	  turner = req.query.title
	} else {
	  turner = 'undefined'
	}

	return turner 
}

export default querySanitizer