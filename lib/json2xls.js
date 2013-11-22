var nodeExcel = require('excel-export');

var transform = function(json,config) {
    var conf = transform.prepareJson(json,config);
    var result = nodeExcel.execute(conf);
    return result;
};

//get a xls type based on js type
function getType(obj) {
    var t = typeof obj;
    switch (t) {
        case 'string':
        case 'number':
            return t;
        case 'boolean':
            return 'bool';
        default:
            return 'string';
    }
}

//prepare json to be in the correct format for excel-export
transform.prepareJson = function(json,config) {
    var res = {};
    var conf = config||{};
    //cols
    res.cols = Object.keys(json[0]).map(function(key) {
        return {
            caption: key,
            type: getType(json[0][key])
        };
    });
    //rows
    res.rows = json.map(function(row) {
        return Object.keys(row).map(function(key) {
            return row[key];
        });
    });
    //add style xml if given
    if (conf.style) {
        res.stylesXmlFile = conf.style;
    }
    return res;
};

module.exports = transform;