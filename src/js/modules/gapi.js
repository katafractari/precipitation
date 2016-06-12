var jsonp = require('./jsonp');

var gapiurl = 'http://maps.googleapis.com/maps/api/js?key=AIzaSyCb3jRarIdj_6UYECUgZKc9z7PM1P0P_UU&callback=__googleMapsApiOnLoadCallback';

exports.load = function (done) {
    jsonp(gapiurl, '__googleMapsApiOnLoadCallback', done);
};