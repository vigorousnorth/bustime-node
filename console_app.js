const http = require('http');

require('dotenv').config();

const apiObj = { 
	key: process.env.API_KEY, // required 
	host: 'smttracker.southportland.org', // required 
	localestring: 'lang', // optional, default is whatever the BusTime API you’re accessing is set to 
	port: 80, // optional, default is 80 
	// path: '/path/to/api' // optional, default is '/bustime/api/v1' 
}

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {

	res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('Hello World\n');
  
});

server.listen(port, hostname, () => {

	setInterval(function() {
    var bustime = require('bustime')(apiObj);

		var reqObj = { 
		rt: '1,2,4,5,7,9A,9B,HSK' // optional, not available w/vid, a list of bus route identifiers
	// vid: vehicle_id, // optional, not available w/rt 
	// tmres: resolution // optional, defaults to 'm' 
		}	 

		bustime.request('gettime', {}, function (err, result) {

			consoleRes = { 'timestamp' : null, 'vehicles' : []};

  		consoleRes.timestamp = result.tm[0];

  		bustime.vehicles(reqObj, function (error, v) { 
				let buses = v.vehicle;
				if (buses) { 
					busObject = {}
  		
					for (var i = buses.length - 1; i >= 0; i--) {
						let busObj = {};

						busObj.vid = buses[i].vid;
						busObj.route = buses[i].rt;
						busObj.pid = buses[i].pid;
						busObj.lat = +buses[i].lat;
						busObj.lon = +buses[i].lon;

						(consoleRes.vehicles).push(busObj);
					};
				} else return false;	
				
				console.log(JSON.stringify(consoleRes, null, 1) + "," );

			});	
		});

		
		

	}, 2 * 60 * 1000); // returns a response every 2.5 minutes (2.5 * 60 * 1000 milsec)


  console.log(`Server running at http://${hostname}:${port}/`);
});







