//Run this functionality when we are on strava's athlete route page
if (window.location.href=== 'https://www.strava.com/athlete/routes'||window.location.href.includes('https://www.strava.com/routes')){
  //Calls the action when we run the specified pages so that the popup will appear
  chrome.runtime.sendMessage('showPageAction');
  //loads the user response token
  async function loadUserResponseToken() {
    await new Promise(resolve => {
      chrome.storage.local.get(['user_response_token'], function(items) {
        if (items.user_refresh_token){
          sessionStorage.setItem("user_response_token", items.user_response_token);
          resolve(items.user_response_token);
        }
      })
    })
  }


  //loads the user refresh token -> if it hasn't been set then just loads empty string
  async function loadUserRefreshToken() {
    await new Promise(resolve => {
      chrome.storage.local.get(['refresh_token'], function(items) {
        if (items.refresh_token){
          sessionStorage.setItem("refresh_token", items.refresh_token);
          resolve(items.refresh_token);
        }
      })
    })
  }

  //Prevents other pages from giving errors when trying to invoke our functions
  try {
    //If the document body has loaded - display our button
    if (document.body){
      //Display the Course Preview Button
      loadUserResponseToken();
      loadUserRefreshToken();

      let before_content;
      var btn = document.createElement("BUTTON");
      //Run this if we are on a expanded route page
      if (Number.isInteger(parseInt(window.location.href.charAt(window.location.href.length-1)))){
        before_content = document.getElementsByClassName('borderless actions');//'map leaflet-container leaflet-retina leaflet-fade-anim');//mt-lg//'mapbox-container'
        //Style the other buttons on the row so that they still display
        var a_items = document.querySelectorAll('.btn-sm');
        for (let i = 1;i<a_items.length;i++){
          a_items[i].setAttribute('style','margin-bottom: auto;');
        }
        //Course Preview Button's Properties and Styling
        btn.style.color = 'white';
        btn.style.fontSize = "inherit";
        btn.style.background = 'black';
        btn.style.cursor = 'pointer';
        btn.style.display = 'inline-flex';
        btn.style.padding = '6px 12px';
        btn.style.fontWeight = 700;
        btn.style.marginBottom = "auto";
        btn.style.border= "1px solid transparent";
        btn.style.borderRadius = '4px';
        btn.style.whiteSpace = 'nowrap';
        btn.style.textDecoration = 'none';
        btn.style.verticalAlign = 'middle';
        btn.style.lineHeight = 'normal';
        btn.style.alignItems= 'center';
        btn.style.justifyContent = 'center';
        btn.style.boxSizing = "border-box";
        btn.style.webkitBoxPack = 'center';
        btn.style.webkitBoxOrient = 'horizontal';
        btn.style.webkitBoxAlign = 'center';
      }
      else{
        //Run the extension on the page with all the routes
        before_content = document.getElementsByClassName("route-card");
        //Course Preview Button's Properties and Styling
        btn.style.color = 'white';
        btn.style.background = 'rgba(0,0,0,.4)';
        btn.style.position = 'absolute';
        btn.style.display = 'block';
        btn.style.left =3;
        btn.style.top = 0;
      }

      btn.innerHTML = "Course Preview";
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

        // Extract the route id
        //Expanded route page
        if (Number.isInteger(parseInt(window.location.href.charAt(window.location.href.length-1)))){
          //Get the route id from the url
          let current_url  = window.location.href;
          //Extract the actual route_id
          route_id = current_url.substring(30, current_url.length);
        }
        //General route page
        else{
          // Extract the route id from the route route_cards
          var route_cards = document.getElementsByClassName("route-card");
          //Get specfic route card
          var route_card = route_cards[button_index];
          //Get the "a" that is holding the route id
          var route_id_holder = route_card.querySelector('a');
          //Extract the actual route_id
          route_id = route_id_holder.href.substring(30, route_id_holder.href.length );
        }

        //Action that takes place when we click the Course Preview Button
        assigned_button.onclick = function (){
          //if the user has been authorized and has refresh token
          if(sessionStorage.getItem("refresh_token").length > 1){
            //user has been authorized -should be able to just use refresh token to display
            //only need to use refresh token
            console.log("User has been authorized");
            const refresh_token = sessionStorage.getItem("refresh_token");//get refresh token
            //Start for functionality of our project
            initiateAuthorization(route_id, refresh_token);
            //Show our popup;
            surround_div.style.display = 'flex';

          } else {
            // User has not been authorized yet
            console.log("User not yet authorized");
            //user has not been authorized or dont have refresh token
            authorizeUser(route_id);
          }
        }
        button_index++;
      }

      //Displays our Popup from the popup.html file
      let popup_area;
      //Expanded route-specific page
      if (Number.isInteger(parseInt(window.location.href.charAt(window.location.href.length-1)))){
        popup_area = document.getElementsByClassName("messages");
      }
      //Page with all the routes display
      else{
        popup_area = document.getElementsByClassName("view");
      }
      var surround_div = document.createElement("div");
      //Object holds/displays the popup.html code
      var object = document.createElement("iframe");
      object.src = chrome.runtime.getURL("popup.html");
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

    //If we have not received user access token from the user
    //Redirect the user to strava's oauth page
    async function authorizeUser(route_id){
      const userAccess_value = sessionStorage.getItem("user_response_token");
      //If the user's access has not already been given - go through oath flow
      if (userAccess_value.length < 1){
        // user has not been authorized
        //Save route_id for sessionStorage for reauthorization
        sessionStorage.setItem("route_id_selected", route_id);
        //Redirect user to strava's authorization page to get access
        const auth_link = "https://www.strava.com/oauth/authorize?client_id=44955&redirect_uri=https://www.google.com&response_type=code&scope=read_all"
        window.location.replace(auth_link);
      }
    }

    //Reauthorizes the user and retrieves the longitudes and latitudes
    //of the route id given (user must already be previously authorized)
    async function initiateAuthorization(route_id, refresh_token){
      // trial_token is the refresh token we get from passing in the auth token
      await reAuthorize_next(route_id, refresh_token).then(res =>res).catch(error => console.log("reAuthorize lat lng error",error));

    }

    //Get the speed limits based on the latitude and longitude pairs given
    //Make a Google Street View div for every latitude and longitude pair given
    function displayPreview(list_lats_longs){
      //Suggestion: API for Google StreetView
      console.log(list_lats_longs);
      //Sends the latitudes and longitudes to the popup.html javascript page to work to
      //get the speed limits and street views
      var course_preview_iframe = document.getElementById('course_preview_object');
      course_preview_iframe.contentWindow.postMessage(list_lats_longs, 'chrome-extension://'+chrome.runtime.id+'/popup.html');
      //Clears the curent route id selected and sets the list of lats and longitudes
      chrome.storage.sync.set({"route_id_selected":''}, function() {
      });
    }

    //Retrieves the latitudes and longitudes of the route id given
    // Returns the latitudes and longitudes
    async function getLatandLog(res, route_id){
      const route_link = `https://www.strava.com/api/v3/routes/${route_id}/streams?access_token=${res.access_token}`
      return await fetch(route_link).then(result =>{
        //Gets the Promise
        return result.json();
      }).then(result=>{
        //Returns array, (i.e [{lat: ####, lng:###},{lat: ####, lng:###},..]) for the Google Street View API
        displayPreview(result[0].data);
        return result[0].data;
      }).catch(error => console.log("getLatandLog error \n",error));
    }

    //This reauthorizes (uses refresh token to get new auth token) , calls
    //getLatandLog with the new auth token which then returns the lat lng array
    async function reAuthorize_next(route_id, trial_token){
      const fetch_refresh_link = "https://course-preview-s20.herokuapp.com/user_refresh_token/" +trial_token;
      fetch(fetch_refresh_link,{
        method: 'GET',
        headers:{
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'

        }
      }).then(res => {
        //Get the Promise
        return res.json();
      }).then(res=>{
        //Get the object return from the Promise
        return getLatandLog(res,route_id);
      }).catch(error => console.log("reAuthorize error",error));
    }

    }

    catch (err){
      console.log(err);
      //If something goes wrong
    }
  }

  //Run this functionality when on the strava's authorization page
  else if (window.location.href.includes("oauth")){

  }
  //Run this functionality when users are sent to the redirect page after authorizing
  else if (window.location.href.includes("www.google.com")){
    // we want to extract the auth token with the read_all access from the url
    const url_credentials = window.location.href;
    const start_index = url_credentials.indexOf("code") + 5;
    const end_index = url_credentials.indexOf("&scope");
    const code = url_credentials.slice(start_index, end_index);
    // we can then use this code to get our refresh token
    //set the user response token to be used in the future -> later set to session storage
    chrome.storage.local.set({'user_response_token': code});

    // this gets us the refresh token
    getRefreshToken(code);

    // This sets the users refresh token
    async function getRefreshToken(userAccess_value){
      // this gets us the refresh token
      const trial_token = await reAuthorize(userAccess_value).then(res => res); // this is what should only be done once
    }

    // we use reAuth to get the refresh token that we eventually use to get auth token to get latlng
    async function reAuthorize(user_access_value){
      const fetch_access_link = "https://course-preview-s20.herokuapp.com/user_access_token/" + user_access_value;
      fetch(fetch_access_link,{
        method: 'GET',
        headers:{
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      }).then(res => {
        //Get the Promise
        return res.json();
      }).then(rjson=>{
        //Get the object return from the Promise
        const refresh_token = rjson.refresh_token;
        chrome.storage.local.set({'refresh_token': refresh_token});
        // here we could set the user_response_token to '' because it will eventually expire --> are there any
        // code consequences / dependencies rn?
        chrome.storage.local.set({'user_response_token': ''});
        sessionStorage.setItem("user_response_token", '');
        window.location.replace('https://www.strava.com/athlete/routes');
        return refresh_token;
      }).catch(error => console.log("reAuthorize error",error));
    }


  }
