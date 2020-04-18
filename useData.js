//Listens for messages from the content.js file
//The message will attach the array of latitudes and longitudes which we will use
//to the extract the street views and speed limits
window.addEventListener('message', event => {
    // Check the origin of message
    // Should only be sent from strava's domain after pressing a 'Course Preview' button
    if (event.origin.startsWith('https://www.strava.com')) {
        // The data was sent from strava
        var global_div = document.getElementsByClassName('slideshow-container');
        // Latitudes and longitudes stored in event.data
        executeDisplay(event.data);
    } else {
      //Unknown and uncleared site - return and do nothing
        return;
    }
});

//Get the speed limits based on the latitude and longitude pairs given
//Make a Google Street View div for every latitude and longitude pair given
function executeDisplay(list_lats_longs){
  //Suggestion: API for Google StreetView
  getStreetViews(list_lats_longs);
}


//Takes in a list of the "lat" and "lng" objects and calls the Google Street View API on the objects
//Returns and puts a view of the street in a div
//All the street view divs are appended as children to another div
//Return the name of the class that stores the street view divs
function getStreetViews(list_lats_longs){
  var global_div = document.getElementsByClassName('slideshow-container');
  for (let i = 0; i < list_lats_longs.length; i++){
    //Reformats the array of latitude and longitude pairs to fit the format for Google Speed View
    // i.e. convert every pair to an object {lat:####,lng:####}
    let current_lat_lng_pair = {lat:list_lats_longs[i][[0]],lng:list_lats_longs[i][[1]]}
    //Create a div location to store the Google Street View Info
    var current_div = document.createElement("div");
    var id_name = "slidestreet" + i;
    current_div.setAttribute("class","course_preview_slideshow");
    current_div.setAttribute("id",id_name);
    //FINAL_LOCATION will be the div that stores all the divs returned from the Google Street View
    //var global_div = document.getElementsByClassName('slideshow-container');
    global_div[0].appendChild(current_div);
    //Calls the Google Street View and puts the info in the div
    //Google Street View API takes in a latitude and longitude --> returns a div for every request
    // new google.maps.StreetViewPanorama(
    //   current_div, {
    //     position: current_lat_lng_pair,
    //     pov: {
    //       heading: 165,
    //       pitch: 1
    //     }
    //   });
    }
    ///All the Google Street View divs CAN BE RETREIVED BY CALLING
    //  EX: ---> let slides = document.getElementsByClassName("slideshow-container");
    return 'slideshow-container';
  }
