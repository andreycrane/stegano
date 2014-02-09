/**
 * Главный модуль приложения
 *
 * @module app
 */
(function() {
    "use strict";
    
    require.config({
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
            jquery: 'lib/jquery',
            bootstrap: 'lib/bootstrap',
            underscore: 'lib/underscore',
            backbone: 'lib/backbone'
        }
    });
} ());