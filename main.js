
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
const CLIENT_ID = '37c2aa28-5ee4-458a-a4ae-d655103e5fc0'; ///'202478fd-e993-4321-ba71-f4815e9a1503';

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
           console.log(userDetails.id);
        const userVal = userDetails.id

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


function createChannel() {
  $.ajax({
      url: `https://api.${ENVIRONMENT}/api/v2/notifications/channels`,
      type: "POST",
      async: true,
      beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', 'bearer ' + token);
      },
      success: function (result, status, xhr) {
          console.log(result);

          const obj = JSON.parse(JSON.stringify(result));
          channelDetails.connectUri = obj.connectUri;
          channelDetails.id = obj.id;

          try {
              getUserPresence(userDetails.id);
          } catch (error) {
              console.log("error in catch createChannel(), reauth!");

              reAuth();
          }

      },
      error: function (result, status, xhr) {
          console.log(result);
          console.log(status);
          reAuth();

      }
  });
}
function getUserPresence(userId) {

  if (userDetails.id == null) {
      console.log("No user id found, reauth");
      reAuth();
  } else {
      $.ajax({
          url: `https://api.${ENVIRONMENT}` + "/api/v2/users/" + userId + "/presences/purecloud",
          type: "GET",
          contentType: 'application/json',
          dataType: 'json',
          async: true,
          beforeSend: function (xhr) {
              xhr.setRequestHeader('Authorization', 'bearer ' + token);
          },
          success: function (result, status, xhr) {
              console.log(result);
              const obj = JSON.parse(JSON.stringify(result));
              var presence = obj.presenceDefinition.systemPresence;
              console.log(presence);
              if (presence == "OFFLINE" || presence == "Offline") {
                  setTimeout(function () {
                      getUserPresence(userId)
                  }, 5000);
              } else {
                  console.log("Start userConversationListener");
                  //addUserConversationListener(channelDetails.id);
              }

          },
          error: function (result, status, xhr) {
              console.log(result);
              console.log(status);
              reAuth();

          }
      });
  }
}

function fetchData() {
    return new Promise(function(resolve, reject) {
        // Make AJAX request
        $.ajax({
            url: `https://api.${ENVIRONMENT}/api/v2/flows/datatables/5aad1395-dd31-4b3d-98d0-e93eef5d92c9/rows?showbrief=false&sortOrder=ascending`,
            type: "GET",
            contentType: 'application/json',
            dataType: 'json',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'bearer ' + token);
            },
            success: function(result, status, xhr) {
                console.log(result);
                // Resolve promise with result
                resolve(result);
            },
            error: function(result, status, xhr) {
                console.log(result);
                // Reject promise with error
                reject(result);
            }
        });
    });
}

// Function to generate table header
// Function to generate table header
// Function to generate table header
function generateTableHeader() {
    var headerRow = document.getElementById("table-header");
    headerRow.innerHTML = ""; // Clear existing header content
    
    // Add "Orbit" column header as the leftmost column
    var thOrbit = document.createElement("th");
    thOrbit.textContent = "Orbit";
    headerRow.appendChild(thOrbit);
    
    // Add headers for other columns
    var keys = Object.keys(jsonResponse.entities[0]);
    keys.forEach(function(key) {
        if (key !== "key") { // Skip the original "key" column
            var th = document.createElement("th");
            th.textContent = key.toUpperCase();
            headerRow.appendChild(th);
        }
    });
    // Add extra column header for the action button
    var thButton = document.createElement("th");
    thButton.textContent = "ACTION";
    headerRow.appendChild(thButton);
}

// Function to generate table body
function generateTableBody() {
    var tbody = document.getElementById("table-body");
    tbody.innerHTML = ""; // Clear existing tbody content
    
    jsonResponse.entities.forEach(function(rowData, index) {
        var tr = document.createElement("tr");
        
        // Add "Orbit" column data as the leftmost column
        var tdOrbit = document.createElement("td");
        tdOrbit.textContent = rowData.key;
        tr.appendChild(tdOrbit);
        
        // Add data for other columns
        Object.entries(rowData).forEach(function([key, value]) {
            if (key !== "key") { // Skip the original "key" column
                var td = document.createElement("td");
                td.textContent = value;
                tr.appendChild(td);
            }
        });
        
        // Add button column with "Pick up" button
        var tdButton = document.createElement("td");
        var button = document.createElement("button");
        button.textContent = "Pick up";
        // Attach event listener to "Pick up" button
        button.addEventListener("click", function() {
            // Call the "Update Table" function with the rowData
            updateTable(rowData);
        });
        tdButton.appendChild(button);
        tr.appendChild(tdButton);
        
        tbody.appendChild(tr);
    });
}

// Event listener for "Get Data" button click
document.getElementById("getDataBtn").addEventListener("click", function() {
    fetchData()
        .then(function(data) {
            jsonResponse = data; // Update jsonResponse with fetched data
            generateTableHeader();
   
            generateTableBody();
        })
        .catch(function(error) {
            console.error("Error fetching data:", error);
        });
});

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

// Function to update table with selected row data
// Function to update table with selected row data
function updateTable(selectedRowData) {
    // Implement your logic to update the table with the selected row data
    console.log("Selected Row Data:", selectedRowData);
    return new Promise(function(resolve, reject) {
        // Make AJAX request to update the table row
        $.ajax({
            url: `https://api.${ENVIRONMENT}/api/v2/flows/datatables/5aad1395-dd31-4b3d-98d0-e93eef5d92c9/rows/1`,
            type: "PUT",
            contentType: 'application/json',
            data: JSON.stringify({
               	  "WaitingInteraction1-ANI": "+19522107622",
                  "WaitingInteraction1": "5aad1395-dd31-4b3d-98d0-e93eef5d92c9",
                  "WaitingInteraction-TransferTarget": "8ce2f903-78e6-4b50-b7aa-e1aa7e7c39ac",
                  "WaitingInteraction-Indicator": "Ready",
                  "key": "1"
            }),
            dataType: 'json',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'bearer ' + token);
            },
            success: function(result, status, xhr) {
                console.log(result);
                // Resolve promise with result
                resolve(result);
                // After updating the table, fetch data again to refresh the table
                fetchData()
                    .then(function(data) {
                        jsonResponse = data;
                        generateTableHeader();
                        generateTableBody();
                    })
                    .catch(function(error) {
                        console.error("Error fetching data:", error);
                    });
            },
            error: function(result, status, xhr) {
                console.log(result);
                // Reject promise with error
                reject(result);
            }
        });
    });
}


// Event listener for "Get Data" button click
document.getElementById("getDataBtn").addEventListener("click", function() {
    fetchData()
        .then(function(data) {
            jsonResponse = data; // Update jsonResponse with fetched data
            generateTableHeader();
            generateTableBody();
        })
        .catch(function(error) {
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
