require('dotenv').config()

const express = require('express')

const mongoose = require('mongoose')

var axios = require('axios');

const app = express()

var options = {
  user: process.env.DATABASE_UN,
  pass: process.env.DATABASE_PW
};


mongoose.connect(process.env.DATABASE_URL,options, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Database connection successful.'))

app.use(express.json())

const countriesRouter = require('./routes/countries')
app.use('/countries', countriesRouter)


//=====================
app.get('/salesrep', function (req, res) {
  
  axios.get('http://localhost:3000/countries/')
  .then(function(response) {
    var allCountries = response.data;
    var countriesByRegion= [];
    for(var i in allCountries){
      if( countriesByRegion[allCountries[i].region] === undefined ) {
          countriesByRegion[allCountries[i].region] = [];
          countriesByRegion[allCountries[i].region].push(allCountries[i].name);
      }
      else{
        countriesByRegion[allCountries[i].region].push(allCountries[i].name);
      }      
    }
    var responseArray = [];
    var minCountry = 3;
    var maxCountry = 7;

    for(var i in countriesByRegion){
      var countryCount = countriesByRegion[i].length;

      var minSalesReq = 0;
      var maxSaleReq = 0;

      if(countryCount % minCountry > 0) maxSaleReq = (countryCount / minCountry )+1;
      else maxSaleReq = (countryCount / minCountry );

      if(countryCount % maxCountry > 0) minSaleReq = (countryCount / maxCountry )+1;
      else minSaleReq = (countryCount / maxCountry );
      var temp = {region:i, minSaleReq: parseInt(minSaleReq), maxSaleReq: parseInt(maxSaleReq)};
      responseArray.push(temp);

    }
     res.send(responseArray);
  })  
})

app.get('/optimal', function (req, res) {
  axios.get('http://localhost:3000/countries/')
  .then(function(response) {
    var allCountries = response.data;
    var countriesByRegion= [];
    for(var i in allCountries){
      if( countriesByRegion[allCountries[i].region] === undefined ) {
          countriesByRegion[allCountries[i].region] = [];
          countriesByRegion[allCountries[i].region].push(allCountries[i].name);
      }
      else{
        countriesByRegion[allCountries[i].region].push(allCountries[i].name);
      }      
    }
    var responseArray = [];
    var maxCountry = 7;

    for(var i in countriesByRegion){
      var counrtyCount = 1;
      var tempCountryList = [];

      var k = 0;
      for(var j in countriesByRegion[i]){

        tempCountryList.push(countriesByRegion[i][j]);       

        if(counrtyCount == 7 ){
          responseArray.push({region:i, countryList: tempCountryList, counrtyCount: tempCountryList.length});
          tempCountryList = [];
          counrtyCount = 0
        }

        if(k == (countriesByRegion[i].length-1)){
          responseArray.push({region:i, countryList: tempCountryList, counrtyCount: tempCountryList.length});
          tempCountryList = []; 
          counrtyCount = 1         
        }
        counrtyCount++;
        k++;
      }
    }
     res.send(responseArray);
  })

})

/*
app.get('/region_countries', function (req, res) {
  var responseArray = [];
  axios.get('http://localhost:3000/countries/')
  .then(function(response) {
    var allCountries = response.data;
    var countriesByRegion= [];
    for(var i in allCountries){
      if( countriesByRegion[allCountries[i].region] === undefined ) {
          countriesByRegion[allCountries[i].region] = [];
          countriesByRegion[allCountries[i].region].push(allCountries[i].name);
      }
      else{
        countriesByRegion[allCountries[i].region].push(allCountries[i].name);
      }      
    }
    
    console.log(countriesByRegion);
    responseArray.push(countriesByRegion);
    
  })
  res.send(responseArray);
})*/

app.listen(3000, () => console.log('Server Started at port 3000'))
