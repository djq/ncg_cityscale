// define styles for polygons    
// first time analysis is performed
var white_style = new OpenLayers.Style({
	fillColor: "black",			
	strokeWidth: 3,
	fillOpacity: 0, 
	strokeColor: "green",
	zindex:-10
});

// second time analysis is performed	
var black_style = new OpenLayers.Style({
	fillColor: "white",			
	strokeWidth: 3,
	fillOpacity: 0, 
	strokeColor: "gray",
	zindex:-10
});

// if user wants to see data that is returned
var results_style = new OpenLayers.StyleMap({

"default": new OpenLayers.Style({
	fillColor: "red",			
	strokeWidth: '${width}',
	fillOpacity: 0.2, 
	strokeColor: "red",
	zindex:-10
	}),
"temporary": new OpenLayers.Style({
	fillColor: "gray",			
	strokeWidth: 8,
	fillOpacity: 0.2, 
	strokeColor: "gray",
	zindex:-10
		}),
"select": new OpenLayers.Style({
	fillColor: "blue",			
	strokeWidth: 8,
	fillOpacity: 0.2, 
	strokeColor: "blue",
	zindex:-10
		})

});

var results_old = new OpenLayers.StyleMap({

"default": new OpenLayers.Style({
	fillColor: "gray",			
	strokeWidth: '${width}',
	fillOpacity: 0.2, 
	strokeColor: "gray",
	zindex:-10
	})
});

// style
var startPoint = new OpenLayers.StyleMap({
		"default": new OpenLayers.Style({
			pointRadius: 10, 
			fillColor: "green",
			strokeColor: "#000000",
			fillOpacity: 1,
			strokeWidth: 0
		}),
		"temporary": new OpenLayers.Style({
			pointRadius: 12,
			fillColor: "#00B2EE",
			fillOpacity: 0.5,
			strokeColor: "#red"
		}),
		"selected": new OpenLayers.Style({
			pointRadius: 10,
			fillColor: "blue",
			fillOpacity: 0.6,                    
			strokeColor: "red"
		})
});

var endPoint = new OpenLayers.StyleMap({
		"default": new OpenLayers.Style({
			pointRadius: 10, 
			fillColor: "red",
			strokeColor: "#000000",
			fillOpacity: 1,
			strokeWidth: 0
		}),
		"temporary": new OpenLayers.Style({
			pointRadius: 12,
			fillColor: "#00B2EE",
			fillOpacity: 0.5,
			strokeColor: "#red"
		}),
		"selected": new OpenLayers.Style({
			pointRadius: 10,
			fillColor: "blue",
			fillOpacity: 0.6,                    
			strokeColor: "red"
		})
});

var routing_style = new OpenLayers.StyleMap({
		"default": new OpenLayers.Style({
	fillColor: "red",			
	strokeWidth: '${width}',
	fillOpacity: 0.2, 
	strokeColor: "red",
	zindex:-10
	}),
"temporary": new OpenLayers.Style({
	fillColor: "gray",			
	strokeWidth: 8,
	fillOpacity: 0.2, 
	strokeColor: "gray",
	zindex:-10
		}),
"select": new OpenLayers.Style({
	fillColor: "blue",			
	strokeWidth: 8,
	fillOpacity: 0.2, 
	strokeColor: "blue",
	zindex:-10
		})
});


