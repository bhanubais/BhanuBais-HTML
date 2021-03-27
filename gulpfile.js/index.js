const {parallel, series} = require('gulp');


function clean(cb) {
	console.log("Task: clean");
	cb();
}

function cssTranspile(cb) {
	console.log("Task: cssTranspile");
	cb();
}

function cssMinified(cb) {
	console.log("Task: cssMinified");
	cb();
}

function jsTranspile(cb) {
	console.log("Task: jsTranspile");
	cb();
}

function jsBundle(cb) {
	console.log("Task: jsBundle");
	cb();
}

function jsMinified(cb) {
	console.log("Task: jsMinified");
	cb();
}

function publish(cb) {
	console.log("Task: publish");
	cb();
}

function livereload(cb) {
	console.log("Task: livereload");
	cb();
}


if (process.env.NODE_ENV === 'production') {
	exports.build = series(
		clean,
		parallel(cssTranspile,
			series(jsTranspile, jsBundle)),
		parallel(cssMinified, jsMinified),
		publish
	);
} else {
	exports.build = series(
		clean,
		parallel(cssTranspile,
			series(jsTranspile, jsBundle)),
		livereload
	);
}


