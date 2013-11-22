var prep = require('../lib/json2xls').prepareJson;
var data = require('./data.json');

describe('prepare',function() {

    describe('cols',function() {
        it('should create a cols part',function() {
            var res = prep(data);
            expect(res.cols).toBeDefined();
        });
        it('should create caption and type field',function() {
            var cols = prep(data).cols;
            expect(cols[0].caption).toBeDefined();
            expect(cols[0].type).toBeDefined();
        });
    });

    describe('rows',function() {
        it('should create a rows part',function() {
            var res = prep(data);
            expect(res.rows).toBeDefined();
        });
    });

    describe('style',function() {
        it('should have the provided style xml file',function() {
            var fn = 'test.xml';
            var res = prep(data,{
                style: fn
            });
            expect(res.stylesXmlFile).toBe(fn);
        });
    });
});