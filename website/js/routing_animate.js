layerTimer = function(count, stop, layer){
    if(stop){                              
            $('#timer_div').html('TIME: ' + (24 - ((count-1) * 6)) + ':00' ) //tidy this up, very messy            
            $("[data-slider]").simpleSlider("setValue", (24 - ((count-1) * 6)));  // move slider here:
            console.log('TIME: ' + (24 - ((count-1) * 6)) + ':00')
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



