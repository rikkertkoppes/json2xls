var json2xls = require('../lib/json2xls');
var fs = require('fs');
var data = require('../spec/svData');
var json = {
    foo: 'bar',
    qux: 'moo',
    poo: 123,
    stux: new Date()
}

//export only the field 'poo'
// var xls = json2xls(json,{
//     fields: ['poo']
// });

//export only the field 'poo' as string
// var xls = json2xls(json,{
//     fields: {poo:'string'}
// });
var xls = json2xls(data);

fs.writeFileSync('data.xlsx', xls, 'binary');