"use strict";

const fs = require('fs');
const csvtojsonV2 = require("csvtojson/v2");
const path = require('path');
const mkdirp = require('mkdirp');

function flatten(lists) {
    //console.log("in Flatten Method:" + lists.reduce((a, b) => a.concat(b), []));
    return lists.reduce((a, b) => a.concat(b), []);
}

function getDirectories(srcpath) {
    // console.log("readdirsync: " + fs.readdirSync(srcpath));

    // console.log("readdirsync map: " + fs.readdirSync(srcpath)
    // .map(file => path.join(srcpath, file)));

    // console.log("readdirsync map filter: " + fs.readdirSync(srcpath)
    // .map(file => path.join(srcpath, file))
    // .filter(path => fs.statSync(path).isDirectory()));



    return fs.readdirSync(srcpath)
        .map(file => path.join(srcpath, file))
        .filter(path => fs.statSync(path).isDirectory());
}

function getDirectoriesRecursive(srcpath) {

    return [srcpath, ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))];
}


function readDir(path, callBack) {
    let arr = [];
    fs.readdir(path, callBack);
    return arr;
}


function CSVToJsonPluginClients(options) {
    // console.log("step 1");
    var dirList = getDirectoriesRecursive(options.path);

    //dirList.splice(0,1);
    try {
        if (dirList != null && dirList.length > 0) {

            dirList.forEach(d => {
                // console.log("foreach dir d before IF BLOCK: " + d);

                // check to bypass the source folder as we're interested only in sub directories.
                if (d != options.path) {
                    // console.log("foreach dir OPTION PATH: " + options.path);
                    // console.log("foreach dir d without manipulation: " + d);
                    // let t = d.replace('locale_csv_files\\shouldCost', 'distribution/__buildVersion___shouldCost/locale_files');
                    // console.log("path after replace:" + path.normalize(t));
                    CreateCSVToJsonPluginCommon({ path: d, outputPath: path.normalize(d.replace('locale_csv_files\\clients', 'distribution/__buildVersion___reqng5/locale_clients_files')) });
                }
            });
        }
    }
    catch (e) {
        console.log("error after fetching directories: " + e);
    }

}


function CreateCSVToJsonPluginCommon(options) {
    // console.log("step 2");

    // console.log("Path in plugin  method:" + options.path);
    // console.log("Output Path in plugin  method:" + options.outputPath);

    // Moved readDir code inside make dir to ensure the directory operation only after successful creation in the first place.
    mkdirp(options.outputPath, function (err) {
        if (err) console.error(err)
        else {
            // console.log('dir created' + options.outputPath)
            readDir(options.path, (err, items) => {
                // console.log('In Read Dir:' + options.path);
                // console.log('In Read Dir:' + options.outputPath);
                if (items) {
                    for (var i = 0; i < items.length; i++) {

                        let file = options.path + '/' + items[i];

                        csvtojsonV2().fromFile(file).then((JsonObj) => {
                            let resourceObj = {};
                            JsonObj.forEach((obj, i) => {
                                resourceObj[obj.RowKey] = obj.Value;
                            });

                            let fileName = getFileName(file);
                            let lang = getLang(fileName);
                            lang = lang.replace('-', '_');
                            let condition = 'if (typeof Resources$' + lang + '  === \'undefined\' || Resources$' + lang + ' ===null ){ Resources$' + lang + ' = [];  } Resources$' + lang + '.push(';
                            let fileContent = condition + JSON.stringify(resourceObj) + ')';
                            fs.writeFileSync(options.outputPath + '/' + fileName + '.js', fileContent);

                        });

                    }
                }

            });
        }
    });



}

function getFileName(path) {
    let paths = path.split('/');
    if (paths) {
        let fileName = paths[paths.length - 1];
        if (fileName) {
            let strs = fileName.split('.');
            if (strs) {
                if (strs.length > 0) {
                    return strs[0];
                }
            }
        }
    }
    return '';
}

function getLang(fileName) {
    let arr = fileName.split('_');
    if (arr) {
        if (arr.length > 0) {
            return arr[arr.length - 1];
        }
    }
    return '';
}


CSVToJsonPluginClients.prototype.apply = function (compiler) {
    compiler.plugin('done', function () {
    });
};


CreateCSVToJsonPluginCommon.prototype.apply = function (compiler) {
    compiler.plugin('done', function () {
    });
};

module.exports = {
    CSVToJsonPluginClients:CSVToJsonPluginClients,
    CreateCSVToJsonPluginCommon:CreateCSVToJsonPluginCommon
};
