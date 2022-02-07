const mongoose = require('mongoose')

const countrySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	region: {
		type: String,
		required: true
	},
})

module.exports = mongoose.model('Countries', countrySchema)