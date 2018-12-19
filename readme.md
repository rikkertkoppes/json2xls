json2xls
========

[![npm version](https://badge.fury.io/js/%40aquajax%2Fjson2xls.svg)](https://badge.fury.io/js/%40aquajax%2Fjson2xls)
[![Build Status](https://travis-ci.org/ge-hall/json2xls.svg?branch=master)](https://travis-ci.org/ge-hall/json2xls)
[![Dev Dependancies](https://david-dm.org/ge-hall/json2xls.svg)](https://david-dm.org/ge-hall/json2xls.svg)
[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

utility to convert json to a excel file, based on [Excel-Export](https://github.com/functionscope/Node-Excel-Export)

Attribution
-----------

This package is a fork of rikkertkoppes/json2xls. The original package had an outstanding PR to address . char in column headers
submitted by teliov.

Unfortunately the original package has not been updated since July 2016.


Installation
------------

    npm install @aquajax/json2xls

Usage
------

Use to save as file:

```
    var json2xls = require('json2xls');
    var json = {
        foo: 'bar',
        qux: 'moo',
        poo: 123,
        stux: new Date()
    }

    var xls = json2xls(json);

    fs.writeFileSync('data.xlsx', xls, 'binary');
```
Or use as express middleware. It adds a convenience `xls` method to the response object to immediately output an excel as download.

```
    var jsonArr = [{
        foo: 'bar',
        qux: 'moo',
        poo: 123,
        stux: new Date()
    },
    {
        foo: 'bar',
        qux: 'moo',
        poo: 345,
        stux: new Date()
    }];

    app.use(json2xls.middleware);

    app.get('/',function(req, res) {
        res.xls('data.xlsx', jsonArr);
    });
```
Options
-------

As a second parameter to `json2xls` or a third parameter to `res.xls`, a map of options can be passed:

    var xls = json2xls(json, options);
    res.xls('data.xlsx', jsonArr, options);

The following options are supported:

    - style: a styles xml file, see <https://github.com/functionscope/Node-Excel-Export>
    - fields: either an array or map containing field configuration:
        - array: a list of names of fields to be exported, in that order
        - object: a map of names of fields to be exported and the types of those fields. Supported types are 'number','string','bool'

Example:

```
    var json2xls = require('json2xls');
    var json = {
        foo: 'bar',
        qux: 'moo',
        poo: 123,
        stux: new Date()
    }

    //export only the field 'poo'
    var xls = json2xls(json,{
        fields: ['poo']
    });

    //export only the field 'poo' as string
    var xls = json2xls(json,{
        fields: {poo:'string'}
    });

    fs.writeFileSync('data.xlsx', xls, 'binary');
```

Downloading from front end app
------------------------------

The following example will process the output of json2xls for valid file download:

```
export const download = (data, filename, ext) => {
  const decodeBase64 = (str) => {
    try {
      return window.atob(str);
    } catch (e) {
      return str;
    }
  };

  const decoded = decodeBase64(data);
  const buf = new ArrayBuffer(decoded.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i !== decoded.length; ++i) {
    view[i] = decoded.charCodeAt(i) & 0xFF;
  }

  const blob = new Blob([buf], {
    type: 'application/octet-stream'
  });

  const a = window.document.createElement('a');
  a.href = window.URL.createObjectURL(blob, {
    type: `data:attachment/${ext}`
  });
  a.download = `${filename}.${ext}`;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
```