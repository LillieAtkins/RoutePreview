let slideIndex = 0;
let speedIndex = 0;
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
  //Resets slideshow back to first screen
  slideIndex = 0;
  speedIndex = 0;
  //get the speed limits
  var speedlims = getSpeedLimits(list_lats_longs);
  //make the slideshow with street views and speedlimtits
  makePreview(list_lats_longs, speedlims);

}

//get the speed limits which takes in the list of latitudes and longitudes
function getSpeedLimits(list_lats_longs) {
  let path;
  let info;

  let stop = Math.ceil(list_lats_longs.length/100);

  list_lats_longs_copy = list_lats_longs.slice();

  let speedlimit = "";
  //THIS IS FOR WHEN WE HAVE THE GOOGLE API AS WE CAN ONLY CALL SPEEDLIMITS IN BATCHES OF 100
  // if(stop > 1) {
  //   for(let i = 0; i < stop; i++) {
  //     path = list_lats_longs_copy[0];
  //     for (let i = 1; i < 100; i++){
  //       path += "|" + list_lats_longs_copy[i]; //create the parameters to send google maps
  //     }
  //
  //     //can only fetch 100 at a time
  //     info = fetch(`https://roads.googleapis.com/v1/speedLimits?path=${path}&key=AIzaSyBX779m3-lWL6JONrBososCVSySr3rPsJM`).then( response => {
  //       if (!response.ok) { throw response }
  //       return response.json()  //we only get here if there is no error
  //     })
  //     .catch( err => {
  //       console.log(err);
  //     })
  //
  //     for(let j = 0; j < info.length; j++) {
  //       speedlimits += info[0]['speedLimits'];
  //     }
  //     list_lats_longs_copy = list_lats_longs_copy.splice(0, 100);
  //
  //   }
  // }


//this is for the sample data can delete when using the api
  info = [{
    speedLimits:
    [
      {
        placeId: "ChIJX12duJAwGQ0Ra0d4Oi4jOGE",
        speedLimit: 105,
        units: "KPH"
      },
      {
        placeId: "ChIJLQcticc0GQ0RoiNZJVa5GxU",
        speedLimit: 70,
        units: "KPH"
      },
      {
        placeId: "ChIJJ4vQRudkJA0RpednU70A-5M",
        speedLimit: 55,
        units: "KPH"
      }
    ],
    snappedPoints:
    [
      {
        location:
        {
          latitude: 38.75807927603043,
          longitude: -9.037417546438084
        },
        originalIndex: 0,
        placeId: "ChIJX12duJAwGQ0Ra0d4Oi4jOGE"
      },
      {
        location:
        {
          latitude: 38.689653701836896,
          longitude: -9.177051486847693
        },
        originalIndex: 1,
        placeId: "ChIJLQcticc0GQ0RoiNZJVa5GxU"
      },
      {
        location:
        {
          latitude: 41.13993011767777,
          longitude: -8.609400794783655
        },
        originalIndex: 2,
        placeId: "ChIJJ4vQRudkJA0RpednU70A-5M"
      }
    ],
    warningMessage: "Input path is too sparse. You should provide a path where consecutive points are closer to each other. Refer to the 'path' parameter in Google Roads API documentation."
  }];

  speedlimits = info[0]['speedLimits'];
  //end of sample code

  return speedlimits;

}


//Takes in a list of the "lat" and "lng" objects and speedlimits
//Calls the Google Street View API on the lat/lng objects
//  Google Street View API returns and puts a view of the street in a div
//All the street view divs and speed limits are appended as children to another div
//Make new div for each lat / lng and return the name of the class that stores the overall div
function makePreview(list_lats_longs, speedLimits){
  //slideshow-container will be the div that stores all the divs returned from the Google Street View and Google Speed Limit API
  var global_div = document.getElementsByClassName('slideshow-container');
  //get rid of old slides that were added for the prior slideshow
  let old = document.getElementsByClassName('course_preview_slideshow');

  if(old.length !== 0) {
    while(old[0]) {
      old[0].remove();
    }
  }

  for (let i = 0; i < 3; i++){ //HARD CODING IN 3 BASED ON OUR SAMPLE DATA VS. list_lats_longs.length

    //Reformats the array of latitude and longitude pairs to fit the format for Google Speed View
    // i.e. convert every pair to an object {lat:####,lng:####}
    let current_lat_lng_pair = {lat:list_lats_longs[i][[0]],lng:list_lats_longs[i][[1]]}
    //Create a div location to store the Google Street View Info
    var container_div = document.createElement("div");
    var id_name = "slidestreet" + i;
    container_div.setAttribute("id",id_name);
    container_div.setAttribute("class","course_preview_slideshow");

    //add the speed limit div
    var speed_div = document.createElement("div");
    var id_name = "speedlimit" + i;
    speed_div.setAttribute("id",id_name);
    speed_div.setAttribute("class","speedlimit_div");
    //Get speed limit a lat / long
    let current_speed = speedLimits[i]['speedLimit'];

    //no speed limit returned for this lat / long
    if(!current_speed) {
      current_speed = '-';
    }
    //Add the speed limit text to the speed limit div
    speed_div.innerHTML = (`<div class="speed_limit_inner"><strong class="speed_limit_text">SPEED\nLIMIT\n</strong><strong class="speed_limit_number">${current_speed}</strong></div>`);
    //Add speed limit to container div
    container_div.appendChild(speed_div);

    //add the test picture
    let pictureName = "picture" + (i + 1) + ".png";
    var picture_div = document.createElement("img");
    picture_div.setAttribute('class','course_preview_street');
    picture_div.setAttribute("src", pictureName);
    //Add street view image to the div with speed limit
    container_div.appendChild(picture_div);
    //Add the div containing the street view and speed limit
    global_div[0].appendChild(container_div);

    //Get the Street view
    //let street_div = document.createElement('div');
    //street_div.setAttribute('class','course_preview_street');
    //getStreetView(current_lat_lng_pair,street_div);
    }
    ///All the container view divs can be retreived by calling:
    //  EX: ---> let slides = document.getElementsByClassName("slideshow-container");
    return 'slideshow-container';
  }

  // Calls the Google Street View and puts the info in the div
  // Google Street View API takes in a latitude and longitude --> returns a div for every request
  function getStreetView(current_lat_lng_pair,street_div){
    new google.maps.StreetViewPanorama(
      street_div, {
        position: current_lat_lng_pair,
        pov: {
          heading: 165,
          pitch: 1
        }
      });
  }

