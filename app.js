'use strict';

var config = require('config');
var schedule = require('node-schedule');
var util = require('util');
var express = require('express');
var precipitation = require('./src/js/modules/precipitation');
var Datastore = require('nedb');
global.db = new Datastore({ filename: config.get('db.filename'), autoload: true });
global.winston = require('winston');

// Update precipitation task
schedule.scheduleJob('0 * * * *', function(){
    precipitation.update();
});

var app = express();
app.use(express.static('public'));

app.get('/api/locations', function(req, res) {
    db.find({}, function(err, docs) {
        res.send(docs);
    });
});

app.listen(config.get('api.port'), function() {
    winston.log('info', util.format('Magic happening at port %d', config.get('api.port')));
});




