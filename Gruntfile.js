module.exports = function(grunt){

	grunt.initConfig({
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
		},
		concat: {
			options: {
			    separator: ';'
			},
			dist: {
				src: ['app.js','components/**/*.js','shared/**/*.js'],
				dest: 'dist/app.js'
			}
		},
		uglify: {
			dist: {
				files:{
					'dist/app.min.js': ['dist/app.js']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('assemble-less');

	grunt.registerTask('default',['less','watch']);
	grunt.registerTask('build',['concat','uglify']);
}