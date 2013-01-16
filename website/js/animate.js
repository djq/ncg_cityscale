l = ['qr.t5', 'qr.t4', 'qr.t3', 'qr.t2', 'qr.t1']
var stop=true;
//step = [100, 177, 151, 125, 98, 72];
//step = [78, 103, 127, 153, 177]

step = [177, 151, 125, 99, 73]
//r_step = step.reverse();

updateLayer = function(x, layer){
    for(i =0; i < layer.features.length; i++){
        layer.features[i].attributes.width = x[i];   
    };
    layer.redraw({force:true});
}


layerTimer = function(count, stop, layer){
    if(stop){
          
          layer.setVisibility(true)

            //console.log('counter: ' + count + ' renderer: ' + step[count -1])
            updateLayer(eval(l[count-1]), layer)
            console.log(layer.name)
            
            $('#timer_div').html('TIME: ' + (24 - ((count-1) * 6)) + ':00' ) //tidy this up, very messy
            
            // now move counter along graph:
            $("#chart1").remove();
        	var rendererChart1 = chart1.renderer;	
            rendererChart1.path(['M', step[count -1], 40, 'L', step[count - 1], 95])
                .attr({
                    'stroke-width': 2,
                    stroke: 'white',
                    id :'chart1'
                })
                .add();
                
            $("#chart2").remove();
        	var rendererChart2 = chart2.renderer;	
            rendererChart2.path(['M', step[count -1], 40, 'L', step[count-1], 95])
                .attr({
                    'stroke-width': 2,
                    stroke: 'white',
                    id :'chart2'
                })
                .add();
      }
}

// using the system clock for more accurate timing based on this approach
// http://www.sitepoint.com/creating-accurate-timers-in-javascript/
// there are some limitations to it though
function doTimer(oninstance, oncomplete)
{
    var steps = 5,
        speed = 1000,
        count = 0,
        start = new Date().getTime();

    function instance()
    {
        if(count++ == steps)
        {
            oncomplete(steps, count);
        }
        else
        {
            oninstance(steps, count);
            var diff = (new Date().getTime() - start) - (count * speed);
            window.setTimeout(instance, (speed - diff));
        }
    }
    window.setTimeout(instance, speed);
}

// use timer linked to system clock for more accurate display
callTimer = function(layer){
      var timeBlock = 6;
      doTimer(function(steps)
      {          
          timeBlock += -1;
          console.log(timeBlock);
          layerTimer(timeBlock, stop, layer);
      },
      function()
      {
          console.log('finished');
      });
}

/*
map.layers[0].setVisibility(false)
map.layers[1].setVisibility(false)
map.layers[2].setVisibility(false)
map.layers[3].setVisibility(false)
*/

callTimerWMS = function(){
      var timeBlock = 6;
      doTimer(function(steps)
      {          
          timeBlock += -1;
          console.log(timeBlock);
          layerTimer(timeBlock, stop);
      },
      function()
      {
          console.log('finished');
      });
}

