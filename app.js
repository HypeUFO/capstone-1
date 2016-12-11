// Variables


var l = $('.js-city').val() + " " + $('.js-state').val();


/*var date = (new Date()).toString().split(' ').splice(1, 3).join(' ');

document.write(date)*/

// Initialize Map

  var geocoder;
  var map;

  function initMap() {
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(-34.397, 150.644);
    var mapOptions = {
      zoom: 0,
      center: latlng
    }
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  /*function codeAddress() {
    var address = document.getElementById('js-city').value + document.getElementById('js-state').value;
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == 'OK') {
        map.setCenter(results[0].geometry.location);
        map.setZoom(8);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }
*/
// Get Data From Eventful API

function getDataFromAPI() {
    // Clear Results
    $('.js-search-results').html('');
    $('.js-buttons').html('');

    // Get Form Input
    var l = $('#js-city').val() + " " + $('#js-state').val();

    // Run GET Request on API
    $.ajax({
        url: "http://api.eventful.com/json/events/search",
        type: "GET",
        data: {
            app_key: "tFtdmL78mXSFFmd6",
            q: "music concert",
            l: l,
            t: "Today",
            page_size: 25,
            sort_order: "popularity",
            category: "music, concert"

        },
        crossDomain: true,
        dataType: 'jsonp'
    }).then(function(data) {
      console.log(data.events);
      // Creating a global infoWindow object that will be reused by all markers
      var infoWindow = new google.maps.InfoWindow();
      $.each(data.events.event, function(i, item) {
    var address = item.venue_address;
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == 'OK') {
        map.setCenter(results[0].geometry.location);
        map.setZoom(10);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
      (function(marker, data) {

        // Attaching a mouseover event to the current marker
        google.maps.event.addListener(marker, "mouseover", function(e) {
          infoWindow.setContent('<div><strong>' + item.title + '</strong><br>' + '<strong> @' + item.venue_name + '</strong><br>' + item.description + '</div>');
          infoWindow.open(map, marker);

          
        });


      })(marker, data);

      google.maps.event.addListener(marker, "mouseout", function(e) {
          infoWindow.close();
        });

    });
  }).then(function(data) {
        // Log Data
        console.log(data.events);

        $.each(data.events.event, function(i, item) {
            // Get Output
            var output = getOutput(item);

            // Display Results
            $('.js-search-results').append(output);
        });

    })
  })
}

function convert(input) {
    return moment(input, 'HH:mm:ss').format('h:mm A');
}


//Render Functions

//Build Output

function getOutput(item) {
    var eventID = item.id;
    var title = item.title;
    var eventURL = item.url;
    var eventImage = item.image.medium.url;
    var description = item.description;
    var eventStart = convert(item.start_time);
    var venueName = item.venue_name;
    var venueAddress = item.venue_address + ", " + item.city_name + " " + item.region_abbr;
    //+ " " + item.postal_code;
    var venueURL = item.venue_url;
    var eventLat = item.latitude;
    var eventLng = item.longitude;


    // Build Output String

    var output = `<li>
  <div class="list-left">
  <img src="${eventImage}" alt="Event Image">
  </div>
  <div class+"list-right">
  <p>${title}<br>
  ${venueName}<br>
  ${venueAddress}<br>
  ${eventStart}
  </p>
  </div>
  </li>
  <div class="clearfix"></div>`;

    return output;
}

function handleSearchToggle() {
    $('.js-search-button').on('click', function() {
        $('.js-search-results').show(500);
        $('.search-section').hide(500);
        $('.new-search').show(500);
        $('.new-search-button').show(500);
    });
    $('.js-new-search-button').on('click', function() {
        $('.new-search-button').hide(500);
        $('.search-section').show(500);
    });

}



$('document').ready(function() {

    //searchFormAnimations();
    $('.js-search-button').on('click', getDataFromAPI);
    handleSearchToggle();

})
