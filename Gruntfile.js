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
        
        copy: {
            styles: {
                src: 'css/dest/styles.min.css',
                dest: 'css/styles.min.css'
            }
        },
        
        watch: {
            grunt: {
                files: ['Gruntfile.js'],
                tasks: ['manifest']
            },
            
            styles: {
                files: ['css/src/*.less'],
                tasks: ['less:style', 'copy:styles', 'manifest']
            },
            
            other_files: {
                files: [
                    'js/*.js',
                    'js/views/*.js',
                    'locales/*/*.json',
                    'static/*/*.html',
                    'templates/*.html'
                ],
                
                tasks: ['manifest']
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    
    grunt.registerTask('default', ['less:style', 'copy:styles']);
    
    grunt.registerTask('manifest',
                       'Generate HTML5 application cache manifest file',
                       function () {
        
        var manifest_template,
            manifest_date,
            manifest_text;
        
        manifest_date = grunt.template.today('dd-mm-yyyy HH:MM:ss');
        
        manifest_template = [
            "CACHE MANIFEST",
            "# <%= manifest_date %>",
            "index.html",
            // CSS
            "css/styles.min.css",
            "css/bootstrap.min.css",
            // JavaScript
            "js/lib/backbone.min.js",
            "js/lib/bootstrap.min.js",
            "js/lib/i18next.min.js",
            "js/lib/jquery.min.js",
            "js/lib/require.min.js",
            "js/lib/underscore.min.js",
            "js/lib/backbone-min.map",
            "js/lib/underscore-min.map",
            "js/views/application.js",
            "js/views/static.js",
            "js/app.js",
            "js/stegano.js",
            "js/text.js",
            // fonts
            "fonts/glyphicons-halflings-regular.eot",
            "fonts/glyphicons-halflings-regular.svg",
            "fonts/glyphicons-halflings-regular.ttf",
            "fonts/glyphicons-halflings-regular.woff",
            // locales
            "locales/dev/translation.json",
            "locales/en/translation.json",
            "locales/ru/translation.json",
            "locales/ua/translation.json",
            // Static pages
            "/static/about/about_en.html",
            "/static/about/about_ru.html",
            "/static/about/about_ua.html",
            "/static/help/help_en.html",
            "/static/help/help_ua.html",
            "/static/help/help_ru.html",
            // templates
            "/templates/upload_template.html",
            // images
            "/img/help/1.png",
            "/img/help/2.png",
            "/img/help/3.png",
            "/img/help/4.png",
            "/img/help/5.png",
            "NETWORK:",
            "*"
        ].join('\n');
        
        manifest_text = grunt.template.process(manifest_template, {
            data: {
                manifest_date: manifest_date
            }
        });
        
        grunt.file.write('cache.manifest', manifest_text);
        
        grunt.log.ok('Manifest file created with date ' + manifest_date);
    });
};