var start_point, end_point;
var x1, y1, x2,y2, _x, _y;
var lineLayer, routingLayer, pointStart, start, pointEnd, end;
var geocoder;
var tmp_global = 0;	
var routeDemand = false;	
var t15;

// apply styles to map layers
var analysis_style_cur;
var analysis_style_old;
var results_style_map = new OpenLayers.StyleMap({'default':  results_style });

// global vars for map
var map;	
var proj_900913 = new OpenLayers.Projection('EPSG:900913');    
var proj_4326 = new OpenLayers.Projection('EPSG:4326');   
var currentLayer, returnLayer, rasterLayer;

// global vars for other parts
var useTagBox;
var col1, col2;	//chart colours
var col1_borderColor, col2_borderColor; //chart border colours
var clickNumber = 1;

var w_style = new OpenLayers.StyleMap({'default': white_style});
var b_style = new OpenLayers.StyleMap({'default': black_style });

// to record what the user does, dump any sql results into a table with a unique ID
// these IDs are null by default and any new query overwrites the last
var r_unique = null;	// routing
var a_unique = null;	// area summary

//intial function
initialize = function (){	
		
		// Create map controls	
		createMap();			// Main map		
		mapControls();			// Map controls 
		makeInterface();		// Interface				
		//createCharts();			// make charts	

		$('#report').hide();					
		geocoder = new google.maps.Geocoder();	// google function (limit of 15000 per day) but also rate-limited     	
        
        	
			
}

// get lat/lng of address; Ireland priorized
codeAddress = function() {

	console.log('geocoding');	
	
    var address = $("#address_start").val() //+ ', co. dublin, Ireland';
    	console.log(address);
        geocoder.geocode( { 'address': address, 'region': 'IE'}, function(results1, status) {
			if (status == google.maps.GeocoderStatus.OK) {											
					x1 = results1[0].geometry.location.lat();
					y1 = results1[0].geometry.location.lng();
					console.log('Start Point - x1:', x1, ' y1: ', y1);								
			}	
			else {			
				console.log("Geocoding start address was not successful. Reason: " + status);
		  }	  
	});	 
	
}

// reverese geocode when user drags points
codeLatLng = function (lat, lng, where) {
   
    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {               	
          if(where == 'start'){
          		$('#address_start').val(results[0].address_components[0].short_name + ', ' + results[0].address_components[1].short_name + ', ' + results[0].address_components[2].short_name);
          }else
          {
          		$('#address_end').val(results[0].address_components[0].short_name + ', ' + results[0].address_components[1].short_name + ', ' + results[0].address_components[2].short_name);
          }
          console.log(results[0].formatted_address);   
          console.log(results)       
        }
      } else {
        console.log("Reverse geocoder failed due to: " + status);
      }
    });
  }

// Set up base map
createMap = function (){

		// map options		
		var options = {
			projection: proj_900913,
			units: "m",
			numZoomLevels: 20,
			maxResolution: 15654.0339,
			maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
			displayProjection: proj_900913,			
			controls: [		//remove controls from the screen
				new OpenLayers.Control.Navigation(),
				new OpenLayers.Control.ArgParser(),
				new OpenLayers.Control.Attribution()
			],
			renderers: ["SVG", "Canvas", "VML"]
		};	
		var options2 = {
			projection: proj_900913,
			units: "m",
			numZoomLevels: 20,
			maxResolution: 15654.0339,
			maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
			displayProjection: proj_900913,			
			controls: [		//remove controls from the screen
				new OpenLayers.Control.Navigation(),
				new OpenLayers.Control.ArgParser(),
				new OpenLayers.Control.Attribution()
			]
		};		
					
		//map = new OpenLayers.Map("basicMap", options);
		map = new OpenLayers.Map("basicMap", options2);

		// Use OSM
		osm = new OpenLayers.Layer.OSM();			
		map.addLayer(osm);				

		// experimenting with WMS		
		t15 = new OpenLayers.Layer.WMS( 
			"dublin roads",
			"http://ncg.urbmet.com/mapserv.cgi?map=../../mapfiles/iso.map", 
			{layers: 't15', transparent:true},
			{isBaseLayer:false, singleTile:true, ratio:1, opacity:0.7 /*, max_cost:2000*/}
	    );

		
	    t30 = new OpenLayers.Layer.WMS( 
			"dublin roads",
			"http://ncg.urbmet.com/mapserv.cgi?map=../../mapfiles/iso.map", 
			{layers: 't30', transparent:true},
			{isBaseLayer:false, singleTile:true, ratio:1, opacity:0.7}
	    );

	    t45 = new OpenLayers.Layer.WMS( 
			"dublin roads",
			"http://ncg.urbmet.com/mapserv.cgi?map=../../mapfiles/iso.map", 
			{layers: 't45', transparent:true},
			{isBaseLayer:false, singleTile:true, ratio:1, opacity:0.7}
	    );

	    t60 = new OpenLayers.Layer.WMS( 
			"dublin roads",
			"http://ncg.urbmet.com/mapserv.cgi?map=../../mapfiles/iso.map", 
			{layers: 't60', transparent:true},
			{isBaseLayer:false, singleTile:true, ratio:1, opacity:0.7}
	    );

	    map.addLayers([t15, t30, t45, t60]);		    

		//t1.setVisibility(false)
		t30.setVisibility(false);
		t45.setVisibility(false);
		t60.setVisibility(false);		
		
		/* handle sliding*/	
		$("[data-slider]")
	    .bind("slider:ready slider:changed", function (event, data) {
	      $(this)
	        .nextAll(".output:first")
	          .html(data.value.toFixed(0));
	          var val = data.value.toFixed(0);	  
	          $('#slider_output').html(val);        
	          if(val == 15){
	          	console.log()
	          	t15.setVisibility(true)
				t30.setVisibility(false);
				t45.setVisibility(false);
				t60.setVisibility(false);		
	          }
	          if(val == 30){
	          	t15.setVisibility(false)
				t30.setVisibility(true);
				t45.setVisibility(false);
				t60.setVisibility(false);		
	          }
	          if(val == 45){
	          	t15.setVisibility(false)
				t30.setVisibility(false);
				t45.setVisibility(true);
				t60.setVisibility(false);		
	          }
	          if(val == 60){
	          	t15.setVisibility(false)
				t30.setVisibility(false);
				t45.setVisibility(false);
				t60.setVisibility(true);		
	          }

	    });

	    // play through these by moving slider?
	
		var mapCenter = new OpenLayers.LonLat(-7235119,3977082);				
		map.setCenter(mapCenter, 3);  
				
		currentLayer = new OpenLayers.Layer.Vector("currentLayer");		// Add drawing layer #0		
		oldLayer = new OpenLayers.Layer.Vector("oldLayer");				// Add drawing layer #1
		returnLayer = new OpenLayers.Layer.Vector("returnLayer", {styleMap:results_style});			// results from polygon		
		oldReturnLayer = new OpenLayers.Layer.Vector("oldReturnLayer", {styleMap:results_old});		// results from polygon	
		routingLayer = new OpenLayers.Layer.Vector("routingLayer", {styleMap:routing_style});		// from prouting using start/end		
		pointStart = new OpenLayers.Layer.Vector("start", {styleMap:startPoint});	
		pointEnd = new OpenLayers.Layer.Vector("end", {styleMap:endPoint});	        

		map.addLayers([currentLayer, oldLayer, returnLayer, oldReturnLayer, routingLayer, pointStart, pointEnd]);	
		centerMap()		// center map on Ireland

		/*
		coords = new OpenLayers.Control.MousePosition()	// view mouse position (mainly for debugging)
		map.addControl(coords);		
		
		map.events.register("mousemove", map, function(e) { 
                //var position = this.events.getMousePosition(e);
                var pixel = new OpenLayers.Pixel(e.xy.x,e.xy.y);
  				var lonlat = map.getLonLatFromPixel(pixel);
                console.log(Math.round(lonlat.lon), Math.round(lonlat.lat));
            });


		*/		
	

	
	
}

// center map (currently Dublin is hardcoded)
centerMap = function () {	
	
	var centerPoint = new OpenLayers.LonLat(-6.26, 53.35);		// dublin, zoom 11
	centerPoint.transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()); 
	map.setCenter(centerPoint, 15); //11
	
}







