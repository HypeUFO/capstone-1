// Initialize Map

var map;

function initMap() {
    var latlng = new google.maps.LatLng(-34.397, 150.644);
    var mapOptions = {
        zoom: 0,
        center: latlng
    }
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

// Get Data From Eventful API

function getDataFromAPI() {
    $(".loader").show();
    // Clear Results
    $('.js-search-results').html('');
    $('#map').html('');

    // Get Form Input
    var l = $('#js-city').val(); //+ " " + $('#js-state').val();

    // Run GET Request on API
    $.ajax({
        url: "https://api.eventful.com/json/events/search",
        type: "GET",
        data: {
            app_key: "tFtdmL78mXSFFmd6",
            q: "music",
            l: l,
            t: "Today",
            page_size: 25,
            sort_order: "popularity",
            category: "music, concert, nightlife"

        },
        crossDomain: true,
        dataType: 'jsonp'
    }).then(function(data) {
        $(".loader").hide("fast");

        // Log Data
        console.log(data);
        initialize(data);

        // $.each(data.events.event, function(i, item) {
            for (let i=0; i < data.events.event.length; i++) {

            // Get Output
            var output = getOutput(data.events.event[i]);

            // Display Results
            $('.js-search-results').append(output);
            }

        });
    //})
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
    var eventImage = item.image ? item.image.medium.url : '';
    var description = item.description;
    var eventStart = convert(item.start_time);
    var venueName = item.venue_name;
    var venueAddress = item.venue_address + ", " + item.city_name + " " + item.region_abbr;
    var venueURL = item.venue_url;
    var eventLat = item.latitude;
    var eventLng = item.longitude;

    // Build Output String
    var output = `<li>
  <div class="list-left">
  <img src="${eventImage}" alt="Event Image">
  </div>
  <div class="list-right">
  <p>
  <a href="${eventURL}" target="_blank">${title}</a><br>
  ${venueName}<br>
  <a href="http://maps.google.com/?q=${venueAddress}" target="_blank">${venueAddress}</a><br>
  ${eventStart}
  </p>
  </div>
  </li>
  <div class="clearfix"></div>`;

    return output;
}

// Build Map
function displayMarkers(data) {
    var markersData = data.events.event;

    var bounds = new google.maps.LatLngBounds();

    for (var i = 0; i < markersData.length; i++) {

        var venueURL = markersData[i].venue_url;
        var eventLat = markersData[i].latitude;
        var eventLng = markersData[i].longitude;
        var description = markersData[i].description;
        var eventStart = convert(markersData[i].start_time);
        var venueName = markersData[i].venue_name;
        var postalCode = markersData[i].postal_code;


        var latlng = new google.maps.LatLng(markersData[i].latitude, markersData[i].longitude);
        var title = markersData[i].title;
        var venueAddress = markersData[i].venue_address + ", " + markersData[i].city_name + " " + markersData[i].region_abbr;

        createMarker(latlng, title, venueName, venueAddress, postalCode, description, venueURL);

        bounds.extend(latlng);
    }
    map.fitBounds(bounds);
}


function createMarker(latlng, title, venueName, venueAddress, postalCode, description, venueURL) {
    var marker = new google.maps.Marker({
        map: map,
        position: latlng,
        title: title,
        animation: google.maps.Animation.DROP
    });

    var clicked = false;

    google.maps.event.addListener(marker, "mouseover", function(e) {
        if (!clicked) {
            var iwContent = `<div><strong>${title}</strong><br><strong>@${venueName}</strong><br>${venueAddress} ${postalCode}</div>`;
            infoWindow.setContent(iwContent);
            infoWindow.open(map, marker);
        }
    });
    google.maps.event.addListener(marker, "mouseout", function(e) {
        if (!clicked) {
            infoWindow.close();
        }
    });

    google.maps.event.addListener(marker, "click", function(e) {
        clicked = true;
        var iwContent = `<div><strong>${title}</strong><br><a href="${venueURL}"><strong>@${venueName}</strong></a><br><a href="http://maps.google.com/?q=${venueAddress}">${venueAddress}</a><br>${description}</div>`;
        infoWindow.setContent(iwContent);
        infoWindow.open(map, marker);
    });
    google.maps.event.addListener(infoWindow, 'closeclick', function(e) {
        clicked = false;
    })
}

function initialize(data) {
    var mapOptions = {
        center: new google.maps.LatLng(40.601203, -8.668173),
        zoom: 9,
        mapTypeId: 'roadmap',
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    infoWindow = new google.maps.InfoWindow();

    google.maps.event.addListener(map, 'click', function() {
        infoWindow.close();
    });

    displayMarkers(data);
}

// Show/Hide Search Form
function handleSearchToggle() {
    $('.js-search-button').on('click', function() {
        $('.js-search-results').show(500);
        $('.search-section').hide();
        $('.banner').show(500);
        $('.new-search-button').show(500);
        $('.logo').show(500);
        $('.landing').hide(500);
    });
    $('.js-new-search-button').on('click', function() {
        $('.new-search-button').hide(500);
        $('.search-section').show(500);
        $('.landing').show(500);
    });
}

function handleMap() {
    $('.js-search-button').on('click', function() {
        $('#map').show();
    });
}

// Execute
$('document').ready(function() {
    $(window).load(function() {
        $(".loader").fadeOut("slow");
    })
    $('.js-search-button').on('click', function(event) {
        event.preventDefault();
        getDataFromAPI();
    })
    handleSearchToggle();
    handleMap();
})
