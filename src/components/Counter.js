import React from 'react';

const Counter = () => {

   
    // Lets also clearly name our things. 
    let time = [10,10,10];
    let interval = null;
  
    const event_click = ( event ) => {
        
        // If our interval is null, we need to start the counter
        // And also change the innerText so its obvious what the button will do next
        
        if( interval === null ){
        
        start();
        event.target.innerText = 'pause';
        
        } else {
        
        pause();
        event.target.innerText = 'start';
        
        }
        
    };
    
    const start = () => {
        
        // First use pause() to be sure all intervals are cleared
        // it prevents them from doubling up
        
        pause();
        interval = setInterval( count, 1000 );          

    };


    const pause = () => {
    
        clearInterval( interval );
        interval = null;
        
    };


    const count = () => {
        
        // By doing this before declaring your variables
        // you make it so the variables actually hold the new calculated values.
        
        time[2]--;
        
        if( time[2] == -1 ){
        
            time[1]--;
            time[2] = 59;
        
        }
        
        // Lets use some cool new syntax here to reduce the amount of code needed
        // this will destructure an array assigning their indexed values to the index of the variable
        
        var [ hours, minutes, seconds ] = time;
    
        if( seconds == 0 && minutes == 0 && hours == 0 ){        
            clearInterval( interval );        
        }
        
        // We always want to print something, and if the values are 0
        // the output is still the same, so lets seperate that.
        
        if (seconds < 10) {
        
            document.getElementById('demo').innerHTML = hours + ": " + minutes + ": " + "0" + seconds + " ";
        
        } else {
        
            document.getElementById('demo').innerHTML = hours + ": " + minutes + ": " + seconds + " ";
        
        }
        
    };
        
    return (
        <div>
            <button id="toggle" onClick={event_click()}>start</button>
            <div id="demo"></div>
        </div>
    );
};

export default Counter;