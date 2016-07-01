json2xls
========

[![Build Status](https://travis-ci.org/rikkertkoppes/json2xls.png?branch=master)](https://travis-ci.org/rikkertkoppes/json2xls)

utility to convert json to a excel file, based on [Node-Excel-Export](https://github.com/functionscope/Node-Excel-Export)

Installation
------------

    npm install json2xls

Usage
------

Use to save as file:

    var json2xls = require('json2xls');
    var json = {
        foo: 'bar',
        qux: 'moo',
        poo: 123,
        stux: new Date()
    }

    var xls = json2xls(json);

    fs.writeFileSync('data.xlsx', xls, 'binary');

Or use as express middleware. It adds a convenience `xls` method to the response object to immediately output an excel as download.

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
