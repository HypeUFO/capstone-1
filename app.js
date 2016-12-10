// Variables


var l = $('.js-city').val() + " " + $('.js-state').val();


/*var date = (new Date()).toString().split(' ').splice(1, 3).join(' ');

document.write(date)*/

// Initialize Map
var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
}

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
        // Log Data
        console.log(data.events);

        $.each(data.events.event, function(i, item) {
            // Get Output
            var output = getOutput(item);

            // Display Results
            $('.js-search-results').append(output);
        });

    });
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
        $('.search-section').hide();
        $('.new-search').show(500);
    });
    $('.js-new-search-button').on('click', function() {
        $('.new-search').hide(500);
        $('.search-section').show(500);
    });

}



$('document').ready(function() {

    //searchFormAnimations();
    $('.js-search-button').on('click', getDataFromAPI);
    handleSearchToggle();

})
