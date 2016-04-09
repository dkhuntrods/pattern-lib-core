'use strict';

var createTransformCollection = require('./transforms'),
    path = require('path');

function createFormat(file) {
    return {};
}

module.exports = function(blockName) {
    var _transforms = {};

    function addFormatTransform(name) {
        _transforms[name] = createTransformCollection(name);
        return _transforms[name];
    }

    addFormatTransform('js')
        .addTransform('entry', function(file) {
            // console.log(file.name, file.getInfo().urlPath);
            var fileInfo = file.getInfo();
            return {
                file: file,
                path: path.join(path.sep, 'js', fileInfo.name),
                reference: fileInfo.name.replace('.js', '')
            };
        })
        .addTransform('data', function(file) {
            var fileInfo = file.getInfo();
            return {
                file: file,
                path: path.join(path.sep, fileInfo.relativePath),
                reference: fileInfo.name.replace('.js', '')
            };
        });

    addFormatTransform('xsl')
        .addTransform('entry', function(file) {
            var fileInfo = file.getInfo();
            return {
                file: file,
                path: path.join(path.sep, fileInfo.relativePath),
                reference: fileInfo.name.replace('.xsl', '')
            };
        })
        .addTransform('data', function(file) {
            var fileInfo = file.getInfo();
            return {
                file: file,
                path: path.join(path.sep, fileInfo.relativePath),
                reference: fileInfo.name.replace('.xml', '')
            };
        });

    return {
        getFormatTransforms: function(name){
            return _transforms[name].getTransforms();
        },
        getFormatTransformsForType: function(name, type) {
            return _transforms[name].getFormatTransform(type);
        }
     };
};
