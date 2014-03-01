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
            underscore: {
                exports: '_'
            },
            
            backbone: {
                deps: ['jquery', 'underscore'],
                exports: 'Backbone'
            },
            
            bootstrap: ['jquery'],
            
            i18next: {
                deps: ['jquery'],
                exports: 'i18n'
            }
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
             "i18next",
             "views/application",
             "views/static",
             "bootstrap"
    ], function ($,
                 Backbone,
                 i18n,
                 ApplicationView,
                 StaticView) {
        
        var ApplicationRouter,
            application;
        
        // инициализация интернационализации
        i18n.init({
            resGetPath: '/locales/__lng__/__ns__.json',
            getAsync: false
        });
        // "переводим" страницу
        $('body').i18n();
        // обработчик события переключения языка
        $('#en_lang,' +
          '#ua_lang,' +
          '#ru_lang').click(function (event) {
            var lang = $(event.currentTarget).attr('id').replace('_lang', '');
            // устанавливаем текущий язык
            i18n.setLng(lang, { fixLng: true });
            // "переводим" страницу
            $('body').i18n();
            // вызываем событие смены языка для текущего вида
            application.currentView.trigger('language');
        });
        
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
                $('body').i18n();
            },
            
            about: function () {
                this.currentView && this.currentView.remove();
                this.currentView = new StaticView({ path: 'about/about_' });
                $('.container').append(this.currentView.render().el);
                $('body').i18n();
            },
            
            help: function () {
                this.currentView && this.currentView.remove();
                this.currentView = new StaticView({ path: 'help/help_'});
                $('.container').append(this.currentView.render().el);
                $('body').i18n();
            }
        });
        
        application = new ApplicationRouter();
        Backbone.history.start();
    });
} ());