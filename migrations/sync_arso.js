'use strict';

var config = require('config');
var util = require('util');
var Xray = require('x-ray'),
    x = Xray();
var Datastore = require('nedb')
    , db = new Datastore({ filename: config.get('db.filename'), autoload: true });

var updateLocation = function(id) {
    db.findOne({ _id: id }, function (err, doc) {
        if(err) {
            throw err;
        }

        var url = util.format(config.get('dataUri'), id);
        if(doc) {
            db.update({ _id: id }, {
                $set: { 
                    url: url 
                }
            }, { upsert: true });
        } else {
            db.insert({
                _id: id,
                url: url
            });
        }
    });
};

x(config.get('locationsUrl'), 'table.meteoSI-table', ['a@href'])(function (err, links) {
    if(err) {
        throw err;
    }
    links.forEach(link => {
        var match = link.match(/observationAms_(.*)_history/);
        if(match) {
            updateLocation(match[1]);
        }
    });
});

