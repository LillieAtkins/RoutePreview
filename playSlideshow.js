document.addEventListener('DOMContentLoaded', function () {

    var slideInterval = setInterval(nextSlide,2000);
    var slides = document.getElementsByClassName("course_preview_slideshow");
    nextSlide();

    function nextSlide(){
      var i;

      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }
      slideIndex++;
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

    var resetButton = document.getElementById("reset");

    resetButton.onclick = function(){
      slideIndex = 0;
      playing = true;
    };

    var nextButton = document.getElementById("forward");

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

    prevButton.onclick = function(){
      pauseSlideshow();
      if(slideIndex > 1) {
        slideIndex = slideIndex - 1;
      } else {
        slideIndex = slides.length;
      }
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
