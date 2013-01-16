var start_point, end_point;
var x1, y1, x2,y2, _x, _y;
var lineLayer, ayerayer, pointStart, start, pointEnd, end;
var geocoder;
var tmp_global = 0;	
var routeDemand = false;	
var t1,t2,t3,t4;

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
		//mapControls();			// Map controls 
		//makeInterface();		// Interface			
		//tableHover();		
		
		$('#report').hide();					
		geocoder = new google.maps.Geocoder();	// google function (limit of 15000 per day) but also rate-limited per time           
        
        // Handle user input from keyboard
		$(".text").keyup(function(event){
		   if(event.keyCode == 13){
			   codeAddress();		
		   }
	   }); 	   
				   
		// clear box on focus		
		$('.text').focus(function() {				
			$(this).val('')
				}).blur(function() {
			if (this.value == "") {
				$(this).val(this.title);
			}
		}); 		

		// when text is updated, re-geocode and re-route
		/*$('.text').blur(function() {					
			codeAddress();									
		})		*/	
			
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
 

	var address = $("#address_end").val()  //+ ', co. dublin, Ireland';
		console.log(address);
		geocoder.geocode( { 'address': address, 'region': 'IE'}, function(results2, status) {
			if (status == google.maps.GeocoderStatus.OK) {
		
				x2 = results2[0].geometry.location.lat();
				y2 = results2[0].geometry.location.lng();				
				console.log('End Point - x2:', x2, ' y2: ', y2);					
				
				start_point = new OpenLayers.Geometry.Point(y1, x1);
				end_point = new OpenLayers.Geometry.Point(y2, x2);

				if(pointStart.features[0] != null){ pointStart.removeAllFeatures();	}		
				if(pointEnd.features[0] != null){ 	pointEnd.removeAllFeatures();	}

				start = new OpenLayers.Feature.Vector(start_point.transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()));	
				end = new OpenLayers.Feature.Vector(end_point.transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()));	
				pointStart.addFeatures([start]);
				pointEnd.addFeatures([end]);			
												
				_y = (y1 + y2)/2;	// get avg between point1 and point2 
				_x = (x1 + x2)/2;					
				var centerPoint = new OpenLayers.LonLat(_y, _x);	       				
				centerPoint.transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()); 
				map.setCenter(centerPoint, 12); 	

				performRouting();
							
			} 
			else {			
				console.log("Geocode end address was not successful. Reason: " + status);
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

// before performing routing, check that user has entered start/end addresses
// and that geocoding was succesfully performed
performRouting = function(){

	// check that boxes have addresses in them
	if($('#address_start').val() != '' && $('#address_start').val() != 'start' && $('#address_end').val() != '' && $('#address_end').val() != 'end'){			

		// also check x/y are ok
		if(x1 != undefined && y1 != undefined && y2 != undefined && x2 != undefined){
			getRoute();	
		}
		else{
			console.log('Function performRouting: problem geocoding address');
		}
	}
	else{
		console.log('please enter a start/end address');			
	}	
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
			//maxResolution: 15654.0339,
			//maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
			displayProjection: proj_900913,			
			controls: [		//remove controls from the screen
				new OpenLayers.Control.Navigation(),
				new OpenLayers.Control.ArgParser(),
				new OpenLayers.Control.Attribution()
			]
		};		
					
		//map = new OpenLayers.Map("basicMap", options);
		map = new OpenLayers.Map("basicMap", options);

		// Use OSM
		osm = new OpenLayers.Layer.OSM();			
		map.addLayer(osm);				

		// using stamen
		//var layer = new OpenLayers.Layer.Stamen("toner");			
		//map.addLayer(layer);
	
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

		r1 = new OpenLayers.Layer.Vector("r1", {styleMap:routing_style});		// routing layers
		r2 = new OpenLayers.Layer.Vector("r2", {styleMap:routing_style});	
		r3 = new OpenLayers.Layer.Vector("r3", {styleMap:routing_style});	
		r4 = new OpenLayers.Layer.Vector("r4", {styleMap:routing_style});
		r5 = new OpenLayers.Layer.Vector("r5", {styleMap:routing_style});	
		r6 = new OpenLayers.Layer.Vector("r6", {styleMap:routing_style});		

		map.addLayers([r1, r2, r3, r4, r5, r6]);	
		centerMap()		// center map on Ireland

		r1.setVisibility(true);
		r2.setVisibility(false);	
		r3.setVisibility(false);	
		r4.setVisibility(false);	
		r5.setVisibility(false);	
		//r6.setVisibility(false);	

	// handle mouse interactions
	var highlightCtrl = new OpenLayers.Control.SelectFeature(returnLayer, {
		hover: true,	
		clickout: true,
		highlightOnly: true,	
		//overFeature: function(e) { updateSelectedCharts(e.data.vol); console.log(e); tmp_global = e; e.attributes.width = 40; returnLayer.redraw({force:true});	},	
		onSelect: function(e) { updateSelectedCharts(e.feature.data.vol); },	
		renderIntent: "temporary"
	});

	map.addControl(highlightCtrl);
	highlightCtrl.activate();
	
	       selectControl = new OpenLayers.Control.SelectFeature(
                [returnLayer, pointStart, pointEnd],
                {   hover: true,
                    clickout: true, toggle: false,
                    multiple: false, hover: false,
                    toggleKey: "ctrlKey", // ctrl key removes from selection
                    multipleKey: "shiftKey" // shift key adds to selection
                }
            );
            
            map.addControl(selectControl);
            selectControl.activate();       
            
            returnLayer.events.on({
                "featureselected": function(e) {
                    updateSelectedCharts(e.feature.data.vol);                    
                    console.log(e)
                },
                "featureunselected": function(e) {
                    //console.log(e)
                }
            });
            /*
            pointStart.events.on({
                "featureselected": function(e) {
                    showStatus("selected feature "+e.feature.id+" on Vector Layer 2");
                },
                "featureunselected": function(e) {
                    showStatus("unselected feature "+e.feature.id+" on Vector Layer 2");
                }
            });*/

            // Make points dragable	
	dragStart = new OpenLayers.Control.DragFeature(pointStart, {
    	autoActivate: true,
    	onComplete: function(e) {updateStartPoint(e);}
							});	
	
	dragEnd = new OpenLayers.Control.DragFeature(pointEnd, {
									autoActivate: true,
									onComplete: function(e) {updateEndPoint(e);}  			
                			});	
						
						
	updateStartPoint = function(point){
		//console.log(point);		 
		y1 = point.geometry.transform( map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326")).x
		x1 = point.geometry.y
		codeLatLng(x1, y1, 'start');  
		getRoute();
		// change point back to original coordinates (this is a terrible hack)
		point.geometry.transform(new OpenLayers.Projection("EPSG:4326"),  map.getProjectionObject())		
	}
	
	updateEndPoint = function(point){
		//console.log(point);		    
		y2 = point.geometry.transform( map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326")).x
		x2 = point.geometry.y
		codeLatLng(x2, y2, 'end'); 
		getRoute();
		// change point back to original coordinates (this is a terrible hack)
		point.geometry.transform(new OpenLayers.Projection("EPSG:4326"),  map.getProjectionObject())		
	}
	
	map.addControls([dragStart, dragEnd]);	 	 	
	dragEnd.activate();
	dragStart.activate();

//	$("[data-slider]").simpleSlider("setValue", 0); 

	/* handle sliding*/	
	$("[data-slider]")
/*	    .bind("slider:ready slider:changed", function (event, data) {	  
	          var val = data.value.toFixed(0);	  
	          //$('#slider_output').html(val);        
	          if(val == 0){	          	
	          	$('#timer_div').html('TIME: ' + val + ':00' )
	          	r1.setVisibility(true);
				r2.setVisibility(false);	
				r3.setVisibility(false);	
				r4.setVisibility(false);	
				r5.setVisibility(false);									
	          }
	          if(val == 6){
	          	$('#timer_div').html('TIME: ' + val + ':00' )
	          	r1.setVisibility(false);
				r2.setVisibility(true);	
				r3.setVisibility(false);	
				r4.setVisibility(false);	
				r5.setVisibility(false);							
	          }	         
	          if(val == 12){
	          	$('#timer_div').html('TIME: ' + val + ':00' )
	          	r1.setVisibility(false);
				r2.setVisibility(false);	
				r3.setVisibility(true);	
				r4.setVisibility(false);	
				r5.setVisibility(false);								
	          }
	          if(val == 18){
	          	$('#timer_div').html('TIME: ' + val + ':00' )
	          	r1.setVisibility(false);
				r2.setVisibility(false);	
				r3.setVisibility(false);	
				r4.setVisibility(true);	
				r5.setVisibility(false);		
							
	          }	         
	          if(val == 24){
	          	$('#timer_div').html('TIME: ' + val + ':00' )
	          	r1.setVisibility(false);
				r2.setVisibility(false);	
				r3.setVisibility(false);	
				r4.setVisibility(false);	
				r5.setVisibility(true);						
	          }
	    }); 
	*/
}

// center map (currently Dublin is hardcoded)
centerMap = function () {	
	
	var centerPoint = new OpenLayers.LonLat(-6.26, 53.35);		// dublin, zoom 11
	centerPoint.transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()); 
	map.setCenter(centerPoint, 15); //11
	
}

getRoute = function (){	

	routeDemand = true;
	r_unique = Math.floor(Math.random()* 100000);

	if(routeDemand){
		$.ajax({ 
				type: "POST",
				url: "php/analysis/routing_id.php",       
				data:{x1: x1, y1:y1, x2: x2, y2:y2, r_id:r_unique, start_ad: $("#address_start").val(), end_ad: $("#address_end").val()}, 
				async: true,
				success: function(r){													

					getRoutes(r.r_id, r.start_id, r.end_id, 't2', r2); 					
					getRoutes(r.r_id, r.start_id, r.end_id, 't3', r3); 
					getRoutes(r.r_id, r.start_id, r.end_id, 't4', r4);
					getRoutes(r.r_id, r.start_id, r.end_id, 't5', r5);  
					//getRoutes(r.r_id, r.start_id, r.end_id, 't6', r6);  					

					clearAll(false);				// get rid of everything, aside from start/end points																										
					callTimer(r1);		// run timer				

					if(r1.features[0] != null){ r1.removeAllFeatures(); }
					
					// draw route on screen
					if(r.roads != null){	// process geojson
						for(i=0;i<r.roads.length; i++){		
								t = [r.t1[i], r.t2[i], r.t3[i], r.t4[i], r.t5[i]];					
								showGeoJson(r.roads[i], t, r1);									
						}		
					}													
					//r1.setVisibility(false);	// hide visibility						
				}, 
			dataType:'json'
			});		
	}	

}

getRoutes = function(r_id, start_id, end_id, cost, layer){

	$.ajax({ 
		type: "POST",
		url: "php/analysis/routing_with_id.php",       
		data:{r_id:r_id, start_id: start_id, end_id: end_id, cost:cost}, 
		async: true,
		success: function(r){		

			if(r.roads != null){	
						for(i=0;i<r.roads.length; i++){														
								showGeoJsonRoutes(r.roads[i], layer);									
						}		
					}																						
		
		}, 
	dataType:'json'
	});	

}






