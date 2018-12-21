# bustime-node

This Node app pings the Clever Devices API to return real-time bus locations in JSON format.

Note: these files are configured for use on the Greater Portland (Maine) Metro system, but can easily be configured for other agencies that use Clever Devices' BusTime software.

Don't forget to include your Clever Devices API key in a .env file. Here's how to make one from the command line:

```
echo "API_KEY = '[your api key from Clever Devices]'" >> .env
```

### console_app.js 

Pings the API on a regular basis (with a `setInterval()` function) to return a point-in-time bus location object in this format:

```
{
 "timestamp": "20181221 10:58:19",
 "vehicles": [
  {
   "vid": [vehicle ID number],
   "route": [route ID number],
   "pid": [trip ID number],
   "lat": 43.690311431884766,
   "lon": -70.39920806884766
  }
  .
  .
  .
 ]
}
``` 

Right now the JSON responses are merely dumped into the Terminal console, where they can be saved as a text file after the app runs for a day or two. Ideally, though, these responses would get written into a SQL database.  

### busMap

This directory includes files for displaying one day's worth of JSON data from the console_app responses (saved as busLocations.json) in a D3.js animated map. 

### console_app.js 
Running this from the command line returns a geocoded list of bus stops. 
