import { validationResult } from 'express-validator'

export const getErrorMessages = (req) => {
  const errors = {}
  validationResult(req).errors.forEach(error => {
    errors[error.param] = {
      msg: error.msg,
      val: error.val,
    }
  })
  return errors
}