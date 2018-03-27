'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');

var autoprefixer = require('gulp-autoprefixer');
var changed = require('gulp-changed');
var cssimport = require('gulp-cssimport');
var gzip = require('gulp-gzip');
var plumber = require('gulp-plumber');
var less = require('gulp-less');
var livereload = require('gulp-livereload');
var minify_css = require('gulp-minify-css');
var rename = require('gulp-rename');
var requirejs_optimize = require('gulp-requirejs-optimize');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');

var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');

var child_process = require('child_process');
var del = require('del');
var es = require('event-stream');
var fs = require('fs');
var path = require('path');
var yargs = require('yargs');
var _ = require('lodash');

var config = {
    src: { // source folders
        scripts: 'js',
        script_bundles: [ // entry points for scripts
            'js/app.js'
        ],

        libs_path: 'node_modules',
        libs: { // javascript libraries not in the bundle
            // 'path/to/library.js': true
        }
    },

    dest: { // destination folders
        scripts: 'build'
    }
};

// function for handling data for output
function write_output(data) {
    if (Buffer.isBuffer(data)) {
        data = data.toString();
    }
    if (typeof data === 'string') {
        data = data.trim();
    }

    data.split("\n").forEach(function (line) {
        gutil.log(line);
    });
}

// function for handling errors in the bundling process
function handle_error(err) {
    if (err.message) {
        err = err.message;
    }

    if (Buffer.isBuffer(err)) {
        err = err.toString();
    }

    if (typeof err === 'string') {
        err = err.trim();
    }
    err.split("\n").forEach(function (line) {
        write_output(gutil.colors.red(line));
    });
}

function on_kill(proc, cb) {
    proc.on('exit', cb);
    process.once('exit', proc.kill);
    process.once('SIGINT', function () {
        proc.kill();
        setTimeout(process.exit, 400);
    });
}

function bundle(source_file, watch) {
    var bundle;
    var opts = {
        debug: true,
        paths: ['./node_modules', './js']
    };

    if (watch) {
        opts = _.assign(watchify.args, opts);
        bundle = watchify(browserify(opts));
        bundle.on('update', function () {
            rebundle(bundle);
        });
    } else {
        bundle = browserify(opts);
    }

    bundle.add(source_file);
    bundle.transform(babelify.configure({
        compact: false
    }));
    bundle.transform('debowerify');
    bundle.transform('deamdify');

    function rebundle(bundler) {
        return bundler.bundle()
            .on('error', function (e) {
                gutil.log(gutil.colors.red(e.message));
                if (e.codeFrame) {
                    if (_.startsWith(e.codeFrame, 'false')) {
                        console.log(e.codeFrame.substr(5));
                    } else {
                        console.log(e.codeFrame);
                    }
                }
            })
            .pipe(source(path.basename(source_file)))
            .pipe(buffer())
            .pipe(sourcemaps.init({
                loadMaps: true
            }))
            .pipe(sourcemaps.write('./maps'))
            .pipe(gulp.dest(config.dest.scripts))
            .pipe(livereload());
    }

    return rebundle(bundle);
}

gulp.task('watch', ['libs', 'scripts'], function (cb) {

    // livereload.listen();

    config.src.script_bundles.forEach(function (source) {
        bundle(source, true);
    });

    var argv = yargs(process.argv.slice(3))
        .boolean('verbose').alias('v', 'verbose')
        .argv;

});

gulp.task('libs', function () {
    var streams = [];

    Object.keys(config.src.libs).forEach(function (key) {
        var name = config.src.libs[key];
        streams.push(gulp.src(key)
            .pipe(plumber())
            .pipe(gulpif(name !== true, rename(name)))
            .pipe(changed(config.dest.libs))
            .pipe(gulp.dest(config.dest.libs))
            .pipe(livereload()));
    });

    if (streams.length > 0) {
        return es.concat.apply(es, streams);
    }
});

gulp.task('scripts', function () {
    var streams = [];
    config.src.script_bundles.forEach(function (source) {
        var stream = bundle(source, false);
        if (stream) {
            streams.push(stream);
        }
    });

    if (streams.length > 0) {
        return es.concat.apply(es, streams);
    }
});


gulp.task('gzip', ['minify'], function () {
    return gulp.src([config.dest.path + "/**/*"])
        .pipe(plumber())
        .pipe(gzip({
            append: true
        }))
        .pipe(gulp.dest(config.dest.path))
        .pipe(livereload());
});


gulp.task('minify', ['libs', 'scripts'], function () {
    return es.concat(
        gulp.src(config.dest.scripts + "/*.js")
            .pipe(plumber())
            .pipe(uglify())
            .pipe(rename({ suffix: '.min' }))
            .pipe(gulp.dest(config.dest.scripts))
            .pipe(livereload())
    );
});

gulp.task('clean', function (cb) {
    del([config.dest.path], cb);
});

gulp.task('run', ['watch']);

gulp.task('dev', ['run']);

gulp.task('build', ['libs', 'scripts', 'minify', 'gzip']);
