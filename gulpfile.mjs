import gulp from 'gulp';

import nodeSass from 'node-sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(nodeSass);
import cssnano from 'gulp-cssnano';
import rev from 'gulp-rev';
import uglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';
import {deleteSync} from 'del';
import rename from 'gulp-rename';
import revCollector from 'gulp-rev-collector';

gulp.task('css', function(done){
    console.log('minifying css ...');
    gulp.src('./assets/sass/**/*.scss') //in any folder, any file name .scss
    .pipe(sass())                       //passing through gulp sass module, i.e. converting from scss to css
    .pipe(cssnano())                    //compressing the css files
    .pipe(gulp.dest('./assets.css'))
    console.log('minified css ...');

    gulp.src('./assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'))

    done();
});

gulp.task('js', function(done){
    console.log('minifying js ...');
    gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});

gulp.task('images', function(done){
    console.log('compressing images ...');
    gulp.src('./assets/**/*')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});

gulp.task('clean:assets', function(done){
    console.log("deleting assets ...")
    deleteSync('./public/assets');
    done();
});

gulp.task('rev-collector', function () {
    return gulp.src(['./public/assets/**/*.json', './public/assets/**/*.html', './public/assets/**/*.css'])  // Add relevant files
        .pipe(revCollector())  // Replace references with versioned filenames
        .pipe(gulp.dest('dist'));  // Output to the same or appropriate directory
});

gulp.task('build', gulp.series('clean:assets', 'css', 'js', 'images', 'rev-collector'), function(done){
    console.log('Building assets ...');
    done();
});