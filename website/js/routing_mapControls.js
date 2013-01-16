function mapControls() {

	////////////////////////////
	/// Define drawing control
	////////////////////////////
	var userPolygon = new OpenLayers.Control.DrawFeature( currentLayer, OpenLayers.Handler.Polygon, {
		eventListeners:{"featureadded":
		function newPolygonDrawn(evt) {
				map.getControl('userPolygon').deactivate();		// Finish drawing polygon
				map.getControl('userPolygon').drawn = true;		// Remember polygon was drawn
				drawButton.attr({opacity: 0.5});				// Unselect draw button
				$('#drawingInstructions').hide();				// Hide drawing instructions
				analyze();
			}
		},
		"id":"userPolygon",
		"drawn":false
	});
	map.addControl(userPolygon);
	
	/* TODO - update help functionality.....
	// Set up drawing help div
	var r = Raphael("drawingInstructions", "100%", "100%");
	r.rect(0, 0, "100%", "100%").attr({fill:"black", stroke:"none", opacity:0.6});
	$('#drawingInstructions-text').html('Single click to add a point<p>Double click to finish drawing</p>');
	$('#drawingInstructions').hide();
	*/
	
	////////////////////////////
	/// Set up pan/zoom/help
	////////////////////////////
	var r = Raphael("controls", "100%", "100%");	

	var voffset = 20;
	var hoffset = 20;
	
	var control_text_options = {font: "14px Fontin-Sans, Arial", fill: "#fff", opacity: 1, "text-anchor": "center"}		
		
	// North
	r.text(sl.B/2 + hoffset, sl.B/2,"N").attr(control_text_options);
	north = r.rect(0 + hoffset, 0, sl.B, sl.B, sl.R).attr(button_options);
	north.click(function (event){
		north.animate([{opacity: 1}, {opacity: 0.5}], 500);
		map.pan(0,-50);
	});
	
	// South
	r.text(sl.B/2 + hoffset, sl.B/2 + voffset,"S").attr(control_text_options);
	south = r.rect(0 + hoffset, 0 + voffset, sl.B, sl.B, sl.R).attr(button_options);
	south.click(function (event){
		south.animate([{opacity: 1}, {opacity: 0.5}], 500);
		map.pan(0,50);
	});
	
	// East
	r.text(2*sl.B + sl.B/2, sl.B/2 + voffset/2,"E").attr(control_text_options);
	east = r.rect(2*sl.B, 0 + voffset/2, sl.B, sl.B, sl.R).attr(button_options);
	east.click(function (event){
		east.animate([{opacity: 1}, {opacity: 0.5}], 500);
		map.pan(50,0);
	});
	
	// West
	r.text(hoffset/2, sl.B/2 + voffset/2,"W").attr(control_text_options);
	west = r.rect(0, voffset/2, sl.B, sl.B, sl.R).attr(button_options);
	west.click(function (event){
		west.animate([{opacity: 1}, {opacity: 0.5}], 500);
		map.pan(-50,0);
	});
	
	// +
	r.text(4*sl.B + sl.B/2, sl.B/2 + voffset/2,"+").attr(control_text_options);
	plus = r.rect(4*sl.B, 0 + voffset/2, sl.B, sl.B, sl.R).attr(button_options);
	plus.click(function (event){
		plus.animate([{opacity: 1}, {opacity: 0.5}], 500);
		map.zoomIn();
	});
	
	// -
	r.text(5*sl.B + sl.B/2, sl.B/2 + voffset/2,"-").attr(control_text_options);
	minus = r.rect(5*sl.B, 0 + voffset/2, sl.B, sl.B, sl.R).attr(button_options);
	minus.click(function (event){
		minus.animate([{opacity: 1}, {opacity: 0.5}], 500);
		map.zoomOut();
	});
		
}