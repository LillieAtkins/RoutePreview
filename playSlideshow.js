var slideIndex = 0;
// showSlides();

function showSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {
    clearTimeout(); //this stops the slideshow from infinitely looping
  } //{slideIndex = 1}


  slides[slideIndex-1].style.display = "block";
  setTimeout(showSlides, 2000); // Change image every 2 seconds
}


var slides = document.querySelectorAll('#slides .slide');
var currentSlide = 0;
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

pauseButton.onclick = function(){
	if(playing){ pauseSlideshow(); }
	else{ playSlideshow(); }
};

// var Timer = function(callback, delay) {
//     var timerId, start, remaining = delay;
//
//     this.pause = function() {
//         window.clearTimeout(timerId);
//         remaining -= Date.now() - start;
//     };
//
//     this.resume = function() {
//         start = Date.now();
//         window.clearTimeout(timerId);
//         timerId = window.setTimeout(callback, remaining);
//     };
//
//     this.resume();
// };
//
// var timer = new Timer(function() {
//     alert("Done!");
// }, 1000);
//
// timer.pause();
// // Do some stuff...
// timer.resume();
