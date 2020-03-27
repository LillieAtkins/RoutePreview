<<<<<<< HEAD
=======

>>>>>>> 75cbfa481065480e1e99c228566112693ed913b7
document.addEventListener('DOMContentLoaded', function () {

    var slideIndex = 0;
    var slideInterval = setInterval(nextSlide,2000);
    var slides = document.getElementsByClassName("mySlides");
    nextSlide();

    function nextSlide(){
      var i;

      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }
      slideIndex++;
<<<<<<< HEAD
=======

>>>>>>> 75cbfa481065480e1e99c228566112693ed913b7
      if(slideIndex <= slides.length) {
        slides[slideIndex-1].style.display = "block";
      }

    }

    function showSlide(){
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }

      if(slideIndex <= slides.length) {
        slides[slideIndex-1].style.display = "block";
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

<<<<<<< HEAD
=======

>>>>>>> 75cbfa481065480e1e99c228566112693ed913b7
    var resetButton = document.getElementById("reset");

    resetButton.onclick = function(){
      slideIndex = 0;
    };

    var nextButton = document.getElementById("forward");

    nextButton.onclick = function(){
      document.getElementById("pause-icon").className = "fa fa-play"; //make sure icon is play as the video is paused
      clearInterval(slideInterval); //keep slideshow paused if person starts clicking through pictures
      console.log('next button called');
      if(slideIndex < slides.length) {
        slideIndex = slideIndex + 1;
      } else {
        slideIndex = 1;
      }
      console.log(slideIndex);
      showSlide(slideIndex);
    };

    var prevButton = document.getElementById("backward");

    prevButton.onclick = function(){
      document.getElementById("pause-icon").className = "fa fa-play";
      clearInterval(slideInterval);
      console.log('prev button called');
      if(slideIndex > 1) {
        slideIndex = slideIndex - 1;
      } else {
        slideIndex = slides.length;
      }
      console.log(slideIndex);
      showSlide(slideIndex);
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
