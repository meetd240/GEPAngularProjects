"use strict";

var fs = require('fs');
var path = require('path');

/**
 * Webpack plugin. Replaces publicPath in emitted webpack manifest file with a given variable name.
 *
 * Useful when you don't want to specify static output:publicPath at webpack build stage but set it on the client side.
 * Plugin modifies webpack result manifest file and replaces the static publicPath string with variable reference provided.
 *
 * Plugin runs on 'after-emit' webpack stage.
 *
 * Uses options.output.publicPath to determine what to replace. Make sure to use such placeholder that
 * nothing else in the code gets replaced. A real publicPath would make sence.
 *
 * @param {object} options:
 *          {
 *              externalGlobal: 'window.some.external.global',
 *              chunkName: 'manifestChunkName_usuallyJust_manifest_or_webpack'
 *          }
 *
 * @class
 */
function DynamicPublicPathPlugin(options) {
    this.options = options;
}

/**
 * Finds asset file and replaces all publicPath occurrences with externalGlobal.
 *
 * @param {object} compiler - comes from webpack
 */
DynamicPublicPathPlugin.prototype.apply = function(compiler) {

    if(this.options && this.options.externalGlobal && this.options.chunkName) {
        compiler.plugin('after-emit', (compilation, callback) => {

            this.compilation = compilation;

            // if(compilation.options.output && compilation.options.output.publicPath){
                 this.publicPathStr = '"' + compilation.options.output.publicPath + '"';
            // }else{
            //     this.err('output.publicPath must be defined in webpack config ' +
            //         '(used only as placeholder, make it distinctive)');
            //     callback();
            //     return;
            // }
            console.log('++++++++++++++++++++++++++++++++++++++');
            console.log('compilation.options.output.publicPath');
            console.log(compilation.options.output.publicPath);

            var chunk,
                fileName,
                filePath;
        
            if (compilation.options.output && compilation.options.output.publicPath ) {
                compilation.chunks.forEach(chunk => {
                    if ((Array.isArray(this.options.chunkName) && this.options.chunkName.length == 0) || chunk.name === this.options.chunkName) {
                        fileName = chunk.files.find((file) => {
                            return file.match(/.*\.js$/);
                        });
                        filePath = path.resolve(compilation.assets[fileName].existsAt);
                        this.doReplace(filePath, callback);
                    }
                });
            }else{
                callback();
            }



        // else{
        //     callback();
        // }
        });
    }else{
        this.err('params missing: \n[mandatory] externalGlobal - name of global var you want to use as publicPath.\n[mandatory] chunkName - name of chunk in which to look for publicPath references.');
    }
};

/**
 * Opens file and replaces content.
 *
 * @param {string} filePath
 * @param {function} callback
 */
DynamicPublicPathPlugin.prototype.doReplace = function(filePath, callback){
    this.log('attempting to modify: ' + filePath);

    // open file
    fs.exists(filePath, (exists) => {

        if (exists) {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    _log('fs read error (' + err + ')');
                    callback();
                    return;
                }                
                //change contents
                //var result = data.replace(this.publicPathStr, this.options.externalGlobal);
                var result = data.replace('"#__cdnPath#' , this.options.externalGlobal+'+"');

                //save file
                fs.writeFile(filePath, result, 'utf8', (err) => {
                    if (err) {
                        this.err('fs write error (' + err + ')');
                    } else {
                        this.log('replaced publicPath');
                    }
                    callback();
                });
            });
        } else {
            this.err('could not find file (' + filePath + ')');
            callback();
        }
    });
};

DynamicPublicPathPlugin.prototype.log = function(msg) {
    //this.compilation.children.push('-------- Dynamic Public Path Plugin: '+msg);
};

DynamicPublicPathPlugin.prototype.err = function(msg) {
    this.compilation.errors.push(new Error('-------- Dynamic Public Path Plugin: '+msg));
};


module.exports = DynamicPublicPathPlugin;