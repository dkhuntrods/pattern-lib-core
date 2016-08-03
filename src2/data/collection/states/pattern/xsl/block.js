'use strict';

var path = require('path'),
    libxslt = require('libxslt'),
    connector = require(path.resolve('src2/data/collection/connector')),
    output = require(path.resolve('src2/data/stores/output')),
    nunjucksRef = require(path.resolve('src2/lib/nunjucksWithData'));

var templateXMLPath = path.join('src2', 'templates', 'formats', 'xslt', 'block-template.xml');
var templateXSLPath = path.join('src2', 'templates', 'formats', 'xslt', 'block-template.xsl');

function filterXslBlock(site, collection, file) {
    // return setImmediate(function(){onComplete(file.get('ext') === '.xsl');});
    return file.get('ext') === '.xsl';
}

function transformXslBlock(site, collection, result, file, onComplete) {
    // console.log('transformXslBlock: ', file);
    var nunjucks = nunjucksRef(site, collection, connector);

    var context = connector.getOutputsByFileAbsolutePathFromCollection(site, collection, 'md', 'template', 'context', file.get('absolutePath').replace('.xsl', '.md'));
    context = context[0];

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
