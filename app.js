'use strict';

var config = require('config');
var util = require('util');
var express = require('express');
var Datastore = require('nedb')
    , db = new Datastore({ filename: config.get('db.filename'), autoload: true });

var app = express();
app.use(express.static('.'));

app.get('/api/locations', function(req, res) {
    db.find({}, function(err, docs) {
        res.send(docs);
    });
});

app.listen(config.get('api.port'), function() {
    console.log(util.format('Magic happening at port %d', config.get('api.port')));
});




