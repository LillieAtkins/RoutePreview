var video = new Whammy.Video(15); //this sets the frame rate

console.log('adding pictures');
//PICTURES NOT PROPERLY FORMATTED YET
video.add("picture1.png");
video.add("picture2.png");
video.add("picture3.png");

var url;
encoder.compile(false, function(output){
  console.log("encoding");
  url = (window.webkitURL || window.URL).createObjectURL(output);
});

console.log("showing video");
var video = document.createElement("video");
video.src = url;

// This next line will just add it to the <body> tag
document.body.appendChild(video);
