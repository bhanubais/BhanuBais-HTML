const gulp = require('gulp');
const {parallel, series, src, dest} = require('gulp');
const panini = require('panini');
const sass = require('gulp-sass');
sass.compiler = require('node-sass')
const liveServer = require('live-server');
const del = require('del');
const imagemin = require('gulp-imagemin');
const gulpif = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');


PRODUCTION = false;

// Load updated HTMLs and partials into panini
function resetPages(done) {
	panini.refresh();
	done();
}

// Creating html pages using panini
pages = () => {
	return src('src/pages/**/*.html')
	.pipe(panini({
		root: 'src/pages/',
		layouts: 'src/layouts/',
		partials: 'src/partials/',
		helpers: 'src/helpers/',
		data: 'src/data/'
	}))
	.pipe(dest('public'));
}

// cleaning public folder before first run
clean = () => {
	return del(['public/**', '!public'], {force: true});
}

// check for sass/scss file
isSass = (file) => {
	return file.extname === '.scss' || file.extname === '.sass';
}

// creating css files from sass/scss using node-sass
css = () => {
	return src(['src/assets/scss/style.{scss, sass}', 'src/assets/scss/vendor/**'])
	.pipe(sourcemaps.init())
	.pipe(sass().on('error', sass.logError))
	.pipe(sourcemaps.write())
	.pipe(dest('public/assets/css'));
}

css2 = () => {
	return src('src/assets/scss/style.{scss, sass}')
	.pipe(gulpif(isSass, sourcemaps.init()
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write())
		))
	.pipe(dest('public/assets/css'));
}

// javascript
js = () => {
	return src('src/assets/js/**/*.js')
	.pipe(dest('public/assets/js'))
}

fonts = () => {
	return src('src/assets/fonts/**')
	.pipe(dest('public/assets/fonts'));
}

images = () => {
	return src('src/assets/images/**')
	.pipe(gulpif(PRODUCTION, imagemin([
		imagemin.gifsicle({interlaced: true}),
		imagemin.mozjpeg({quality: 60, progressive: true}),
		imagemin.optipng({optimizationLevel: 5}),
		imagemin.svgo({
			plugins: [
				{removeViewBox: true},
				{cleanupIDs: false}
			]
		})
	])))
	.pipe(dest('public/assets/images'));
}

watch = () => {
	gulp.watch('src/{data,helpers,layouts,partials}/**/*.{html,js,yml,json}', series(resetPages, pages))
	gulp.watch('src/pages/**/*.html', pages);
	gulp.watch('src/assets/scss/**/*.{scss, sass}', css);
	gulp.watch('src/assets/js/**', js);
	gulp.watch('src/assets/images/**', images);
}

// creating server using live-server
server = () => {
	const params = {
		port: 8181, // Set the server port. Defaults to 8080.
		host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
		root: "./public", // Set root directory that's being served. Defaults to cwd.
		open: true, // When false, it won't load your browser by default.
		// ignore: '', // comma-separated string for paths to ignore
		// file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
		// wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
		// mount: ['./node_modules'], // Mount a directory to a route.
		logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
		middleware: [function(req, res, next) { next(); }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
	};
	liveServer.start(params);
}


defaultTask = () => {
	series(build, watch);
}

exports.build = series(clean, parallel(pages, js, css, images, fonts));
exports.default = series(clean, parallel(pages, js, css, images, fonts), parallel(server, watch));
exports.css = css;