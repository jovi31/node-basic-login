import { validationResult } from 'express-validator'

export const getErrorMessages = (req) => validationResult(req).errors.map(err => err.msg)