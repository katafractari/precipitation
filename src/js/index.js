var $ = require('jQuery');
var gapi = require('./modules/gapi');
var location = require('./modules/gmap');

gapi.load( function () {
    location.init();
});