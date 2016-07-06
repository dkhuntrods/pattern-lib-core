'use strict';

var path = require('path'),
    libxslt = require('libxslt'),
    output = require('../../../../../../stores/output'),
    // /src2/data/collection/connector.js
    connector = require(path.resolve('src2/data/collection/connector')),
    nunjucksRef = require(path.resolve('src2/lib/nunjucksWithData'));


function filterXslBlock(site, collection, file) {
    // return setImmediate(function(){onComplete(file.get('ext') === '.xsl');});
    return file.get('ext') === '.xsl';
}

function transformXslBlock(site, collection, result, file, onComplete) {
    // console.log('transformXslBlock: ', file);
    var nunjucks = nunjucksRef(site, collection, connector);
    var context = connector.getFileOutputsByAbsolutePath(site, collection, 'md', 'template', 'context', file.get('absolutePath').replace('.xsl', '.md'));


    // console.log(context);



    var templateXMLPath = path.join('src2', 'templates', 'block-template.xml');
    var templateXSLPath = path.join('src2', 'templates', 'block-template.xsl');

    var documentString = nunjucks.render(templateXMLPath, context);
    context.xmlDocumentString = documentString.replace('<?xml version="1.0" encoding="UTF-8"?>', '');
    var stylesheetString = nunjucks.render(templateXSLPath, context);
    // console.log(documentString);

    libxslt.parse(stylesheetString, function(err, stylesheet) {

        if (err) {

            return onComplete(err);
        }

        stylesheet.apply(documentString, {}, function(err, _result) {

            if (err) {

                return onComplete(err);
            }

            // console.log(_result);

            return onComplete(null, _result);



        });
    });

}

module.exports = output(filterXslBlock, transformXslBlock);
