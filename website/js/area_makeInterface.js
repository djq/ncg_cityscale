// global variables for raphael objects
var sl    = new Object();
sl.X  = 20;  // slider x-lim
sl.Y  = 230; // slider y-lim
sl.H  = 20;  // slider height
sl.W  = 150; // slider width
sl.B  = 20;  // slider button width
sl.R  = 3;   // slider corner roundness
sl.op = 1;  // opacity
sl.di = 30; // Distance between sliders
sl.offset = 10; // Offset from left window border

// settings for all buttons and text
var text_options = {font: "14px Arial", fill: "#fff", opacity: 1, "text-anchor": "start"};
var legend_text_options = {font: "10px Arial", fill: "#fff", opacity: 1, "text-anchor": "start"};
var legend_end_options = {font: "11px Arial", fill: "#fff", opacity: 1, "text-anchor": "start"};
var	button_options = {fill: "white", stroke: "none", opacity: 0.5};

// make legend and legend with global scope
var l, legText, text0, text1, text2, text3, text4;

function makeInterface() {

	// Create buttons (define position variables)
	var analyzeX = 10;
	var drawX  = analyzeX + 30;
	var clearX = drawX + 30;


	/**************/	
	// Draw Button
	/**************/
	var rIn = Raphael("sideIn", "100%", "100%");
	
	var textDraw = rIn.text(sl.offset + sl.B*1.5, drawX + sl.B*0.5, "Draw").attr( text_options );
	drawButton = rIn.rect(sl.offset, drawX, sl.B, sl.B, sl.R).attr( button_options );	
	drawButton.click(function (event){
		if(drawButton.attr('opacity') == 0.5){
			drawButton.attr({opacity: 1});
		}
		else{
			drawButton.attr({opacity: 0.5});
		}
		toggleDrawControl();
	});

	/**************/
	// Analyze Button
	/**************/
	var textAnalyze = rIn.text(sl.offset + sl.B*1.5, analyzeX + sl.B*0.5,"Analyze").attr(text_options);
	analyzeButton = rIn.rect(sl.offset, analyzeX, sl.B, sl.B, sl.R).attr(button_options);	
	analyzeButton.click(function (event){

		// Check if drawing is active
		if(drawButton.attr('opacity') == 1){
			alert('Please double-click to finish drawing before analyzing');
		}
		else{
			analyzeButton.animate([{opacity: 1}, {opacity: 0.5}], 500);
			analyze();
			$("#legend").show();	// make legend visible
		}
	});
	
	/**************/
	// Clear Button
	/**************/
	var clear_text = rIn.text(sl.offset + sl.B*1.5, clearX + sl.B*0.5,"Clear").attr(text_options);
	clearButton = rIn.rect(sl.offset, clearX, sl.B, sl.B, sl.R).attr(button_options);
	clearButton.click(function (event){		
		clearButton.animate([{opacity: 1}, {opacity: 0.5}], 500);
		clearAll(true);
	});
	
	/**************/
	// Generate Report button
	/**************/
	
	var rOut = Raphael("sideOut", "100%", "100%");		// Create Canvas
	
	showX=10;
	makeReportText = rOut.text(sl.offset + sl.B*1.5, showX + sl.B*0.5,"Generate report").attr(text_options);
	makeReportButton = rOut.rect(sl.offset, showX, sl.B, sl.B, sl.R).attr({fill: "white", stroke: "none", opacity:0.5});
	makeReportButton.click(function (event){
		makeReportButton.animate([{opacity: 1}, {opacity: 0.5}], 500);
		console.log('generate report');
		makeReport();
	});
		

}

