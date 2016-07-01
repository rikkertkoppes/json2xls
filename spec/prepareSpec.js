var json2xls = require('../lib/json2xls');
var prep = json2xls.prepareJson;
var arrayData = require('./arrayData.json');
var objectData = require('./objectData.json');
var weirdData = require('./weirdData');

describe('prepare',function() {

    beforeEach(function() {
        this.addMatchers({
            toEqualFields: function() {
                return {
                    compare: function(actual,expected) {
                        var res;
                        var res = expected && expected.all && expected.all(function(item,i) {
                            return actual[i] && Object.keys(item).all(function(field) {
                                return actual[i][field] === item[field];
                            });
                        })
                        return {
                            pass: res
                        }
                    }
                }
            }
        })
    })

    describe('handling illegal xml characters', function() {
        it('should remove vertical tabs',function() {
            var res = prep(weirdData);
            expect(res.rows[0][1]).toEqual(' foo bar ');
        });
    });

    describe('when the data is an empty array', function() {
        it('should create an empty config', function() {
            var res = prep([]);
            expect(res.cols).toEqual([]);
            expect(res.rows).toEqual([]);
        });
    });

    describe('when the data is an empty object', function() {
        it('should create a config with one empty row', function() {
            var res = prep({});
            expect(res.cols).toEqual([]);
            expect(res.rows).toEqual([[]]);
        });
    });

    describe('when the data is an array', function() {
        
        describe('cols',function() {
            it('should create a cols part',function() {
                var res = prep(arrayData);
                expect(res.cols).toBeDefined();
            });
            it('should create the correct cols',function() {
                var res = prep(arrayData);
                expect(res.cols).toEqualFields([{
                    caption: 'name',
                    type: 'string'
                },{
                    caption: 'date',
                    type: 'string'
                },{
                    caption: 'number',
                    type: 'number'
                }]);
            });

            it('should create the correct cols when fields are given as array',function() {
                var res = prep(arrayData,{
                    fields: ['date','name']
                });
                expect(res.cols).toEqualFields([{
                    caption: 'date',
                    type: 'string'
                },{
                    caption: 'name',
                    type: 'string'
                }]);
            });

            it('should create the correct cols when fields are given as object',function() {
                var res = prep(arrayData,{
                    fields: {
                        number: 'string',
                        name: 'string'
                    }
                });
                expect(res.cols).toEqualFields([{
                    caption: 'number',
                    type: 'string'
                },{
                    caption: 'name',
                    type: 'string'
                }]);
            });

            it('should create caption and type field',function() {
                var cols = prep(arrayData).cols;
                expect(cols[0].caption).toBeDefined();
                expect(cols[0].type).toBeDefined();
            });
        });

        describe('rows',function() {
            it('should create a rows part',function() {
                var res = prep(arrayData);
                expect(res.rows).toBeDefined();
            });
            it('should create rows with data in the correct order',function() {
                var res = prep(arrayData);
                expect(res.rows[0]).toEqual([ 'Ivy Dickson', '2013-05-27T11:04:15-07:00', 10 ]);
                expect(res.rows[1]).toEqual([ 'Walker Lynch','2014-02-07T22:09:58-08:00',  2 ]);
                expect(res.rows[2]).toEqual([ 'Maxwell U. Holden', '2013-06-16T05:29:13-07:00',  5]);
            });
        });

        describe('style',function() {
            it('should have the provided style xml file',function() {
                var fn = 'test.xml';
                var res = prep(arrayData,{
                    style: fn
                });
                expect(res.stylesXmlFile).toBe(fn);
            });
        });

    });

    describe('when the data is an object', function() {
        describe('cols',function() {
            it('should create a cols part',function() {
                var res = prep(objectData);
                expect(res.cols).toBeDefined();
            });
            it('should create caption and type field',function() {
                var cols = prep(objectData).cols;
                expect(cols[0].caption).toBeDefined();
                expect(cols[0].type).toBeDefined();
            });
        });

        describe('rows',function() {
            it('should create a rows part',function() {
                var res = prep(objectData);
                expect(res.rows).toBeDefined();
            });
        });

        describe('style',function() {
            it('should have the provided style xml file',function() {
                var fn = 'test.xml';
                var res = prep(objectData,{
                    style: fn
                });
                expect(res.stylesXmlFile).toBe(fn);
            });
        });

        describe('display of nested fields',function() {
            it('should write nested fields as json',function() {
                var res = prep(objectData);
                expect(res.rows[0][3]).toEqual('{"field":"foo"}');
            });
        });
    });

    describe('working with missing fields',function() {
        it('should leave missing fields blank',function() {
            var res = prep([
                {
                    "firma": "transportabel",
                    "internet": "http://www.transportabel.de",
                    "Branche": "Möbel",
                    "STRASSE": "Messingweg 49",
                    "ort": "Münster-Sprakel",
                    "TEL_ZENTRALE": "(0251) 29 79 46"
                },
                {
                    "firma": "Soziale Möbelbörse & mehr e.V.",
                    "internet": "http://www.gersch-ms.de",
                    "Branche": "Möbel",
                    "STRASSE": "Nienkamp 80",
                    "ort": "Münster-Wienburg",
                    "TEL_ZENTRALE": "(0251) 53 40 76"
                },
                {
                    "firma": "Bald Eckhart e.K.",
                    "Branche": "Möbel",
                    "STRASSE": "Weseler Str. 628",
                    "ort": "Münster-Mecklenbeck",
                    "TEL_ZENTRALE": "(0251) 53 40 76"
                }
            ]);
            expect(res.rows[2][1]).toEqual(null);
        })
    })

    describe('prepping with config',function() {
        it('should get a nested field',function() {
            var res = prep(objectData,{
                fields:['nested.field']
            });
            expect(res.rows[0]).toEqual(['foo']);
        })
    });
});