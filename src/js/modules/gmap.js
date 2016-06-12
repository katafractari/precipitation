'use strict';

// Center on Ljubljana
var latitude = 46.0569;
var longitude = 14.5058;

function getMarkerImage(totalPrecipitation) {
    return 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2238%22%20height%3D%2238%22%20viewBox%3D%220%200%2038%2038%22%3E%3Cpath%20fill%3D%22%23'
        + getMarkerPinColor(totalPrecipitation) + '%22%20stroke%3D%22%23ccc%22%20stroke-width%3D%22.5%22%20d%3D%22M34.305%2016.234c0%208.83-15.148%2019.158-15.148%2019.158S3.507%2025.065%203.507%2016.1c0-8.505%206.894-14.304%2015.4-14.304%208.504%200%2015.398%205.933%2015.398%2014.438z%22%2F%3E%3Ctext%20transform%3D%22translate%2819%2018.5%29%22%20fill%3D%22%23fff%22%20style%3D%22font-family%3A%20Arial%2C%20sans-serif%3Bfont-weight%3Abold%3Btext-align%3Acenter%3B%22%20font-size%3D%2212%22%20text-anchor%3D%22middle%22%3E'
        + totalPrecipitation + '%3C%2Ftext%3E%3C%2Fsvg%3E';
}

function getMarkerPinColor(totalPrecipitation) {
    if (totalPrecipitation == 0) return "228B22";
    else if (totalPrecipitation < 25) return "3090C7";
    return "808080";
}

exports.init = function () {
    var map;
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: latitude, lng: longitude},
        zoom: 9
    });

    $.getJSON('/api/locations', function (data) {
        data.forEach(function(location) {
            if(location.lat && location.lon) {
                new google.maps.Marker({
                    map: map,
                    title: location.name + ', ' + location.totalPrecipitation + ' l/m²',
                    position: {lat: location.lat, lng: location.lon},
                    icon: getMarkerImage(location.totalPrecipitation)
                });
            }
        });
    });
};
