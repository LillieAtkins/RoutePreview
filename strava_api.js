// From tutorial: https://www.youtube.com/watch?v=W_-Ai33_8f8
const auth_link = "https://www.strava.com/oauth/token"

function getActivities(res){
  const activities_link = `https://www.strava.com/api/v3/athlete/activities?access_token=${res.access_token}`

  fetch(activities_link).then((res) => console.log(res.json()))
}


function getRouteStream(res, routeID){
  //const route_link = `https://www.strava.com/api/v3/routes/${routeID}/streams?access_token=b318e4958ea1e81f4058d4c62c83ae1a9313d36c`

  const route_link = `https://www.strava.com/api/v3/routes/${routeID}/streams?access_token=${res.access_token}`

  fetch(route_link).then((res) => console.log(res.json()))
}


function reAuthorize(){
    fetch(auth_link,{
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'

        },

        body: JSON.stringify({
            client_id: '44955',
            client_secret: '5579411a2bb89908341e9a0defe536ce9a9768b8',
            refresh_token: '08b186a3ae69e8c916c93a3d547790b818682080',
            grant_type: 'refresh_token'
        })
    })
    .then(res => res.json())
      .then(res => getRouteStream(res,22220451 ))

}
reAuthorize();
//getRouteStream(22220451);
