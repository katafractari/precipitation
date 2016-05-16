'use strict';

var request = require('request-promise');
var xml2js = require('xml2js');
var config = require('config');

var Datastore = require('nedb')
    , db = new Datastore({ filename: config.get('db.filename'), autoload: true });

var processResponse = function (response, location) {
    xml2js.parseString(response, function (err, result) {
        if (err) {
            console.error(err);
        }

        var totalPrecipitation = calculateTotalPrecipitation(result);
        var data = {
            totalPrecipitation: totalPrecipitation 
        };
        
        db.findOne({ _id: location._id }, function (err, doc) {
            if(!doc.name || !doc.lat || !doc.lon) {
                data.name = result.data.metData[0].domain_longTitle[0];
                data.lat = parseFloat(result.data.metData[0].domain_lat[0]);
                data.lon = parseFloat(result.data.metData[0].domain_lon[0]);
            }
            console.log(data);
            db.update(
                { _id: location._id },
                { $set: data },
                { upsert: true }
            );
        });
    })
};

var calculateTotalPrecipitation = function (input) {
    return input.data.metData.reduce(function (memo, obj) {
/*        console.log(obj.domain_longTitle + " val: " + obj.rr_val[0]);*/
        var ml = parseFloat(obj.rr_val[0]);
        return memo + (isNaN(ml) ? 0 : ml);
    }, 0);
};

db.find({}, function (err, docs) {
    docs.forEach(function(doc) {
        request(doc.url)
            .then(function(response) { processResponse(response, doc) })
            .catch(function (err) {
                throw err;
            });
    });
});
