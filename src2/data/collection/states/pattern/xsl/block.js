'use strict';

var path = require('path'),
    libxslt = require('libxslt'),
    connector = require(path.resolve('src2/data/collection/connector')),
    output = require(path.resolve('src2/data/stores/output')),
    nunjucksRef = require(path.resolve('src2/lib/nunjucksWithData'));

var templateXMLPath = path.join('src2', 'templates', 'formats', 'xslt', 'block.xml');
var templateXSLPath = path.join('src2', 'templates', 'formats', 'xslt', 'block.xsl');

function filterXslBlock(site, collection, file) {
    return file.get('ext') === '.xsl';
}

function transformXslBlock(site, collection, result, file, onComplete) {
    var nunjucks = nunjucksRef(site, collection, connector);
    var blockId = connector.getBlockIdByFileIdFromCollection(collection, file.get('id'));
    var requires = connector.getOutputsByBlockIdFromCollection(site, collection, 'xsl', 'requires', blockId);

    var context = {
        blockIds : [blockId],
        requires: requires[0]
    };

    var documentString = nunjucks.render(templateXMLPath, context);
    context.xmlDocumentString = documentString.replace('<?xml version="1.0" encoding="UTF-8"?>', '');
    var stylesheetString = nunjucks.render(templateXSLPath, context);

    libxslt.parse(stylesheetString, function(err, stylesheet) {

        if (err) {
            return onComplete(err);
        }

        stylesheet.apply(documentString, {}, function(err, _result) {

            if (err) {
                return onComplete(err);
            }
            _result = _result.replace(' xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:ext="http://exslt.org/common"', '');
            return onComplete(null, result.push(_result));
        });
    });

}

module.exports = output(filterXslBlock, transformXslBlock);
