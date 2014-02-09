module.exports = function(grunt) {
    'use strict';
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        less: {
            style: {
                options: {
                    cleancss: true
                },
                
                files: {
                    "css/dest/styles.min.css": "css/src/styles.less"
                }
            }
        },
        
        watch: {
            grunt: {
                files: ['Gruntfile.js']
            },
            
            styles: {
                files: ['css/src/*.less'],
                tasks: ['less']
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    
    grunt.registerTask('default', ['less'])
};