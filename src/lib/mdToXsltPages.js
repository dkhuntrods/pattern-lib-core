'use strict';

var path = require('path'),
    _ = require('lodash'),
    gutil = require('gulp-util');

var templateRoot = path.join('src', 'templates');

function convertToPage(pageInfo) {
    return {
        page: _.merge({}, pageInfo.meta, {
            name: pageInfo.name,
            urlPath: pageInfo.urlPath,
        })
    }
}

function convertPageDefToBlocks(page, blockData) {
    var currentPageData = page.getData(),
        hasNoBlocks = _.isEmpty(currentPageData),
        blocks;

    if (hasNoBlocks) {
        blocks = blockData.getAllBlocks();
    } else {
        blocks = _.reduce(currentPageData, function(arr, blockDef) {

            _.each(blockDef, function(data, key) {
                arr.push({
                    name: key,
                    data: data
                });
            });
            return arr;

        }, []);
    }
    return blocks;
}

module.exports = function(pageData, blockData, siteData, swig) {

    function getTemplatePath(name, ext) {
        return path.join(templateRoot, name + ext);
    }

    function getFileContext(file) {
        var fsInfo = path.parse(file.path),
            page = pageData.getFile(fsInfo.name + '.md'),
            pageInfo = page.getInfo(),

            pageContext = _.merge(convertToPage(pageInfo), {
            site: siteData.getMeta(),
            cache: false
        });
        pageContext.page.contents = file.contents.toString();
        pageContext.page.blocks = convertPageDefToBlocks(page, blockData);

        var reqlist = pageContext.page.blocks.map(function(block){
            return block.name;
        });

        pageContext.site.pages = pageData.getAllPages();
        pageContext.site.blocks = blockData.getAllBlocks();
        pageContext.requires = blockData.getAllRequires(reqlist);

        return pageContext;
    }


    var xsltTapPages = {
        xslTemplatePath: function getXSLTemplatePath(file, context) {
            var fsInfo = path.parse(file.path),
                page = pageData.getFile(fsInfo.name + '.md'),
                meta = page.getMeta();
            return getTemplatePath(meta.layout, '.xsl');
        },
        xmlTemplatePath: function getXMLTemplatePath(file, context) {
            var fsInfo = path.parse(file.path),
                page = pageData.getFile(fsInfo.name + '.md'),
                meta = page.getMeta();
            return getTemplatePath(meta.layout, '.xml');
        },
        renderer: swig,
        fileContext: getFileContext,
        debug: false
    };

    return xsltTapPages;
};
