const {parallel, series, src, dest, watch} = require('gulp')

function html()
{
	return src('src/pages/**/*.html')
	.pipe(panini({
		root: 'pages/',
		layouts: 'layouts/',
		partials: 'partials/',
		helpers: 'helpers/',
		data: 'data/'
	}))
	.pipe(dest('public'));
}

function panini_refresh(cb) {
	panini.refresh();
	cb();
}


exports.default = function(){
	watch('src/pages/**/*.html', html)
	watch(['src/**', '!src/assets/**', '!src/pages/**'], panini_refresh);
}

