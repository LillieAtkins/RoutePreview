document.addEventListener('DOMContentLoaded', function () {

    var slideIndex = 0;
    var speedIndex = 0;
    var slideInterval = setInterval(nextSlide,2000);
    var slides = document.getElementsByClassName("course_preview_slideshow");
    var speeds = document.getElementsByClassName("speedlimit");
    getSpeedLimits(GLOBAL LAT AND LONG LIST);
    nextSlide();

    function nextSlide(){
      var i;

      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        speeds[i].style.display = "none";
      }
      slideIndex++;
      speedIndex++;
      if(slideIndex <= slides.length) {
        slides[slideIndex-1].style.display = "block";
        speeds[speedIndex-1].style.display = "block";
      }

    }

    function showSlide(){
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        speeds[i].style.display = "none";
      }

      if(slideIndex <= slides.length) {
        slides[slideIndex-1].style.display = "block";
        speeds[speedIndex-1].style.display = "block";
      }

    }

    var playing = true;
    var pauseButton = document.getElementById("pause");

    pauseButton.onclick = function(){
    	if(playing){
         pauseSlideshow();
       }
    	else{
        playSlideshow();
      }
    };

    var resetButton = document.getElementById("reset");

    resetButton.onclick = function(){
      slideIndex = 0;
      speedIndex = 0;
    };

    var nextButton = document.getElementById("forward");

    nextButton.onclick = function(){
      pauseSlideshow();
      console.log('next button called');
      if(slideIndex < slides.length) {
        slideIndex = slideIndex + 1;
        speedIndex += 1;
      } else {
        slideIndex = 1;
        speedIndex = 1;
      }
      console.log(slideIndex);
      showSlide();
    };

    var prevButton = document.getElementById("backward");

    prevButton.onclick = function(){
      pauseSlideshow();
      console.log('prev button called');
      if(slideIndex > 1) {
        slideIndex = slideIndex - 1;
        speedIndex -= 1;
      } else {
        slideIndex = slides.length;
        speedIndex = speed.length;
      }
      console.log(slideIndex);
      showSlide();
    };

    function pauseSlideshow(){
      document.getElementById("pause-icon").className = "fa fa-play";
    	playing = false;
    	clearInterval(slideInterval);
    }

    function playSlideshow(){
    	document.getElementById("pause-icon").className = "fa fa-pause";
    	playing = true;
    	slideInterval = setInterval(nextSlide,2000);
    }


  })

  //get the speed limits which takes in the list of latitudes and longitudes
  function getSpeedLimits(list_lats_longs) {
    let path;
    let info;

    let stop = Math.ceil(list_lats_longs.length/100);
    console.log(stop);

    list_lats_longs_copy = list_lats_longs.slice();

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
    //     list_lats_longs_copy = list_lats_longs_copy.splice(0, 100);
    //
    //   }
    // }
    // path = list_lats_longs_copy[0];
    // for (let i = 1; i < list_lats_longs_copy.length; i++){
    //   path += "|" + list_lats_longs_copy[i]; //create the parameters to send google maps
    // }

    // info = fetch(`https://roads.googleapis.com/v1/speedLimits?path=${path}&key=AIzaSyBX779m3-lWL6JONrBososCVSySr3rPsJM`).then( response => {
    //   if (!response.ok) { throw response }
    //   return response.json()  //we only get here if there is no error
    // })
    // .catch( err => {
    //   console.log(err);
    // })

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
    console.log(speedlimits);

    for (let i = 0; i < speedlimits.length; i++){
      //Create a div for the speed limit
      var current_div = document.createElement("div");
      var id_name = "speedlimit" + i;
      current_div.setAttribute("class","speedlimit");
      current_div.setAttribute("id",id_name);

      let current_speed = speedlimits[i]['speedLimit'];
      var speed = document.createTextNode(current_speed);
      console.log(speed);
      current_div.appendChild(speed);
      console.log(current_div);

      var global_div = document.getElementsByClassName("slideshow-container"); //DOESN'T WORK
      console.log(global_div);
      global_div.appendChild(current_div);

      return 'slideshow-container';

    }


  }
