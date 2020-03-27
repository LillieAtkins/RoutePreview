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
    };

    var nextButton = document.getElementById("forward");

    nextButton.onclick = function(){
      console.log('next button called');
      if(slideIndex <= slides.length) {
        slideIndex = slideIndex + 1;
      } else {
        slideIndex = 0;
      }
      console.log(slideIndex);
    };

    var prevButton = document.getElementById("backward");

    prevButton.onclick = function(){
      console.log('prev button called');
      if(slideIndex >= 0) {
        slideIndex = slideIndex - 1;
      } else {
        slideIndex = slides.length;
      }
      console.log(slideIndex);
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
