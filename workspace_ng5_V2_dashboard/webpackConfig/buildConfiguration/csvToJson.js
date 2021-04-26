"use strict";

const fs = require("fs");
const csvtojsonV2 = require("csvtojson/v2");
const path = require("path");
const mkdirp = require("mkdirp");

function readDir(path, callBack) {
  let arr = [];
  fs.readdir(path, callBack);
  // console.log(' read Dir is done ');
  return arr;
}

function convertCSVTojson(filePath) {
  let resourceObj = {};
  csvtojsonV2()
    .fromFile(filePath)
    .then(JsonObj => {
      JsonObj.forEach((obj, i) => {
        resourceObj[obj.RowKey] = obj.Value;
      });
    });

  return resourceObj;
}

function CSVToJsonPlugin(options) {
  mkdirp(options.outputPath, function(err) {
    if (err) console.error(err);
    else {
      console.log("<================= Directory Created ===============>");
    }
  });

  readDir(options.path, (err, items) => {
    if (items) {
      for (var i = 0; i < items.length; i++) {
        let file = options.path + "/" + items[i];
        let fileName = getFileName(file);
        if (options.excludeFiles.indexOf(fileName) == -1) {
          csvtojsonV2()
            .fromFile(file)
            .then(JsonObj => {
              let resourceObj = {};
              JsonObj.forEach((obj, i) => {
                resourceObj[obj.RowKey] = obj.Value;
              });

              let fileName = getFileName(file);
              let lang = getLang(fileName);
              lang = lang.replace("-", "_");
              let condition =
                "if (typeof Resources$" +
                lang +
                "  === 'undefined' || Resources$" +
                lang +
                " ===null ){ Resources$" +
                lang +
                " = [];  } Resources$" +
                lang +
                ".push(";
              let fileContent = condition + JSON.stringify(resourceObj) + ")";
              fs.writeFileSync(
                options.outputPath + "/" + fileName + ".js",
                fileContent
              );
            });
        }
      }
    }
  });
}

function getFileName(path) {
  let paths = path.split("/");
  if (paths) {
    let fileName = paths[paths.length - 1];
    if (fileName) {
      let strs = fileName.split(".");
      if (strs) {
        if (strs.length > 0) {
          return strs[0];
        }
      }
    }
  }
  return "";
}

function getLang(fileName) {
  let arr = fileName.split("_");
  if (arr) {
    if (arr.length > 0) {
      return arr[arr.length - 1];
    }
  }
  return "";
}

CSVToJsonPlugin.prototype.apply = function(compiler) {
  compiler.plugin("done", function() {
    //console.log('Hello World!');
  });
};

module.exports = CSVToJsonPlugin;
