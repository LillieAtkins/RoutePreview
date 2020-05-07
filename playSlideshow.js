document.addEventListener('DOMContentLoaded', function () {

  var slideInterval = setInterval(nextSlide,2000);
  var slides = document.getElementsByClassName("route_preview_slideshow");
  //Get the fill progress bar to properly update it as the video elapses
  let slider_fill_bar = document.getElementsByClassName("slider_fill")[0];
  //Creates the progress slider if the slider is not already created
  var slider_container = document.getElementById("slider_div");
  var route_preview_slider = document.getElementById('slideshow_view_slider');
  if (!route_preview_slider){
    //Makes the progress slider and sets its attributes
    route_preview_slider = document.createElement("INPUT");
    route_preview_slider.type ="range";
    route_preview_slider.min = 1;
    route_preview_slider.setAttribute("id","slideshow_view_slider");
    route_preview_slider.setAttribute("class","video_slider");
    slider_container.appendChild(route_preview_slider);
    //Updates the position in the video and the progress bar when the user
    //interacts with the progress bar
    route_preview_slider.oninput = function() {
      slideIndex=this.value;
      slider_fill_bar.style.width = (((this.value-1)/(slides.length-1)) *100)+ "%";
      showSlide();
    }
  }
  nextSlide();
  //Runs the normal cycle of slides
  function nextSlide(){
    var i;
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    if(slideIndex < slides.length) {
      slideIndex++;
      //Update the slider position and the fill progress bar
      document.getElementById("slideshow_view_slider").value=slideIndex;
      slider_fill_bar.style.width = (((slideIndex-1)/(slides.length-1)) *100)+ "%";
      slides[slideIndex-1].style.display = "block";
    }

  }
  //If one of the buttons is clicked - run this function to show the slides
  function showSlide(){
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }

    if(slideIndex <= slides.length) {
      //Update the slider position and the fill progress bar
      document.getElementById("slideshow_view_slider").value=slideIndex;
      slider_fill_bar.style.width = (((slideIndex-1)/(slides.length-1)) *100)+ "%";
      slides[slideIndex-1].style.display = "block";
    }

  }

  var pauseButton = document.getElementById("pause");
  //Handles clicks on the pause/play button
  pauseButton.onclick = function(){
    if(playing){
      pauseSlideshow();
    }
    else{
      playSlideshow();
    }
  };

  var resetButton = document.getElementById("reset");
  //Handles clicks on the reset button
  resetButton.onclick = function(){
    pauseSlideshow();
    slideIndex = 0;
    playing = true;
    playSlideshow();
  };

  var nextButton = document.getElementById("forward");
  //Handles clicks on the right/next arrow
  nextButton.onclick = function(){
    pauseSlideshow();
    if(slideIndex < slides.length) {
      slideIndex = slideIndex + 1;
    } else {
      slideIndex = 1;
    }
    showSlide();
  };

  var prevButton = document.getElementById("backward");
  //Handles clicks on the left/previous arrow
  prevButton.onclick = function(){
    pauseSlideshow();
    if(slideIndex > 1) {
      slideIndex = slideIndex - 1;
    } else {
      slideIndex = slides.length;
    }
    showSlide();
  };
  //Pauses the slideshow
  function pauseSlideshow(){
    document.getElementById("pause-icon").className = "fa fa-play";
    playing = false;
    clearInterval(slideInterval);
  }
  //Plays the slideshow
  function playSlideshow(){
    document.getElementById("pause-icon").className = "fa fa-pause";
    playing = true;
    slideInterval = setInterval(nextSlide,2000);
  }

})
