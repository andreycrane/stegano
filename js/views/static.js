/**
 * Модуль вида статических страниц StaticView
 * 
 * @module about
 */
define(["jquery",
        "underscore",
        "backbone",
        "i18next"
], function ($, _, Backbone, i18n) {
    "use strict";
    /**
     * Вид статической страницы 
     * 
     * @class StaticView
     * @extends Backbone.View
     * @constructor
     */
    var StaticView = Backbone.View.extend({
        id: "about_view",
        tagName: "div",
        
        initialize: function (options) {
            options = options || {};
            this.path = options.path || "";
            // прослушиваем событие смены языка
            this.on("language", this.language);
        },
        /**
         * Метод рендеринга вида в его контейнер
         * 
         * @method render
         */
        render: function () {
            this.language();
            return this;
        },
        /**
         * Метод смены языка представления.
         *
         * @method language
         */
        language: function () {
            var lang = i18n.lng(),
                that = this;
            
            $.get('/static/' + this.path + lang + '.html', function (content) {
                that.$el.empty()
                        .append(content);
            });
        }
    });
    
    return StaticView;
});