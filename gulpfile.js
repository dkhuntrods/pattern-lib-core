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




var patternBlockMap = require('./src2/lib/transforms/patternBlock'),
    patternBlockFilter = require('./src2/lib/filters/patternBlock'),

    fileMap = require('./src2/lib/transforms/file'),
    fileFilter = require('./src2/lib/filters/file').isFileWithPaths,

    mapFiles = require('./src2/gulp-tasks/mapFiles'),
    createFileStore = require('./src2/lib/stores/files'),
    createBlockStore = require('./src2/lib/stores/blocks'),

    patternFileBlockTuple = require('./src2/lib/transforms/patternFileBlockTuple'),
    connectBlocksAndFiles = require('./src2/lib/connectors/blocksAndFiles'),
    collection = require('./src2/lib/connectors/collection'),
    patternStates = require('./src2/lib/states/pattern')();

var util = require('util');
var Immutable = require('immutable');


gulp.task('union:patterns', function(cb) {
    mapFiles(path.join('blocks', 'core'), fileFilter, fileMap, function(err, results) {
        var patternFiles = createFileStore(results);
        mapFiles(path.join('blocks', 'core'), patternBlockFilter, patternBlockMap, function(err, results) {
            if (err) return cb(err);
            var patternBlocks = createBlockStore(results);

            var patternJoin = connectBlocksAndFiles(patternFileBlockTuple);
            var patternCollection = collection();

            patternBlocks = patternCollection.addFileIds(patternBlocks, patternJoin.getFileIdsPerBlock(patternFiles, patternBlocks));
            patternFiles = patternCollection.addBlockIds(patternFiles, patternJoin.getBlockIdsPerFile(patternFiles, patternBlocks));

            var dbcFiles = patternCollection.getFilesForBlockById('blocks/core/ff_module/ff_module-date-picker-jumpto', patternFiles, patternBlocks);
            var dbcBlocks = patternCollection.getBlocksForFileById('blocks/core/ff_module/ff_module-segments/ff_module-segments.xsl', patternFiles, patternBlocks);

            // console.log(util.inspect(dbcFiles, {
            //     showHidden: false,
            //     depth: 2
            // }));
            // console.log(util.inspect(dbcBlocks, {
            //     showHidden: false,
            //     depth: 2
            // }));

            // console.log(patternStates.get('lib').get('js').get('entry').get('apply'));

            var block = patternBlocks.get('blocks/core/ff_module/ff_module-dropdown-button/ff_module-dropdown-button-component');

            var src = patternCollection.getBlockSources(patternStates.get('lib'), dbcFiles, 'js', 'entry');
            console.log(dbcFiles, src);
            // patternCollection.set('state', 'lib');
            // var jsentryVal = patternCollection.get(block, 'lib','js', 'entry');

            // console.log('\n_____________');
            // console.log('\n_____________');
            // console.log(block);
            // var file = patternFiles.getById('blocks/core/ff_module/ff_module-planner-grid-day/ff_module-planner-grid-day.md');
            // console.log('\n_____________');
            // console.log(file);
            // console.log('\n_____________');
            // console.log('\n_____________');
            cb(null);
        });
    });
});

// gulp.task('_info:files', function(cb) {
//     mapFiles(path.join('blocks', 'core'), fileFilter, fileMap, function(err, results){
//         if (err) return cb(err);
//     });
// });

// gulp.task('_info:blocks', function(cb) {
//     mapFiles(path.join('blocks', 'core'), patternBlockFilter, function(err, results){
//         console.log(results);
//         cb();
//     });
// });

// gulp.task('store:blocks', function(cb) {
//     mapFiles(path.join('blocks', 'core'), patternBlockFilter, function(err, results) {
//         var blocks = createBlockStore(results);
//         var block = blocks.getBlockByResolvedName('blocks/core/ff_module/ff_module-dropdown-button/ff_module-dropdown-button-component');
//         console.log(block);
//         cb();
//     });
// });

// gulp.task('store:files', function(cb) {
//     mapFiles(path.join('blocks', 'core'), fileFilter, function(err, results) {
//         var files = createFileStore(results);
//         var file = files.getFileByResolvedName('blocks/core/ff_module/ff_module-dropdown-button/ff_module-dropdown-button-component/ff_module-dropdown-button-component.md');
//         console.log(file);
//         cb();
//     });
// });



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
