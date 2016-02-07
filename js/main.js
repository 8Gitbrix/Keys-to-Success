$(function() {
    var places = $('.places');
    var counter = 2;

    var map = marker = infoWindow = null;
    var defaultCenter = [40.151127, -74.6521];
    var userCenter = [];
    var markers = [];

    $('.another-one').on('click', function(e) {
        e.preventDefault();
        places.append('<label for="place' + counter + '">Place ' + counter + '</label><input id="place'  + counter + '" placeholder="Place ' + counter + '" type="text">');
        counter++;
    });

    $('.submit').on('click', function(e) {
        e.preventDefault();

        var inputs = places.find('input');

        var arr = [];

        for (var i = 0; i < inputs.length; i++) {
            arr.push($(inputs.get(i)).val());
        }

        getUserLocation(arr);
    });

    function getUserLocation(arr) {
        if (window.navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                userCenter[0] = position.coords.latitude;
                userCenter[1] = position.coords.longitude;
                initialize(arr);
            }, function() {
                initialize(arr);
            });
        }
    }

    function addMarker(placeName) {
        var lat = lng = 0;

        marker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(lat, lng),
            title: placeName
        });

        markers.push(marker);

        infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', (function(marker) {
            return function() {
                infoWindow.setContent('<div class="infowindow"><h1>' + placeName + '</h1></div>');
                infoWindow.open(map, marker);
            }
        })(marker));
    }

    function codeAddress(address) 
    {
    geocoder.geocode( {address:address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) 
    {
        map.setCenter(results[0].geometry.location);//center the map over the result
        //place a marker at the location
        var marker = new google.maps.Marker(
        {
            map: map,
            position: results[0].geometry.location
        })
        markers.push(marker);

    } else 
    {
        alert('Geocode was not successful for the following reason: ' + status);
    }
    });
    }

    function initialize(arr) {

        var mapOptions = null;

        if (userCenter.length !== 0) {
            mapOptions = {
                zoom: 14,
                center: new google.maps.LatLng(userCenter[0], userCenter[1])
            };
        } else {
            mapOptions = {
                zoom: 8,
                center: new google.maps.LatLng(defaultCenter[0], defaultCenter[1])
            };
        }

        map = new google.maps.Map(document.getElementById('map'), mapOptions);

        for (var i = 0; i < arr.length; i++) {
            geocoder = new google.maps.Geocoder();
            codeAddress(arr[i]);
        }
    }


});
