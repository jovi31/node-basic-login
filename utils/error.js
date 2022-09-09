const { validationResult } = require('express-validator')

exports.getErrorMessages = (req) => validationResult(req).errors.map(err => err.msg)