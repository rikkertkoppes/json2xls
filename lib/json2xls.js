var nodeExcel = require('excel-export');

var transform = function(json,config) {
    var conf = transform.prepareJson(json,config);
    var result = nodeExcel.execute(conf);
    return result;
};

//get a xls type based on js type
function getType(obj,type) {
    if (type) {
        return type;
    }
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
    var jsonArr = [].concat(json);
    var fields = conf.fields || Object.keys(jsonArr[0]);
    var types = [];
    if (!(fields instanceof Array)) {
        types = Object.keys(fields).map(function(key) {
            return fields[key];
        });
        fields = Object.keys(fields);
    }
    //cols
    res.cols = fields.map(function(key,i) {
        return {
            caption: key,
            type: getType(jsonArr[0][key],types[i]),
            beforeCellWrite: function(row, cellData, eOpt){
                eOpt.cellType = getType(cellData,types[i]);
                return cellData;
            }
        };
    });
    //rows
    res.rows = jsonArr.map(function(row) {
        return fields.map(function(key) {
            return row[key];
        });
    });
    //add style xml if given
    if (conf.style) {
        res.stylesXmlFile = conf.style;
    }
    return res;
};

transform.middleware = function(req,res,next) {
    res.xls = function(fn,data,config) {
        var xls = transform(data,config);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + fn);
        res.end(xls, 'binary');
    };
    next();
};

module.exports = transform;