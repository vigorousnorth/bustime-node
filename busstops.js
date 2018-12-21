const apiObj = { 
	key: process.env.API_KEY, // required 
	host: 'smttracker.southportland.org', // required 
	localestring: 'lang', // optional, default is whatever the BusTime API you’re accessing is set to 
	port: 80, // optional, default is 80 
	// path: '/path/to/api' // optional, default is '/bustime/api/v1' 
}

var bustime = require('bustime')(apiObj);

var reqObj = { 
	dir: '0,1',
rt: '1,2,4,5,7,8,9A,9B' // optional, not available w/vid 
// vid: vehicle_id, // optional, not available w/rt 
// tmres: resolution // optional, defaults to 'm' 
}	 

bustime.stops(reqObj, function (err, res) { console.log(JSON.stringify(res, null, 2)); })







