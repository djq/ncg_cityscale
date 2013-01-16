var coordsPost;
var transformed = false;

// check that user has analyzed seomthing, then make pdf if true
function makeReport(){
	if(returnLayer.features[0] == null && routingLayer.features[0] == null){		// if nothing in layer, tell user
		$(".rep").show();		
		$('#report-text').html('Can\'t generate report,<br>please use "Analyze" button or choose a route');		
		setTimeout(function() {$(".rep").hide()}, 3000);
	}	
	else if(returnLayer.features[0] != null && routingLayer.features[0] == null){	// if area analyzed, make summary report		
		generateSummaryPdf();	
	}	
	else if(returnLayer.features[0] == null && routingLayer.features[0] != null){	// if area analyzed, make routing report		
		generateRoutePdf();	
	}	
}

// make pdf report of area
function generateSummaryPdf(){

	// start spinner to tell user that report is being generated
	var target = document.getElementById('spinner');
	var spinner = new Spinner({color:'#fff', lines: 10, radius: 6}).spin(target);
	$(target).data('spinner', spinner);	
	
	// parse polygon shape into somethign that can be drawn on static map
	if (transformed == false){
		var proj_900913 = new OpenLayers.Projection('EPSG:900913');    
		var proj_4326 = new OpenLayers.Projection('EPSG:4326');
			coordsPost = pointlist;
		for (var i = 0; i < pointlist.length; i++) {
			temp = coordsPost[i].split(" ");
			var point = new OpenLayers.LonLat(parseFloat(temp[0]), parseFloat(temp[1]));
			point.transform(proj_900913, proj_4326);
			coordsPost[i] = point.lat + "," + point.lon;
		}
		coordsPost = coordsPost.join("|");
		transformed = true;
	} 
	
	// user key
	key = '3000'; //temporary value
	//key = qr.dirKey;	

	$.post(	"/v5/php/reports/areaSummary.php", 
			{key:key, pointlist:coordsPost}, 
			function(fileUrl){			
				if(fileUrl != "notFound"){					
					$('#spinner').data('spinner').stop(); //stop spinner					
					$('#report-text').html("Report generated <br><a href='" + fileUrl + "' target='_blank' >download pdf</a>");	// Update text, return link to file
					$('.rep').show(); // show notifying box					
					$('.rep').click(function (event){ $('.rep').hide() });	// Close window when link is clicked
				}
				else{					
					$('#spinner').data('spinner').stop();
					$('.rep').show();				
					$('#report-text').html('Can\'t generate report,<br>please try again');
					setTimeout(function() {$(".rep").hide()}, 3000);				
					
				}
			}			
		);
}

// make pdf report of routing
function generateRoutePdf(){

	// start spinner to tell user that report is being generated
	var target = document.getElementById('spinner');
	var spinner = new Spinner({color:'#fff', lines: 10, radius: 6}).spin(target);
	$(target).data('spinner', spinner);	
		
	// user key
	key = '3000'; //temporary value
	//key = qr.dirKey;	

	$.post(	"/v5/php/reports/routingSummary.php", 
			{key:key, r_id:r_unique}, 
			function(fileUrl){			
				if(fileUrl != "notFound"){					
					$('#spinner').data('spinner').stop(); //stop spinner					
					$('#report-text').html("Report generated <br><a href='" + fileUrl + "' target='_blank' >download pdf</a>");	// Update text, return link to file
					$('.rep').show(); // show notifying box					
					$('#report-text').click(function (event){ $('.rep').hide() });	// Close window when link is clicked
				}
				else{					
					$('#spinner').data('spinner').stop();
					$('.rep').show();				
					$('#report-text').html('Can\'t generate report,<br>please try again');
					setTimeout(function() {$(".rep").hide()}, 3000);				
					
				}
			}			
		);
	
}
