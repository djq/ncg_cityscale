// global vars of charts
var chart1,chart2,chart3; 

// Set chart options borderRadius
Highcharts.setOptions({
    chart: { backgroundColor: "rgba(0,0,0,0.9)", borderRadius:"0" },
    plotOptions:{ column:{ stacking: 'normal'},				  
    			  series:{ borderWidth: 2,	// this conceals the problem that I was having, but does not solve it    			  		   
    			  		   states:{ hover:{enabled: false} }	
    		  			  }
    			},
    colors: [ col1, col2],    
    legend: {enabled: false},
	credits: {enabled: false},	
	tooltip: { formatter: function() {return ''+ this.series.name +': '+ this.y +'';}}	
	});
	
//useHTML: true

// Initialize charts
function createCharts(){
	chart1 = new Highcharts.Chart({
		chart: {	renderTo: 'chart-1'	,  type: 'line'},
		title: {    text: 'Average Volume', style:{color:'#FFFFFF'}},
		xAxis: {	categories: ['00', '06', '12', '18', '24']	},
		yAxis: {   	title: {style: {color: '#FFFFFF'},
					text: 'Veh. per Hour'		},  				
					min: 0 ,
					max: 10,
					tickInterval: 5	
					},
		series: [{name: 'avg_traffic',      data: [0, 0, 0 , 0, 0], color: 'red'}]}
		/*,function(chart){    
        var renderer = chart.renderer;
    renderer.path(['M', 80, 40, 'L', 80, 95])
        .attr({
            'stroke-width': 2,
            stroke: 'red',
            id :'myPath'
        })
        .add();
            
            }*/
);
		
		
	chart2 = new Highcharts.Chart({
		chart: {	renderTo: 'chart-2', type: 'line'	},
		title: {    text: 'Selected Road', style:{color:'#FFFFFF'}},
		xAxis: {	categories: ['00', '06', '12', '18', '24']	},
		yAxis: {   	title: {style: {color: '#FFFFFF'},
					text: 'Veh. per Hour' 				},	
					min: 0 , max: 10,
					tickInterval: 5
						},
		series: [{	name: 'traffic', data: [0, 0, 0 , 0, 0], color: 'blue' } ]
				 });     

	chart3 = new Highcharts.Chart({
		chart: { 	renderTo: 'chart-3' , type: 'column'},
		title: {    text: 'Population Density', style:{color:'#FFFFFF'}},
		xAxis: { 	categories: ['curr.', 'prev.']	},
		yAxis: { 	title: { 
						style: { color: '#FFFFFF' 	},
						text: 'pop/km2' 			},						
					min: 0, 
					max: 40000,
					tickInterval: 20000
					//minorTickInterval: 5000,
					//minorTickColor: '#34282C'
					},
		series: [{	name: 'density', data: [0, 0]}]
		});
}


