var gulp = require('gulp'),
    express = require('express'),
    app = express(),
    PORT = 8000;

function startExpress() {

    app.use(express.static(__dirname));

    app.listen(PORT);

    console.log('Started server on port', PORT);

}

gulp.task('server', [], function() {
    startExpress();
});

gulp.task('default', ['server'], function() {
});
