/**
 * Главный модуль приложения
 *
 * @module app
 */
(function() {
    "use strict";
    
    require.config({
        baseUrl: '/js',
        
        shim: {
            'underscore': {
                'exports': '_'
            },
            
            'backbone': {
                deps: ['jquery', 'underscore'],
                exports: 'Backbone'
            },
            
            'bootstrap': ['jquery'],
        },
        
        paths: {
            jquery: 'lib/jquery.min',
            bootstrap: 'lib/bootstrap.min',
            underscore: 'lib/underscore.min',
            backbone: 'lib/backbone.min',
            i18next: 'lib/i18next.min'
        }
    });
    
    require(["jquery",
             "backbone",
             "views/application",
             "views/about",
             "views/help",
             "bootstrap"
    ], function ($,
                 Backbone,
                 ApplicationView,
                 AboutView,
                 HelpView) {
        
        var ApplicationRouter,
            application;
        
        ApplicationRouter = Backbone.Router.extend({
            currentView: null,
            
            routes: {
                ''      : 'index',
                'about' : 'about',
                'help'  : 'help'
            },
            
            initialize: function () { },
            
            index: function () {
                this.currentView && this.currentView.remove();
                this.currentView = new ApplicationView();
                $('.container').append(this.currentView.render().el);
            },
            
            about: function () {
                this.currentView && this.currentView.remove();
                this.currentView = new AboutView();
                $('.container').append(this.currentView.render().el);
            },
            
            help: function () {
                this.currentView && this.currentView.remove();
                this.currentView = new HelpView();
                $('.container').append(this.currentView.render().el);
            }
        });
        
        application = new ApplicationRouter();
        Backbone.history.start();
    });
} ());