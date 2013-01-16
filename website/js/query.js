var counter;
var count;

// Choose which function to use for searching
function analyze(){	

	var dataChoice;

	// Remove previous vector layers
	if(returnLayer.features[0] != null){ 
		oldReturnLayer.addFeatures(returnLayer.features[0]);
		oldReturnLayer.redraw({force:true});
		returnLayer.removeAllFeatures();
	}
	
	// Get normalization value - this is done by checking color of 'showRawDataButton' button	
	var normalization = parseInt( $("input:radio[name=radio_norm]").val() ); //get radio value	
	//console.log('Normalization: ' + normalization);

	// Check for hand drawn polygons, make central otherwise
	if(map.getControl('userPolygon').drawn){
		// Reset drawing feature
		map.getControl('userPolygon').drawn = false;
		setTimeout('$(".tag").css({"display":"block"});', 6000);
	}
	else{
		// Update style
		setStyle(clickNumber, currentLayer, oldLayer);
		pushLayers();					
		makeCentralPolygon();	// Create polygon
	}	
	
	pointlist = []								// Clear pointlist before calling next querry
	spatialQuery(currentLayer, normalization);	// Call spatial query
	clickNumber += 1							// keep track of what colour to make things
	
	
}

// Function to create querry polygon from windows extent
function makeCentralPolygon(){

	// Get map info based on current location
	bounds = map.getExtent();

	// Scale the window extent to the central part	
	var size = 0.3;
	var lngSpan = (bounds.left - bounds.right) * size;
	var latSpan = (bounds.top -  bounds.bottom) * size;
	
	// Create new bounds
	var newBounds = bounds
	newBounds.left = bounds.left - lngSpan
	newBounds.bottom = bounds.bottom + latSpan
	newBounds.right = bounds.right  + lngSpan
	newBounds.top = bounds.top - latSpan

	// Create the polygon
	var tagBox = new OpenLayers.Feature.Vector(newBounds.toGeometry());	
	currentLayer.addFeatures(tagBox);
}

// remove all layers and chart data
function clearAll(removePoints){

	
	pointlist = [];					// Clear data point list
	//r_unique = null;				// reset unique id

	// Remove features
	if(currentLayer.features[0] != null){	currentLayer.removeAllFeatures();	}	
	if(oldLayer.features[0] != null){		oldLayer.removeAllFeatures();		}
	if(returnLayer.features[0] != null){ 	returnLayer.removeAllFeatures();	}	
	if(routingLayer.features[0] != null){ 	routingLayer.removeAllFeatures();	}	
	
	if(removePoints){
		if(pointStart.features[0] != null){ pointStart.removeAllFeatures();	}		
		if(pointEnd.features[0] != null){ 	pointEnd.removeAllFeatures();	}
	}
			
	// Reset drawing setup, memory & show tags
	drawButton.attr({opacity:0.5});
	map.getControl('userPolygon').deactivate();
	map.getControl('userPolygon').drawn = false;
	$(".tag").css({"display":"block"});

	// Hide legend
	$('#legend').hide();

	// clear charts
	chart1.series[0].setData([0,0,0,0,0]);		
	chart2.series[0].setData([0,0,0,0,0]);	
	chart3.series[0].setData([0,0]);

	
	clickNumber = 1;					// Reset click counter	
	$('#drawingInstructions').hide();	// Hide drawing instructions	
	poly = 'a';							// reset poly (sorry daniel - I will make this better....)	
	$('#timer_div').html('TIME: ')		// reset timer
	
}

// Create toggle control function for 'draw' button
function toggleDrawControl() {

	// when drawButton clicked, activate drawing control
	if(drawButton.attr('opacity') == 1){

		// Check if there is an unanalyzed drawing, remove it
		if(map.getControl('userPolygon').drawn){
			currentLayer.removeAllFeatures();
		}
		else{ // If there is no previous drawing, push and set drawing style
			setStyle();
			pushLayers();
		}			
		
		$(".tag").css({"display":"none"});			// Hide tags		
		map.getControl('userPolygon').activate();	// Activate drawing		
		$('#drawingInstructions').show();			// Show instructions
		
	}	
	else{	// If drawing button unclicked, reset all drawing features		
		$(".tag").css({"display":"block"});			// Show tags		
		map.getControl('userPolygon').deactivate();	// Deactivate drawing		
		$('#drawingInstructions').hide();			// Hide instructions
	}      
}

// Push layer to older version and set layer color
function pushLayers(){	
	if(oldLayer.features[0] != null){ oldLayer.removeAllFeatures();	}
	if(currentLayer.features[0] != null){
		oldLayer.features  = currentLayer.features 	// old layer is set to current
		currentLayer.removeAllFeatures();			// remove all features from current layer
		oldLayer.redraw();
	}
} 

// sets the styles for current and old analysis layers and chart colours
function setStyle(){
	if(clickNumber % 2 == 0){
		console.log('This is an even click -> black!')		
		// Layer colors
		currentLayer.styleMap = b_style;
		oldLayer.styleMap = w_style;
		// Chart colors
		col1 = '#DBD8D8';			// white
		col2 = '#363434';			// black - also tried this #808080
		col1_borderColor = '#7B7B7B';
		col2_borderColor = '#BDBDBD';
	}
	else{
		console.log('This is an odd click -> white!')				
		// Layer colors
		currentLayer.styleMap = w_style;
		oldLayer.styleMap = b_style;		
		// Chart colors
		col1 = '#363434';			// black	
		col2 = '#DBD8D8';			// white
		col1_borderColor = '#BDBDBD';
		col2_borderColor = '#7B7B7B';
	}
}

// Function to query database using using polygon
var pointlist = [];
var poly = 'a';
var mapZoom;

function spatialQuery(layer){
	
	//var pointlist = [], xarray = [], yarray = [];
	var xarray = [], yarray = [];	
	var polyBounds = Object;	// get bounding box of polygon (can be any shape)
	
	if(currentLayer.features[0] != null){
		var vertices = layer.features[0].geometry.getVertices();	// Get vertices from first polygon (index == 0)													
		for (var i = 0; i < vertices.length; i++) {			        // Iterate through vertices and create list of strings
				pointlist.push(vertices[i].x.toString() + ' ' + vertices[i].y.toString());     
				xarray.push(vertices[i].x);
				yarray.push(vertices[i].y);
			}		
		pointlist.push(vertices[0].x.toString() + ' ' + vertices[0].y.toString());		// Duplicate first vertex at the end	
		var mapPix = map.getResolution()
		
		polyBounds.left   = (Math.min.apply(0,xarray) + mapPix) | 0 ; // subtract one pixel, round down
		polyBounds.right  = (Math.max.apply(0,xarray) - mapPix) | 0 ;
		polyBounds.top    = (Math.max.apply(0,yarray) - mapPix) | 0 ;
		polyBounds.bottom = (Math.min.apply(0,yarray) + mapPix) | 0 ;
		poly = polyBounds // set tmp global variable so user can switch heatmaps
	
		phpQuery = "php/analysis/general_query.php"      														
		query(pointlist, phpQuery);	   
		var radioVal = parseInt($("input:radio[name=radio_heat]:checked").val())					
		transformed = false;	// keep track of whether points have been converted into long.lat for google query
		
	}
	else{		
		// return message to user if no polygon (should not happen normally)
		alert('No polygon found, query failed');
	}
}

// run spatial query on DB
function query(dataList, phpQuery){
			
	mapZoom = map.getZoom();
	norm = parseInt($("input:radio[name=radio_norm]:checked").val());
	
	$.ajax({ 
		type: "POST",
		url: phpQuery,  
		data:{zoom: mapZoom, vertices: dataList},  
		async: true,
		success: function(result){
					qr = result;				// put results in global scope (this should be tidied up)	
					
					// run timer
					callTimer(returnLayer); // times are hardcoded into function	
							
					if(returnLayer.features[0] != null){ returnLayer.removeAllFeatures(); }
					
					// draw polygons on screen
					if(qr.polygons != null){	// process geojson
						for(i=0;i<qr.polygons.length; i++){		
								t = [qr.t1[i], qr.t2[i], qr.t3[i], qr.t4[i], qr.t5[i]];					
								showGeoJson(qr.polygons[i], t, returnLayer);
								
						}		
					}								
					updateAvgCharts(result);			// Update chart values
					returnLayer.setVisibility(false);	// hide visibility
		}, 
	dataType:'json'
	});				
}		

// Create layer from geoJson polygon and load to screen
showGeoJson = function(geoJsonArray, t, layer){
	
	geoJsonArray = eval('[' + geoJsonArray + ']');        
		
	var featurecollection = {
          "type": "FeatureCollection", 
          "features": [
            {"geometry": {
							"type": "GeometryCollection", 
							"geometries": geoJsonArray
		             	}, 
            "type": "Feature", 
            "properties": {
				width: t[0], vol: [eval(t[0]), eval(t[1]), eval(t[2]), eval(t[3]), eval(t[4])]			
            }
         }] 
       };
     
	var geojson_format = new OpenLayers.Format.GeoJSON();
	layer.addFeatures(geojson_format.read(featurecollection));
}


// update highcharts with values from DB query
function updateAvgCharts(result){	

		// store old values			
		//oldRes.avg_traffic = chart1.series[0].data[0].y;				
		//oldRes.pop_dens   = chart3.series[0].data[0].y;	
	
		// update charts		
		chart1.series[0].setData(result.avg);	// avg traffic		
			
		// population
		/*
		chart3.series[0].setData([	{color: col1, borderColor: col1_borderColor, name: 'pop_density', 		y: result.pop_dens},
									{color: col2, borderColor: col2_borderColor, name: 'pop_density', 		y: oldRes.pop_dens}]);
		*/
}


// update highcharts with values from DB query
function updateSelectedCharts(result){	

		// store old values	
		oldRes.sel_traffic = chart2.series[0].data[0].y;
		
		//energy										
		chart2.series[0].setData(result);
	
}









