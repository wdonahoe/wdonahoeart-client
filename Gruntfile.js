module.exports = function(grunt){

	grunt.initConfig({
		scripts: {
			files: ['components/**/*.js','shared/**/*.js','Gruntfile.js'],
			tasks: ['jshint']
		},
		less: {
			project: {
				options: {
					paths: ['static/less'],
					yuicompress: true
				},
				src: ['static/less/styles.less'],
				dest: 'static/css/styles.css'
			}
		},
		watch: {
			css: {
				files: ['static/less/*.less'],
				tasks: ['less']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('assemble-less');

	grunt.registerTask('default',['less','watch','jshint']);
}