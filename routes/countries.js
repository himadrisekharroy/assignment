const express = require('express')
const router = express.Router();

const Country = require('../models/country');

//=== all
router.get('/', async (req, res)=>{
	try {
    	const countries = await Country.find()
    	res.json(countries)
  	} catch (err) {
    	res.status(500).json({ message: err.message })
  	}
})

//=== one
router.get('/:region',getCountry, (req, res)=>{
	res.json(res.country);
})


async function getCountry(req, res, next) {
  let country
  try {
    country = await Country.find({region: req.params.region}).exec();
    if (country == null) {
      return res.status(404).json({ message: 'Cannot find country' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.country = country
  next()
}


module.exports = router