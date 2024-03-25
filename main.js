
var userDetails = {

  email: null,
  id: null,
  name: null,
  username: null
}
var channelDetails = {

  connectUri: null,
  id: null,
  expires: null
}
const getConversationsResponse = {

  entities: null,
  total: null
}
var conversationDetails = {

  participant: null,
  participant2: null,
  conversationId: null
}

if (document.readyState === "complete") {
  // Fully loaded!


} else if (document.readyState === "interactive") {
  // DOM ready! Images, frames, and other subresources are still downloading.
} else {
  // Loading still in progress.
  // To wait for it to complete, add "DOMContentLoaded" or "load" listeners.

  window.addEventListener("DOMContentLoaded", () => {
      // DOM ready! Images, frames, and other subresources are still downloading.

  });

  window.addEventListener("load", () => {
      // Fully loaded!

      createChannel();
  });
}
// Obtain a reference to the platformClient object
const platformClient = require('platformClient');

// Implicit grant credentials
const CLIENT_ID = 37c2aa28-5ee4-458a-a4ae-d655103e5fc0'; ///'202478fd-e993-4321-ba71-f4815e9a1503';

// Genesys Cloud environment
const ENVIRONMENT = 'usw2.pure.cloud';

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\#&]" + name + "=([^&#]*)"),
  results = regex.exec(location.hash);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

if (window.location.hash) {
  console.log(location.hash);
  token = getParameterByName('access_token');

  $.ajax({
      url: `https://api.${ENVIRONMENT}/api/v2/users/me`,
      type: "GET",
      beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', 'bearer ' + token);
      },
      success: function (result, status, xhr) {

          const obj = JSON.parse(JSON.stringify(result));

          userDetails.email = obj.email;
          userDetails.id = obj.id;
          userDetails.name = obj.name;
          userDetails.username = obj.username;

      }
  });

  location.hash = ''

} else {
  var queryStringData = {
      response_type: "token",
      client_id: CLIENT_ID,
      redirect_uri: "https://stoltenbergpeter.github.io/call-orbit/index.html"
  }
  window.localStorage.clear();

  console.log(`https://login.${ENVIRONMENT}/oauth/authorize?` + jQuery.param(queryStringData));
  window.location.replace(`https://login.${ENVIRONMENT}/oauth/authorize?` + jQuery.param(queryStringData));
}

function reAuth() {

  var queryStringData = {
      response_type: "token",
      client_id: CLIENT_ID,
      redirect_uri: "https://stoltenbergpeter.github.io/call-orbit/index.html"
  }
  window.localStorage.clear();

  window.location.replace(`https://login.${ENVIRONMENT}/oauth/authorize?` + jQuery.param(queryStringData));
}
function executeworkflowB() {
        $.ajax({
            url: `https://api.${ENVIRONMENT}/api/v2/flows/datatables/5aad1395-dd31-4b3d-98d0-e93eef5d92c9/rows?showbrief=false&sortOrder=ascending`, 
            type: GET",
            contentType: 'application/json',
            dataType: 'json',
            async: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'bearer ' + token);
            },
            success: function (result, status, xhr) {
                console.log(result);
  
                const obj = JSON.parse(JSON.stringify(result));
  
  
            },
            error: function (result, status, xhr) {
                console.log(result);
                var obj = JSON.parse(JSON.stringify(result));
                console.log(obj);
                console.log(status);
                //reAuth();
  
            }
        });
    }
function executeworkflowA() {
        $.ajax({
            url: `https://api.${ENVIRONMENT}/api/v2/flows/datatables/5aad1395-dd31-4b3d-98d0-e93eef5d92c9/rows?showbrief=false&sortOrder=ascending`, 
            type: "POST",
            contentType: 'application/json',
            dataType: 'json',
            async: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'bearer ' + token);
            },
            success: function (result, status, xhr) {
                console.log(result);
  
                const obj = JSON.parse(JSON.stringify(result));
  
  
            },
            error: function (result, status, xhr) {
                console.log(result);
                var obj = JSON.parse(JSON.stringify(result));
                console.log(obj);
                console.log(status);
                //reAuth();
  
            }
        });
    }

