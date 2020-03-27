document.addEventListener('DOMContentLoaded', function () {

    var slideIndex = 0;
    var slideInterval = setInterval(nextSlide,2000);
    nextSlide();

    function nextSlide(){
      var i;
      var slides = document.getElementsByClassName("mySlides");
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }
      slideIndex++;

      slides[slideIndex-1].style.display = "block";
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

    function pauseSlideshow(){
      console.log('pause called');
    	pauseButton.innerHTML = 'Play';
    	playing = false;
    	clearInterval(slideInterval);
    }

    function playSlideshow(){
      console.log('play called');
    	pauseButton.innerHTML = 'Pause';
    	playing = true;
    	slideInterval = setInterval(nextSlide,2000);
    }


  })
