var projection = d3.geoAlbers()
    .center([0, 43.681])
    .rotate([70.295, 0])
    .parallels([40, 50]);   

var scalar = 0.6, mapwidth, height, w, h, svg, 
  timetitle, gState, gStreets, gData, scale, filter, path = d3.geoPath();

var color = d3.scaleOrdinal(d3.schemeCategory20);

var ind = 0, currentVIDs = [], lastVIDs = [];
  
var neighborhoodnames = [
  {'name': 'West End', 'lat': 43.648761, 'lng': -70.270244 },
  {'name': 'West Falmouth', 'lat': 43.732,  'lng': -70.3 },
  {'name': 'Riverton', 'lat': 43.697135,   'lng': -70.308957 },
  {'name': 'Maine Mall', 'lat': 43.635,    'lng': -70.335 },
  {'name': 'Falmouth Center', 'lat': 43.728,     'lng': -70.243 },
  {'name': 'Deering Center','lat': 43.674336, 'lng': -70.3},
  {'name': 'Westbrook', 'lat': 43.668,'lng': -70.355},
  {'name': 'East Deering', 'lat': 43.6865,'lng': -70.259}
];


var streetnames = [
  {'name': 'Congress St.', 'type':'LineString', 'coordinates' : [[-70.310354,43.6591],[-70.308473,43.659925],[-70.307812,43.659971],[-70.306943,43.659932],[-70.305228,43.659474],[-70.302828,43.658779],[-70.301884,43.658589],[-70.300554,43.658488],[-70.300554,43.658488],[-70.299369,43.658565],[-70.297797,43.658945]]},
 // {'name': 'Congress St.', 'type':'LineString', 'coordinates' : [[-70.260213,43.656680],[-70.257872,43.658406],[-70.257056,43.658908],[-70.256173,43.659419],[-70.255538,43.659741],[-70.254410,43.660501],[-70.252929,43.661686]]},
  {'name': 'Park Ave.', 'type':'LineString', 'coordinates' : [[-70.280287,43.655834],[-70.278668,43.655845],[-70.276549,43.655826],[-70.275991,43.655907],[-70.272181,43.656598],[-70.266223,43.657714]]},
  {'name': 'Cumberland Ave.', 'type':'LineString', 'coordinates' : [[-70.265711,43.655575],[-70.265175,43.655757],[-70.262107,43.657566],[-70.258497,43.659747],[-70.255359,43.661649],[-70.251942,43.663690]]},
  {'name': 'Commercial St.', 'type':'LineString', 'coordinates' : [[-70.272343,43.643193],
    [-70.271023,43.643494],[-70.268740,43.644070],[-70.265985,43.644946],[-70.262079,43.645814],
    [-70.261457,43.645977],[-70.261092,43.646225],[-70.258835,43.648821]]},
  {'name': 'Warren Ave.', 'type':'LineString', 'coordinates' : [[-70.318097,43.686991],[-70.306520,43.687899],[-70.302666,43.688202],[-70.301357,43.688365],[-70.297988,43.688974]]},
  {'name': 'Brighton Ave.', 'type':'LineString', 'coordinates' : [[-70.322310,43.674618],[-70.319745,43.674159],[-70.316632,43.673659],[-70.315577,43.673456],[-70.314654,43.673138],[-70.312101,43.672416],[-70.308732,43.671361],[-70.307863,43.671058],[-70.304941,43.669966]]},
  
  {'name': 'Ocean Ave.', 'type':'LineString', 'coordinates' : [[-70.282395,43.675954],[-70.280050,43.678182],
    [-70.278795,43.679420],[-70.277229, 43.680964],[-70.276950,43.681181],[-70.276585,43.681460],
    [-70.276226,43.681555],[-70.275634,43.681725],[-70.274561,43.681927],[-70.273708,43.682296],[-70.272034,43.683324],[-70.270033,43.684755]]},
  {'name': 'Allen Ave.', 'type':'LineString', 'coordinates' : [[-70.293181,43.690671],[-70.292258,43.694108],[-70.292108,43.694573],[-70.291703,43.695262],[-70.291272,43.695774],[-70.290404,43.696795],[-70.289534,43.698067],[-70.288949,43.698831]]},
  {'name': 'Washington Ave.', 'type':'LineString', 'coordinates' : [[-70.285826,43.697077],[-70.283192,43.693565],[-70.282570,43.693045],[-70.281283,43.692339],[-70.279277,43.691424],[-70.273666,43.688600]]},
  {'name': 'Forest Ave.', 'type':'LineString', 'coordinates' : [[-70.282977,43.669925],[-70.275164,43.665127],[-70.271634,43.662845]]}
];

const xx = jQuery;

window.addEventListener('DOMContentLoaded', init);

function init() {
 
  mapwidth = xx('#charts_container').width(),
  mapheight = Math.max(xx('#chatter').height(), mapwidth),
 
  mapsvg = d3.select("#charts_container").append('svg')
    .attr("id", "map_svg")
    .attr("width", mapwidth)
    .attr("height", mapheight );
    
  mapAll = mapsvg.append("g");

  gState = mapAll.append("g").attr("id", "state"),
  gStreets = mapAll.append('g').attr('id','roads'),
   neighborhood_labels = gStreets.append('g').attr('class','labels'),
   street_labels = mapAll.append('g').attr('class','labels'),
  gData = mapAll.append("g").attr("id", "dataoverlay");

  timetitle = mapAll.append('text')
    .attr('class','time')
    .attr('transform','translate(10,20)')

  timetitle.append('tspan').text('Nov. 21, 2018')
  timetitle.append('tspan')
    .attr('id','hour')
    .attr('x',0).attr('y',40)
    .text('');

  drawMap();

} // end of init function

async function drawMap() {

  const me = await d3.json("http://specialprojects.pressherald.com/topojson/greaterportland_topo.json");
  const roads = await d3.json("http://specialprojects.pressherald.com/topojson/portlandstreets_topo.json")
  const buses = await d3.json("busLocations.json")
    // .defer(d3.csv, "ridership_by_route.csv")

  scale = mapwidth * 400 + 12000;

  let currentLocations = buses[0].vehicles;

  projection
    .scale(scale)
    .translate([mapwidth / 2, mapheight / 2 + 5]);

  path.projection(projection);  

  gState.selectAll("path.svgTown")
    .data(topojson.feature(me, me.objects.greaterportland_geo).features)
    .enter().append("path")
    .attr('d', path)
    .attr('class','svgTown')
    .attr('id', function(d) { return d.properties.name; })
    .attr('stroke','#ddd').style("fill","none")
    .style("fill", function(d) {
      return (d.properties.land === 'y') ? '#f2efe9' : '#bdd1d9';  
    });

  gState
    .selectAll("path.openspace")
    .data(topojson.feature(roads, roads.objects.portland_parks).features)
    .enter().append("path")
    .attr('d', path)
    .attr('id', function(d) { return d.properties.name ? d.properties.name : null; })
    .attr('class', function(d) {
      if (d.properties.amenity === "grave_yard") { return 'openspace grave_yard'}
      else { return 'openspace ' + d.properties.leisure; }
    });

  gStreets
    .selectAll("path.road")
    .data(topojson.feature(roads, roads.objects.portland_streets).features)
    .enter().append("path")
    .attr('d', path)
    .attr('id', function(d) { return d.properties.name ? d.properties.name : null; })
    .attr('class', function(d) { return 'road ' + d.properties.highway;  });

  street_labels
  .selectAll("path.street_label_path")
    .data(streetnames)
    .enter().append('path')
    .attr('d', path)
    .attr('class','street_label_path')
    .attr('id', function(d,i) { return  d.name.split(' ')[0] + i; });

  street_labels.selectAll('.street_label')
    .data(streetnames)
    .enter().append('text')
    .attr("dy",-2)
    .attr('class','street_label')
    .append('textPath')
    .attr('xlink:href', function(d,i) { return "#" + d.name.split(' ')[0] + i; })
    .text(function(d) { return d.name })
    .attr("startOffset", "50%"); 
  
  color.domain([1,9]);


  function update(vehicles, t) {

    let timestamp = mapAll.select('tspan#hour')
      .text(t.substring(9,17));

    let dots = gData.selectAll('g.bus')
      .data(vehicles, d => +d.vid);

    lastVIDs = currentVIDs;
    currentVIDs = vehicles.map(d => +d.vid);

    dots
      .attr('class', d =>  'update bus rt' + d.route )
      
    // dots.each(animateBus);

    let newdots = dots.enter().append('g')
      .attr('class', d =>  'enter bus rt' + d.route )
      .attr('id', d => 'vid_' + d.vid)
      .attr('transform', d => 'translate(' + projection([d.lon,d.lat]) + ')')
      
     newdots.append('circle').attr('r',4).attr('cx',2).attr('cy',2);
     newdots.append('text').attr('x',5).text(d => d.route); 
      // .attr('cx', d => projection([d.lon,d.lat])[0] )
      // .attr('cy', d => projection([d.lon,d.lat])[1] );
    
      newdots.merge(dots)
      .filter( d => (lastVIDs.indexOf(+d.vid) > -1) )
      .transition().duration(500)
      .attr('transform', d => 'translate(' + projection([d.lon,d.lat]) + ')')

    dots.exit().remove();
    
    ind++;

  }

  update(currentLocations, buses[0].timestamp);

  // Grab a random sample of letters from the alphabet, in alphabetical order.
  d3.interval(function() {
    if (buses[ind]) { update( buses[ind].vehicles, buses[ind].timestamp  ); }
  }, 500);

  
  var neighborhoods = neighborhood_labels.selectAll("text.neighborhood_label")
    .data(neighborhoodnames)
    .enter().append('text')
    .attr('class','neighborhood_label')
    .attr('text-anchor','middle')
    .attr("transform", function(d) { 
      return "translate(" + projection([d.lng, d.lat]) + ")scale(1.15,1)"; 
    }); 

  neighborhoods.selectAll('tspan')
    .data(function(d) { return splitName(d.name); })
    .enter().append('tspan')
    .attr('x',0)
    .attr('dy', function(d,i) { return (i*1.75 - 0.5) + "em";})
    .text(function(d) { return d; });


} // end of ready function

function highlight(d) {
  var a = d3.select('path#' + d);
  d3.selectAll('.busroute').classed('highlighted', false);
  a.classed('highlighted', true);
}

function splitName(d) {
  var a = d.split(" ");
  var lastline = "", s = " ";
  
  if (a.length>1) {
    for (var i = 1; i < a.length; i++) {
     lastline += s + a[i];
    };
    return [a[0], lastline];
  } else {return a;}
}


function numberWithCommas(x) {
    if (typeof x !== 'undefined') {
    	var parts = x.toString().split(".");
    	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    	return parts.join(".");
    } else {
    	return(x);
    }
}

