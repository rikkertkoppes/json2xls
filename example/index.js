var json2xls = require('../lib/json2xls');
var data = require('../spec/arrayData.json');
var fs = require('fs');

var xls = json2xls(data,{});


fs.writeFileSync('output.xlsx',xls, 'binary');