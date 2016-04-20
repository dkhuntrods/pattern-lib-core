'use strict';

var gulp = require('gulp'),
    path = require('path'),
    plugins = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'gulp.*'],
        replaceString: /\bgulp[\-.]/
    }),

    argv = require("minimist")(process.argv.slice(2)),
    config = require('./config')(argv),
    paths = config.paths,


    blockStore = require('./src/lib/stores/blocks')(),
    pageStore = require('./src/lib/stores/pages')(),
    siteStore = require('./src/lib/stores/site')(config.site),
    swig = require('./src/lib/augmentedSwig')(blockStore, pageStore),

    buildXSLTBlockOptions = require('./src/lib/mdtoXSLTBlocks')(blockStore, siteStore, swig),
    buildXSLTPageOptions = require('./src/lib/mdtoXSLTPages')(pageStore, blockStore, siteStore, swig),
    fileInfoOptions = require('./src/lib/fileInfoOptions')(gulp, plugins),
    getBlockInfo = require('./src/gulp-tasks/fileInfo').getBlockInfo,
    getFileInfo = require('./src/gulp-tasks/fileInfo').getFileInfo,
    buildXSLT = require('./src/gulp-tasks/buildXSLT')(gulp, plugins),
    exportBlocks = require('./src/gulp-tasks/exportBlocks')(gulp, plugins),
    server = require('./src/gulp-tasks/server')(gulp, plugins, config),
    browserSync = server.browserSync,
    utils = require('./src/lib/utils')(gulp, plugins, browserSync, config),
    cssTasks = require('./src/gulp-tasks/compileCSS')(gulp, plugins, config, utils, browserSync),
    webpackTasks = require('./src/gulp-tasks/webpack')(gulp, plugins, config, utils),
    iconTasks = require('./src/gulp-tasks/icons')(gulp, plugins, config, utils),
    assetTasks = require('./src/gulp-tasks/assets')(gulp, plugins, config, utils, browserSync),
    clean = require('./src/gulp-tasks/clean')(gulp, plugins);



/**
 * Data
 * ******************************************/

/**
 * Compile block and page info for use in other build steps
 */
gulp.task('info:blocks',
    getBlockInfo('blocks/core', blockStore, fileInfoOptions.blocks, config.site));

gulp.task('info:pages', ['info:blocks'],
    getFileInfo('pages/', pageStore, fileInfoOptions.pages, config.site));

gulp.task('info', ['info:blocks', 'info:pages']);



var generator = require('./src2/data/collection/generator'),
    connector = require('./src2/data/collection/connector'),
    Immutable = require('immutable');

var tSite = Immutable.fromJS({
    title: 'Firefly test title',
    themes: ['core', 'melody']
});

gulp.task('test:generate', function(cb) {
    var Immutable = require('immutable');


    generator(path.join('blocks', 'core'), ['lib', 'pattern'], function(err, collection) {
        if (err) return cb(err);
        var testGetBlockOutputsFromCollection = connector.getBlockOutputsFromCollection.bind(null, tSite, collection, 'js', 'entry');

        var alt = testGetBlockOutputsFromCollection('blocks/core/ff_module/ff_module-date-picker-jumpto');
        var test = { path: '/js/ff_module-date-picker-jumpto.js', reference: 'ffModuleDatePickerJumpto' };
        console.log(test, alt);

        cb(err);
    });
});

var collection;
gulp.task('generate:collection:pattern', function(cb) {

    generator(path.join('blocks', 'core'), ['lib', 'pattern'], function(err, _collection) {
        if (err) return cb(err);
        collection = _collection;
        // var xsl = connector.getBlockOutputsFromCollection(tSite, _collection, ['lib', 'xsl', 'entry'], 'blocks/core/ff_module/ff_module-date-picker-jumpto');
        // console.log(xsl);
        // console.log(xsl.get('context'));

        // console.log(collection.get('states').toJS());

        // console.log(collection.get('blocks').keySeq().toJS());

        cb();
    });
});

var mdtoXSLT = require('./src/gulp-plugins/gulp-mdtoXSLT');

gulp.task('generate:xslt:pattern', ['generate:collection:pattern'], function() {

    var swig2 = require('./src2/lib/swigWithData')(collection, connector);
    var nunjucks = require('./src2/lib/nunjucksWithData')(tSite, collection, connector);

    var fileIdList = connector.getFileIdListByFormat(tSite, collection, 'md', 'entry');
    // console.log(files.keySeq().toArray());
    // var file = connector.getFilesByIdList(collection.get('files'), ['blocks/core/ff_module/ff_module-columnar-list/ff_module-columnar-list.md']);
    // console.log(file);

    // var fileSrc = connector.getFileOutputsById(tSite, collection, statePath, 'blocks/core/ff_module/ff_module-form-box-member/ff_module-form-box-member.md');
    // console.log(fileSrc);

    // var getFileOutputsById = connector.getFileOutputsById.bind(null, tSite, collection, statePath);
    var getFileOutputsByAbsolutePath = connector.getFileOutputsByAbsolutePath.bind(null, tSite, collection, 'md');
    // console.log(getFileOutputsByAbsolutePath('entry','/www/sites/firefly-pattern-lib/blocks/core/ff_module/ff_module-dropdown-button/ff_module-dropdown-button.md').context);
    // console.log(getFileOutputsByAbsolutePath('toXSL','context', '/www/sites/firefly-pattern-lib/blocks/core/ff_module/ff_module-dropdown-button/ff_module-dropdown-button.md'));
    // console.log(swig2, swig2.renderFile);

    return gulp.src(fileIdList)
        .pipe(plugins.plumber({
            errorHandler: function(err) {
                console.log(err);
            }
        }))
        .pipe(mdtoXSLT({
            xslTemplatePath: function getXSLTemplatePath(fileBuffer, context) {
                return getFileOutputsByAbsolutePath('template','base','xsl', fileBuffer.path);
            },
            xmlTemplatePath: function getXMLTemplatePath(fileBuffer, context) {
                console.log(fileBuffer.path);
                return getFileOutputsByAbsolutePath('template','base','xml', fileBuffer.path);
            },
            // renderer: swig2,
            renderMethod: nunjucks.render.bind(nunjucks),
            fileContext: function(fileBuffer){
                // console.log('>>>', getFileOutputsByAbsolutePath('template', 'context', fileBuffer.path));
                return getFileOutputsByAbsolutePath('template', 'context', fileBuffer.path);
            },
            debug: true
        }))
        .pipe(plugins.rename({
            extname: '.html'
        }))
        .pipe(gulp.dest('wwwroot2/blocks/'));
});

/**
 * HTML/XSLT
 * ******************************************/

/**
 * Compile blocks and pages into html via xsl/xml
 */

gulp.task('xslt:pages', ['info'],
    buildXSLT(paths.pages.xslt.src, buildXSLTPageOptions, paths.pages.xslt.dest));

gulp.task('xslt:blocks', ['info'],
    buildXSLT(paths.blocks.xslt.src, buildXSLTBlockOptions, paths.blocks.xslt.dest));

gulp.task('xslt', ['xslt:blocks', 'xslt:pages']);

/**
 * Export blocks
 */
gulp.task('export:blocks',
    exportBlocks(paths.blocks.export.src, config.exportPath, './src/templates/export/blocks/main.xsl', 'blocks.xsl'));


/**
 * Css
 * ******************************************/

/**
 * Compile css
 */

gulp.task('css:blocks',
    cssTasks.compileByFolder(paths.blocks.dir, paths.blocks.styles.buildPriority, paths.blocks.styles.dest));

gulp.task('css:pages',
    cssTasks.compileByGlob(paths.pages.styles.src, config.pagesCssName, paths.pages.styles.dest));

gulp.task('css', ['css:blocks', 'css:pages']);


/**
 * Export Less
 */
gulp.task('export:less',
    cssTasks.export(paths.blocks.dir, paths.blocks.styles.exportPriority, config.exportPath));


/**
 * Javascript
 * ******************************************/

/**
 * Compile javascript
 */
gulp.task('js', ['info'],
    webpackTasks.develop(blockStore));

/**
 * Export javascript
 */
gulp.task('export:js', ['export:js:raw']);

gulp.task('export:js:raw',
    webpackTasks.buildExportRawJs(path.join(paths.blocks.dir,'core/'), config.exportPath));



/**
 * Icons
 * ******************************************/
/**
 * Generate icon css+fallbacks from svg files
 */
gulp.task('icons', ['icons:grump:copy']);

gulp.task('icons:copy',
    iconTasks.copyIcons(paths.icons.copy.src, paths.icons.copy.dest));

gulp.task('icons:grump:copy', ['icons:grumpicon'],
    iconTasks.copyIcons(paths.icons.copy.src, paths.icons.copy.dest));

gulp.task('icons:grumpicon', ['icons:checkmodified', 'icons:checkconfigmodified'],
    iconTasks.grumpIcon(paths.icons.grumpicon.src, paths.icons.grumpicon.srcDir, paths.icons.grumpicon.dest, paths.icons.grumpicon.destDir));

gulp.task('icons:checkmodified', ['icons:optimise'],
    iconTasks.checkModified(paths.icons.grumpicon.src, paths.icons.grumpicon.srcDir, paths.icons.grumpicon.dest, paths.icons.grumpicon.destDir));

gulp.task('icons:checkconfigmodified', iconTasks.checkConfigModified(paths.icons.config.src, paths.icons.config.dest));

gulp.task('icons:optimise',
    iconTasks.optimise(paths.icons.optimise.src, paths.icons.optimise.srcDir, paths.icons.optimise.dest, paths.icons.optimise.destDir));

/**
 * Export Icons
 */
gulp.task('export:icons',
    iconTasks.export(paths.icons.export.src, path.join(config.exportPath, 'icons')));



/**
 * Assets
 * ******************************************/
/**
 * Copy assets to development folder
 */
gulp.task('assets',
    assetTasks.develop(paths.assets.src, paths.assets.dest));

/**
 * Export assets
 */
gulp.task('export:assets',
    assetTasks.export(paths.assets.export, config.exportPath));

/**
 * Serve local files
 */
gulp.task('serve', ['build'], server.initBrowserSync());



/**
 * Watching
 *********************************************/
gulp.task('watch', ['build'], function() {

    gulp.watch([
            paths.assets.src
        ], ['watch:assets'])
        .on('change', utils.changeEvent('Assets'));

    gulp.watch([
            paths.blocks.scripts.src
        ], ['watch:js'])
        .on('change', utils.changeEvent('Js'));

    gulp.watch([
            paths.pages.styles.src
        ], ['watch:css:pages'])
        .on('change', utils.changeEvent('Styles:pages'));

    gulp.watch([
            paths.blocks.styles.watch,
        ], ['watch:css:blocks'])
        .on('change', utils.changeEvent('Styles:blocks'));

    gulp.watch([
            paths.icons.copy.src,
        ], ['watch:icons'])
        .on('change', utils.changeEvent('Icons'));

    gulp.watch([
            paths.pages.watch
        ], ['watch:pages'])
        .on('change', utils.changeEvent('Pages'));

    gulp.watch([
            paths.pages.templates.watch
        ], ['watch:pages:templates'])
        .on('change', utils.changeEvent('Layout:content '));

    gulp.watch([
            paths.blocks.watch,
        ], ['watch:blocks'])
        .on('change', utils.changeEvent('Blocks'));

})


gulp.task('watch:assets', ['assets']);
gulp.task('watch:css:blocks', ['css:blocks']);
gulp.task('watch:css:pages', ['css:pages']);
gulp.task('watch:js', ['js'], utils.callbackAfterBuild('*.js'));
gulp.task('watch:icons', ['icons:copy']);

gulp.task('watch:pages', ['xslt'], utils.callbackAfterBuild('*.html'));
gulp.task('watch:pages:templates', ['xslt'], utils.callbackAfterBuild('*.html'));
gulp.task('watch:blocks', ['xslt'], utils.callbackAfterBuild('*.html'));



/**
 * Combine html and css build
 */
gulp.task('build', ['xslt', 'css', 'assets', 'js', 'icons:copy']);



/**
 * Export
 *********************************************/
gulp.task('export', ['export:blocks', 'export:less', 'export:js', 'export:icons', 'export:assets']);




/**
 * Clean
 *********************************************/
gulp.task('clean', clean([config.exportPath, config.exportJsPath].concat(paths.clean)));
/**
 * Clean - with icon cache
 *********************************************/
gulp.task('clean:cache', clean([config.exportPath, config.exportJsPath].concat(paths.clean).concat(paths.icons.cache)));


/**
 * Combined tasks
 *********************************************/

gulp.task('dev', ['serve', 'watch']);
gulp.task('default', ['dev']);
