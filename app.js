// Variables

var map;


var l = $('.js-city').val() + " " + $('.js-state').val();


var date = (new Date()).toString().split(' ').splice(1, 3).join(' ');

document.write(date)

// Initialize Map

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8
    });
}


// Search and API Request

function getDataFromAPI() {
    // Clear Results
    $('.js-search-results').html('');
    $('.js-buttons').html('');

    // Get Form Input
    var l = $('.js-city').val() + " " + $('.js-state').val();

    // Run GET Request on API
    $.ajax({
            url: "http://api.eventful.com/json/events/search",
            type: "GET",
            data: {
                app_key: "tFtdmL78mXSFFmd6",
                q: "music",
                l: l,
                t: date,
                crossDomain: true
            },

            headers: {
                //"Origin": "localhost",
                "Access-Control-Allow-Origin": "*"
            }
            //dataType: 'json'

        },

        function(data) {
            // Log Data
            console.log(data);

            $.each(data.items, function(i, item) {
                // Get Output
                var output = getOutput(item);

                // Display Results
                $('.js-search-results').append(output);
            });

        }
    );
}

//Render Functions

//Build Output
function getOutput(item) {
    var eventID = item.id;
    var title = item.title;
    var eventUrl = item.url;
    var description = item.description;
    var eventStart = item.start_time;
    var venueName = item.venue_name;
    var venueAddress = item.venue_address;
    var venueURL = item.venue_url;


    // Build Output String

    var output = `<li>
  <div class="list-left">
  <a href="http://eventful.com/events?url=${eventUrl}">
  </a>
  <a href="http://eventful.com/events?venue_url=${venueURL}">
  </a>
  </div>
  <div class="list-right"> 
  <h2>${title}</h2>
  <h3>${venueName}</h3>
  <h3>${venueAddress}</h3>
  <small>${eventStart}</small>
  <p>${description}</p>
  </div>
  </li>
  <div class="clearfix"></div>`;


    return output;
}



$('document').ready(function() {
    //searchFormAnimations();
    $('.js-search-button').on('click', getDataFromAPI);
})
