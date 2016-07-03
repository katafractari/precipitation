'use strict';

var async = require('async');
var request = require('request-promise');
var xml2js = require('xml2js');
var fs = require('fs');

var processResponse = function (response, location, callback) {
winston.log('info', 'Processing location data for ' + location._id);
    xml2js.parseString(response, function (err, result) {
        if (err) {
            console.error(err);
        }

        if(!result) {
            winston.log('error', 'Error processing location data for ' + location._id);
            fs.writeFile("/tmp/" + location._id + ".xml", response, function(err) {
                if(err) {
                    return console.log(err);
                }
            });
            return;
        }

        var totalPrecipitation = calculateTotalPrecipitation(result);
        var data = {
            totalPrecipitation: Math.round(totalPrecipitation)
        };
        
        db.findOne({ _id: location._id }, function (err, doc) {
            if(!doc.name || !doc.lat || !doc.lon) {
                data.name = result.data.metData[0].domain_longTitle[0];
                data.lat = parseFloat(result.data.metData[0].domain_lat[0]);
                data.lon = parseFloat(result.data.metData[0].domain_lon[0]);
            }
            db.update(
                { _id: location._id },
                { $set: data },
                { upsert: true },
                callback
            );
        });
    })
};

var calculateTotalPrecipitation = function (input) {
    return input.data.metData.reduce(function (memo, obj) {
        var ml = parseFloat(obj.rr_val[0]);
        return memo + (isNaN(ml) ? 0 : ml);
    }, 0);
};

var update = function() {
    db.find({}, function (err, docs) {
        async.forEachSeries(docs, function(doc, callback) {
            request(doc.url)
                .then(function (response) {
                    processResponse(response, doc, callback)
                })
                .catch(function (err) {
                    throw err;
                });
        });
    });
};

module.exports.update = update;
