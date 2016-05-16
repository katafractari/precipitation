'use strict';

var config = require('config');
var Datastore = require('nedb')
    , db = new Datastore();

describe('Datastore Test', function() {
    describe('Location upsert', function() {
        it('only contains 1 document after 2 upserts', function(done) {
            var id = "AJDOV-INA_DOLENJE";
            var totalPrecipitation = 0.1;
            db.insert({ 
                _id: id, 
                url: "http://test.com" 
            },
                function(err, doc) {
                    console.log(doc)
                    db.update(
                        { _id: id },
                        { $set: { totalPrecipitation: 0.9 }},
                        { upsert: true },
                        function checkResult(err, numReplaced) {
                            console.log(numReplaced);
                            db.find({ _id: id }, function (err, docs) {
                                expect(docs.length).toBe(1);
                                expect(docs[0].totalPrecipitation).toBe(1);
                                console.log(docs[0])
                                done();
                            });
                        }
                    );
                }
            );
        });
    });
});