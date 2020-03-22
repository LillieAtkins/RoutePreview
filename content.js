//Calls the action when we run the specified pages so that the popup will appear
chrome.runtime.sendMessage('showPageAction');

//Prevents other pages from giving errors when trying to invoke our functions
try {
  //If our button has not already been created - display our button
  if(!document.getElementById("course_preview_btn")){
    //Display the Course Preview Button
    var before_content = document.getElementById("builder-controls");
    var btn = document.createElement("BUTTON");
    //Course Preview Button's Properties and Styling
    btn.style.color = 'white';
    btn.style.background = 'gray';
    btn.disabled = true;
    btn.innerHTML = "Course Preview";
    btn.setAttribute("id","course_preview_btn");
    btn.setAttribute("class","course_preview_class");
    if (before_content){
      //Adds the actual button to the page
      before_content.appendChild(btn);
    }
  }

  //Action that takes place when we click the Course Preview Button
  btn.addEventListener("click", function(){
    console.log('creating');
    //Displays our Popup from the popup.html file
    var popup_area = document.getElementById("map-canvas");
    var surround_div = document.createElement("div");
    //Object holds/displays the popup.html code
    var object = document.createElement("object");
    object.data = chrome.runtime.getURL("popup.html");
    object.height = 350;
    object.width = 400;
    //Puts the object in the div
    surround_div.appendChild(object);
    surround_div.style.position = "absolute";
    surround_div.style.zindex = 2;
    popup_area.appendChild(surround_div);
    
    //Start for functionality of our project
    displayPreview();
  })

  function displayPreview(){
    //Suggestion: API for Strava code could go here
    getLatandLog();
    //Suggestion: API for Google StreetView
    getStreetViews();
    //Suggestion: calling function to show video
    showVideo();
  }

  function getLatandLog(){
    //code here
    //Returns array, (i.e [{lat: ####, lng:###},{lat: ####, lng:###},..]) for the Google Street View API
  }

  function getStreetViews(){
    //code here
    //Google Street View API takes in a latitude and longitude --> returns a div for every request
    //Return array of divs
  }

  function showVideo(){
    //Show video - (could be pointer to another file)
  }

  //Action that takes place when a user clicks the page
  document.addEventListener("click", function(){
    //Sometimes the update for the save button lags
    setTimeout(enableCoursePreview, 1500);
  });

  //Enables the course preview button to be clicked and used
  //   --> if save button is enabled and our button is not already enabled
  function enableCoursePreview(){
    //Gets the save orange button
    var save_button = document.getElementsByClassName("save-route");
    //If the save_button is not disabled and we have not already enabled our button --> enable our button
    if (!save_button[0].className.includes("disabled") && btn.disabled){
      btn.disabled = false;
      btn.style.color = 'white';
      btn.style.background = 'black';
    }
  }

}
catch (err){
  console.log(err);
  //If something goes wrong
}
