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

//Waits for the screen to load to send messages to content.js about the mouse moving
//to show the navigation tools (exit and expand/compress icons)
window.addEventListener('load', function () {
  //If the mouse is caught moving - send message to content.js so that navigation
  //tools appear on the screen
  window.addEventListener('mousemove',function(){
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {"message": "showTools"});
    });
  });
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

//If we hearback from Google Sales
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
  //     info = fetch(`https://roads.googleapis.com/v1/speedLimits?path=${path}&key=APIKEY`).then( response => {
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
async function makePreview(list_lats_longs_original, speedLimits){
  //slideshow-container will be the div that stores all the divs returned from the Google Street View and Google Speed Limit API
  var global_div = document.getElementsByClassName('slideshow-container');
  //get rid of old slides that were added for the prior slideshow
  global_div[0].innerHTML = "";
  let list_lats_longs = list_lats_longs_original;
  let newListLatLongs = [];
  if(list_lats_longs_original.length > 200){     //hardcode 200 for now but can change this depending on our preference/length of slides
    newListLatLongs = await filterListLatLngs(list_lats_longs).then(res => res);
    //now if newListLatLongs is longer than 0 -> so we want to use it, use that instead of list_lats_longs_original
    list_lats_longs = newListLatLongs;
    //another condition to further narrow down the list if still too long
    if(list_lats_longs.length > 150){      //choose what length would be the threshold
      let newSpacedList = [list_lats_longs[0]];
      for(let i=0; i < list_lats_longs.length; i++){
         //go through the list of lat lngs and check the distance between them
         for(let j = i; j <list_lats_longs.length; j++){
           //chose 400 meters as cut off distance between two points because long enough to narrow down list but not too long
           // to miss out on valuable insights
           if(distanceBetweenLatLng(list_lats_longs[i], list_lats_longs[j]) > 400){
             newSpacedList.push(list_lats_longs[j]);
             i = j;  //update i
           }
         }
       }
      list_lats_longs = newSpacedList; //set to new spaced list because now we want to use that
    }
  }

  for (let i = 0; i < list_lats_longs.length; i++){ //HARD CODING IN 3 BASED ON OUR SAMPLE DATA VS. list_lats_longs.length

    //console.log(list_lats_longs.length)
    //Reformats the array of latitude and longitude pairs to fit the format for Google Street View
    // i.e. convert every pair to an object {lat:####,lng:####}
    let current_lat_lng_pair = {lat:list_lats_longs[i][[0]],lng:list_lats_longs[i][[1]]}

    //set bearing to 165 as default
    let bearing = 165;
    // if we are not at the end of the lat lng list
    // this doesn't seem to always make the heading perfect but I think that is more due to what the api
    // returns because it did help
    if(i !=(list_lats_longs.length -1)){
      let future_lat_lng_pair = {lat:list_lats_longs[i + 1][[0]],lng:list_lats_longs[i + 1][[1]]}
      bearing = getBearing(future_lat_lng_pair, current_lat_lng_pair);
    }




    //Create a div location to store the Google Street View Info
    var container_div = document.createElement("div");
    var id_name = "slidestreet" + i;
    container_div.setAttribute("id",id_name);
    container_div.setAttribute("class","route_preview_slideshow");

    //add the speed limit div
    var speed_div = document.createElement("div");
    //var id_name = "speedlimit" + i;

    //changing some speed limit stuff quickly for street view testing
    var id_name = "speedlimit" + 1;


    speed_div.setAttribute("id",id_name);
    speed_div.setAttribute("class","speedlimit_div");
    //Get speed limit a lat / long
    //let current_speed = speedLimits[i]['speedLimit'];       // Hardcoding because we can't connect to Google Roads API yet
    let current_speed = speedLimits[1]['speedLimit'];         // this just shows how a speed limit would be displayed

    //no speed limit returned for this lat / long -> this will become relevant if we can use roads API
    if(!current_speed) {
      current_speed = '-';
    }
    //Add the speed limit text to the speed limit div
    speed_div.innerHTML = (`<div class="speed_limit_inner"><strong class="speed_limit_text">SPEED\nLIMIT\n</strong><strong class="speed_limit_number">${current_speed}</strong></div>`);
    //Add speed limit to container div
    container_div.appendChild(speed_div);

    var picture_div = document.createElement("img");
    picture_div.setAttribute('class','route_preview_street');

    //set src of picture_div
    getStaticStreetView(current_lat_lng_pair, picture_div, bearing);

    //Add street view image to the div with speed limit
    container_div.appendChild(picture_div);
    //Add the div containing the street view and speed limit
    global_div[0].appendChild(container_div);

    }
    ///All the container view divs can be retreived by calling:
    //  EX: ---> let slides = document.getElementsByClassName("slideshow-container");
    return 'slideshow-container';
  }



//Calls the Google StreetView API with a latitude and longitude and bearing and sets the div with the returned image
function getStaticStreetView(current_lat_lng_pair,street_div, bearing){
  //const fetch_refresh_link = `https://maps.googleapis.com/maps/api/streetview?size=400x400&location=${current_lat_lng_pair["lat"]},${current_lat_lng_pair["lng"]}&fov=90&heading=${bearing}&pitch=0&key=APIKEY`;
  const fetch_refresh_link = "https://course-preview-s20.herokuapp.com/static_street_view/latitude="+current_lat_lng_pair.lat+"&longitude="+current_lat_lng_pair.lng+"&heading="+bearing;
  fetch(fetch_refresh_link).then(res=>{

    return(res.json());

  }).then(res => {
    street_div.setAttribute("src", "data:image/png;base64, " + res.image);
  }).catch(error => console.log("street view",error));
}


// If we hear back from Google Sales we could maybe get this up and running
  // function getSpeedLimit(current_lat_lng_pair){
  //   const fetch_refresh_link = `https://roads.googleapis.com/v1/speedLimits?path=${current_lat_lng_pair["lat"]},${current_lat_lng_pair["lng"]}&key=APIKEY`;
  //   fetch(fetch_refresh_link).then(res=>{
  //     //Get the object return from the Promise
  //     //return res;
  //   }).catch(error => console.log("street view",error));
  // }

// formula from https://www.igismap.com/formula-to-find-bearing-or-heading-angle-between-two-points-latitude-longitude/
function getBearing(upcoming_lat_lng, current_lat_lng){
  const curr_lat = current_lat_lng["lat"];
  const curr_lng = current_lat_lng["lng"];
  const future_lat = upcoming_lat_lng["lat"];
  const future_lng = upcoming_lat_lng["lng"];

  const x = Math.cos(future_lat) * Math.sin(future_lng - curr_lng);
  const y = Math.cos(curr_lat) * Math.sin(future_lat) - Math.sin(curr_lat) * Math.cos(future_lat) * Math.cos(future_lng - curr_lng);

  const bearing_radians = Math.atan2(x, y);

  const bearing_degrees = bearing_radians * (180/ Math.PI);

  return(bearing_degrees);

}


//filter to only lat lng values that have a returned image if latitude longitude stream is long
async function filterListLatLngs(listLatLongs){
    let newListLatLongs = listLatLongs.map(x => {
      const fetch_link = "https://course-preview-s20.herokuapp.com/static_street_metadata/latitude="+x[0]+"&longitude="+x[1];
      return fetch(fetch_link).then(res=>{
        return res.json();
      }).then(data => {
        if(data["status"] == "OK"){
          return(x);
        }
      }
      )}
    );
    return(Promise.all(newListLatLongs).then(results => results.filter(x => x!= undefined)));

  }

//Use haversine formula
//https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
function distanceBetweenLatLng(currentPair, futurePair){
  const lat1 = currentPair[0];
  const lon1 = currentPair[1];
  const lat2 = futurePair[0];
  const lon2 = futurePair[1];

  const lat_dif = lat2 -lat1;
  const lng_dif = lon2 - lon1;

  const dLat = lat_dif* (Math.PI/180);
  const dLon = lng_dif * (Math.PI/180);


  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1* (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  var R = 6371; //km
  const d = R * c * 1000; // to get it into meters

  return(d);

}
