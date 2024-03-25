
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

// Function to fetch data from an API (Replace this with your actual function)
function fetchData() {
    // Simulating fetching data from an API
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

// Function to generate table header
function generateTableHeader() {
    var headerRow = document.getElementById("table-header");
    var keys = Object.keys(jsonResponse.entities[0]);
    keys.forEach(function(key) {
        var th = document.createElement("th");
        th.textContent = key.toUpperCase();
        headerRow.appendChild(th);
    });
    // Add extra column header for the button
    var thButton = document.createElement("th");
    thButton.textContent = "ACTION";
    headerRow.appendChild(thButton);
}

// Function to generate table body
function generateTableBody() {
    var tbody = document.getElementById("table-body");
    tbody.innerHTML = ""; // Clear existing tbody content
    jsonResponse.entities.forEach(function(rowData) {
        var tr = document.createElement("tr");
        Object.values(rowData).forEach(function(value) {
            var td = document.createElement("td");
            td.textContent = value;
            tr.appendChild(td);
        });
        // Add button column with "Pick up" button
        var tdButton = document.createElement("td");
        var button = document.createElement("button");
        button.textContent = "Pick up";
        tdButton.appendChild(button);
        tr.appendChild(tdButton);
        tbody.appendChild(tr);
    });
}

// Event listener for "Get Data" button click
document.getElementById("getDataBtn").addEventListener("click", function() {
    fetchData().then(function(data) {
        jsonResponse = data; // Update jsonResponse with fetched data
        generateTableHeader();
        generateTableBody();
    }).catch(function(error) {
        console.error("Error fetching data:", error);
    });
});

// Initial generation of table on page load
var jsonResponse = {
    "entities": [], // Empty initially
    "pageSize": 25,
    "pageNumber": 1,
    "total": 0,
    "pageCount": 0
};
generateTableHeader();
generateTableBody();

