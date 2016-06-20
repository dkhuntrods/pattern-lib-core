'use strict';

var path = require('path'),
    libxslt = require('libxslt'),
    output = require('../../../../../../stores/output'),
    // /src2/data/collection/connector.js
    connector = require(path.resolve('src2/data/collection/connector')),
    getTemplateContext = require('../md/template/context').getTemplateContext;
    // nunjucksRef = require(path.resolve('src2/lib/nunjucksWithData'));


function filter(site, collection, file) {
    return file.get('ext') === '.xsl';
}

function transform(site, collection, result, file) {
    // var nunjucks = nunjucksRef(site, collection, connector);
    var context = getTemplateContext(site, collection, file);

    var templateXMLPath = path.join('src2', 'templates', 'block-template.xml');
    var templateXSLPath = path.join('src2', 'templates', 'block-template.xsl');

    // var documentString = nunjucks.render(templateXMLPath, context);
    // context.xmlDocumentString = documentString.replace('<?xml version="1.0" encoding="UTF-8"?>', '');
    // var stylesheetString = nunjucks.render(templateXSLPath, context);
    // output(documentString);
    // output(stylesheetString);


    // libxslt.parse(stylesheetString, function(err, stylesheet) {

    //         if (err) {

    //             return callback(err);
    //         }

    //         stylesheet.apply(documentString, {}, function(err, result) {

    //             if (err) {

    //                 return callback(err);
    //             }


    //             return callback(null,result);



    //         });
    //     });

}

module.exports = output(filter, transform);
