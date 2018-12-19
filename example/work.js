var json2xls = require('../lib/json2xls')
var fs = require('fs')

var json = [
  {
    'firma.*': 'transportabel',
    'internet': 'http://www.transportabel.de',
    'Branche': 'Möbel',
    'STRASSE': 'Messingweg 49',
    'ort': 'Münster-Sprakel',
    'TEL_ZENTRALE': '(0251) 29 79 46'
  },
  {
    'firma.*': 'Soziale Möbelbörse & mehr e.V.',
    'internet': 'http://www.gersch-ms.de',
    'Branche': 'Möbel',
    'STRASSE': 'Nienkamp 80',
    'ort': 'Münster-Wienburg',
    'TEL_ZENTRALE': '(0251) 53 40 76'
  },
  {
    'firma.*': 'Bald Eckhart e.K.',
    // 'internet': null,
    'Branche': 'Möbel',
    'STRASSE': 'Weseler Str. 628',
    'ort': 'Münster-Mecklenbeck',
    'TEL_ZENTRALE': '(0251) 53 40 76'
  }
]

// export only the field 'poo'
// var xls = json2xls(json,{
//     fields: ['poo']
// })

// export only the field 'poo' as string
// var xls = json2xls(json,{
//     fields: {poo:'string'}
// })
var xls = json2xls(json)

fs.writeFileSync('data.xlsx', xls, 'binary')
