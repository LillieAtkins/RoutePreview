//Delete line 1 and 2 later --> useful now for testing sessionStorage when getting authorization
//sessionStorage.setItem("user_access_value", ""); //Uncomment to reset

//Run this functionality when we are on strava's athlete route page
if (window.location.href=== 'https://www.strava.com/athlete/routes'){
  //Calls the action when we run the specified pages so that the popup will appear
  chrome.runtime.sendMessage('showPageAction');

  //Prevents other pages from giving errors when trying to invoke our functions
  try {
        //If the document body has loaded - display our button
        if (document.body){
          //Display the Course Preview Button
          var before_content = document.getElementsByClassName("route-card");//"text-bold text-headline");//
          var btn = document.createElement("BUTTON");
          //Course Preview Button's Properties and Styling
          btn.style.color = 'white';//'white';
          btn.style.background = 'rgba(0,0,0,.4)';//black';
          btn.style.position = 'absolute';
          btn.style.display = 'block';
          btn.style.top = 0;
          btn.style.left =3;
          btn.innerHTML = "Course Preview";//"Preview";//
          btn.setAttribute("class","course_preview_class");
          //Create a course preview button for each route
          let button_index = 0;
          while (button_index < before_content.length){
            //Ensure that the buttons show
            let assigned_button = null;
            let route_id = null;
            assigned_button = btn.cloneNode(true);
            assigned_button.setAttribute("id","course_preview_btn"+button_index);
            before_content[button_index].appendChild(assigned_button);

            // Extract the route id from the route route_cards
            var route_cards = document.getElementsByClassName("route-card");
            //Get specfic route card
            var route_card = route_cards[button_index];
            //Get the "a" that is holding the route id
            var route_id_holder = route_card.querySelector('a');
            //Extract the actual route_id
            route_id = route_id_holder.href.substring(30, route_id_holder.href.length );
            //Action that takes place when we click the Course Preview Button
            assigned_button.onclick = function (){
              //Show our popup;
              surround_div.style.display = 'flex';
              //Start for functionality of our project
              //displayPreview(route_id);
              authorizeUser(route_id);

            }
            button_index++;
          }

          //Displays our Popup from the popup.html file
          var popup_area = document.getElementsByClassName("view");
          var surround_div = document.createElement("div");
          //Object holds/displays the popup.html code
          var object = document.createElement("object");
          object.data = chrome.runtime.getURL("popup.html");
          object.height = 350;
          object.width = 400;
          object.style.objectFit = 'cover';
          object.setAttribute("id","course_preview_object");


          //Creates the exit icon that allows the user to exit the popup
          const exit_icon = document.createElement('a');
          exit_icon.innerHTML = 'Exit';
          exit_icon.style.zIndex = 9002;
          exit_icon.style.textDecoration = "none";
          exit_icon.style.color = "white";
          //Put the expand icon in the right corner of the popup html
          exit_icon.style.top = '21%';
          exit_icon.style.right = '31%';
          exit_icon.style.position = "absolute";

          //Creates the expand icon that determines what size the popup should appear
          const expand_icon = document.createElement('a');
          expand_icon.innerHTML = 'Expand';
          expand_icon.style.zIndex = 9002;
          expand_icon.style.textDecoration = "none";
          expand_icon.style.color = "white";
          //Put the expand icon in the right corner of the popup html
          expand_icon.style.top = '21%';
          expand_icon.style.right = '34%';
          expand_icon.style.position = "absolute";

          //Expands and shrinks the popup when the expand/shrink link is clicked
          expand_icon.onclick = function(){
            if (object.width != '100%' && object.height != '100%'){
              object.width = '100%';
              object.height = '100%';
              exit_icon.style.top = '2%';
              exit_icon.style.right = '2%';
              expand_icon.style.top = '2%';
              expand_icon.style.right = '5%';
              expand_icon.innerHTML = 'Shrink';
            }
            else{
              object.height = 350;
              object.width = 400;
              exit_icon.style.top = '21%';
              exit_icon.style.right = '31%';
              expand_icon.style.top = '21%';
              expand_icon.style.right = '34%';
              expand_icon.innerHTML = 'Expand';
            }
          }


          //Puts the object in the div
          surround_div.appendChild(object);
          //Places the expand icon in the div
          surround_div.appendChild(expand_icon);
          //Places the exit icon in the div
          surround_div.appendChild(exit_icon);

          surround_div.style.position = "fixed";
          surround_div.style.zIndex = 9000;
          surround_div.style.textAlign = 'center';
          surround_div.style.width = '100%';
          surround_div.style.height = '100%';
          surround_div.style.background = 'rgba(255,255,255,.6)';
          surround_div.style.top= 0;
          //Vertically align the div
          surround_div.style.justifyContent= "center";
          object.style.alignSelf= "center";
        //  document.body.appendChild(surround_div);
          popup_area[0].appendChild(surround_div);
          //Hide the popup until after the user clicks on the course_preview button
          surround_div.style.display = 'none';

          //Exit the popup when the user clicks the exit button
          exit_icon.onclick = function(){
            //Reset the popup size to original smaller size
            object.height = 350;
            object.width = 400;
            exit_icon.style.top = '21%';
            exit_icon.style.right = '31%';
            expand_icon.style.top = '21%';
            expand_icon.style.right = '34%';
            expand_icon.innerHTML = 'Expand';
            surround_div.style.display = 'none';
          }


      }
      //Check if we just came back from being redirected --> if so show the preview.
      if (sessionStorage.getItem("user_access_value").length >0 && sessionStorage.getItem("route_id_given").length>0){
        displayPreview(sessionStorage.getItem("route_id_given"),sessionStorage.getItem("user_access_value"));
      }

    async function authorizeUser(route_id){
    //  window.location.href = await "http://www.google.com";
      const userAccess_value = sessionStorage.getItem("user_access_value");
      //If the user's access has not already been given
      if (!userAccess_value){
        //Save route_id for sessionStorage for reauthorization
        sessionStorage.setItem("route_id_selected", route_id);
        //Redirect user to strava's authorization page to get access
        const auth_link = "https://www.strava.com/oauth/authorize?client_id=44955&redirect_uri=http://localhost&response_type=code&scope=read_all"
        window.location.replace(auth_link);
      }
      else{
        //If access is given send user to authorization page
        displayPreview(route_id,userAccess_value);
      }
    }

    async function displayPreview(route_id,userAccess_value){
      //Suggestion: API for Strava code could go here
      //const list_lats_longs = getLatandLog(route_id);
      const list_lats_longs = await reAuthorize(route_id).then(res => res);
      //Suggestion: API for Google StreetView
      //getStreetViews(list_lats_longs);
      //Resets the session storage
      sessionStorage.setItem("route_id_given", '');
    }

  async function getLatandLog(res, route_id){
    const route_link = `https://www.strava.com/api/v3/routes/${route_id}/streams?access_token=${res.access_token}`
     return await fetch(route_link).then(res =>{
      //Gets the Promise
      return res.json();
    }).then(res=>{
      //Returns array, (i.e [{lat: ####, lng:###},{lat: ####, lng:###},..]) for the Google Street View API
      return res[0].data;
    }).catch(error => console.log("getLatandLog error \n",error));
  }

  // TODO: CATCH ERRORS
   //This reauthorizes (uses refresh token to get new auth token) , calls
   //getLatandLog with the new auth token which then returns the lat lng array
     async function reAuthorize(route_id){
       const auth_link = "https://www.strava.com/oauth/token"
         return await fetch(auth_link,{
             method: 'post',
             headers: {
                 'Accept': 'application/json, text/plain, */*',
                 'Content-Type': 'application/json'

             },

             body: JSON.stringify({
                client_id: 'xxxxx',
                client_secret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                refresh_token: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                grant_type: 'refresh_token'
             })
         })
         .then(res => {
           //Get the Promise
            return res.json();
         }).then(res=>{
           //Get the object return from the Promise
           return getLatandLog(res,route_id);
         }).catch(error => console.log("reAuthorize error",error));
     }

  //Takes in a list of the "lat" and "lng" objects and calls the Google Street View API on the objects
  //Returns and puts a view of the street in a div
  //All the street view divs are appended as children to another div
  //Return the name of the class that stores the street view divs
  function getStreetViews(list_lats_longs){
    for (let i = 0; i < list_lats_longs.length; i++){
      //Create a div location to store the Google Street View Info
      var current_div = document.createElement("div");
      var id_name = "slidestreet" + i;
      current_div.setAttribute("class","course_preview_slideshow");
      current_div.setAttribute("id",id_name);
      //FINAL_LOCATION will be the div that stores all the divs returned from the Google Street View
      var global_div = document.getElementById('slideshow-container');
      global_div.appendChild(current_div);
      //Calls the Google Street View and puts the info in the div
        //Google Street View API takes in a latitude and longitude --> returns a div for every request
      new google.maps.StreetViewPanorama(
          current_div, {
          position: list_lats_longs[i],
          pov: {
            heading: 165,
            pitch: 1
          }
        });
      }
      ///All the Google Street View divs CAN BE RETREIVED BY CALLING
      //  EX: ---> let slides = document.getElementsByClassName("slideshow-container);
      return 'slideshow-container';
    }
  }
  catch (err){
    console.log(err);
    //If something goes wrong
  }
}

//get the speed limits which takes in the list of latitudes and longitudes
function getSpeedLimits(list_lats_longs) {
  path = "";

  for (let i = 0; i < list_lats_longs.length; i++){
    path += "|" + list_lats_longs[i][0]; //create the parameters to send google maps

  }
  
  //create the call
  "https://roads.googleapis.com/v1/speedLimits?parameters&key=YOUR_API_KEY"
}


//Run this functionality when on the strava's authorization page
else if (window.location.href.includes("oauth")){
  console.log('new window loaded');
  //TODO: Actually recording the click on the "Authorize" and getting the user access value that we need
  window.onclick = function(){
      console.log('window clicked');
      //If current page is the oauth page
      if (window.location.href.includes("oauth")){
        //Goes back to the authorization screen
        window.location.replace('https://www.strava.com/athlete/routes')
        console.log('return to athlete routes');
        //Actual access code will replace temporary_text_for_julia
        sessionStorage.setItem("user_access_value", 'temporary_text_for_julia');
      }
  }
}
