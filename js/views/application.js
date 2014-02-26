/**
 * Модуль главного вида приложения. Данный модуль и есть
 * реализацией приложения стеганографии в браузере.
 * 
 * @module ApplicationView
 */
define(["jquery",
        "underscore",
        "backbone",
        "stegano",
        "text!/templates/upload_template.html"
], function($,              // jQuery
            _,              // underscore
            Backbone,       // Backbone
            Stegano,        // Класс стеганографии
            upload_tpl) {   // Шаблон формы загрузки файла
    "use strict";
    
    /**
     * Класс приложения стеганографии.
     * 
     * @class ApplicationView
     * @extends Backbone.View
     * @constructor
     **/
    var ApplicationView = Backbone.View.extend({
        id: "application_view",
        tagName: "div",
        
        initalize: function () { },
        /**
         * Список прослушиваемых видом событий:
         *  dragOver, drop - перетаскивание файла на область загрузки;
         *  click #upload_container, click #file_input - для имитации вызова
         *  окна выбора файла для загрузки по щелчку на области загрузки
         *
         * @property events
         * @type {Object}
         **/
        events: {
            'dragover #upload_container': 'handleDragOver',
            'drop #upload_container': 'handleFileSelect',
            'click #upload_container': 'chooseFile',
            'click #file_input': 'fileInputClick',
            'change #file_input': 'fileInputChange'
        },
        /**
         * Обработчик события наведения на область dnd загрузки файла. Метод
         * используется для предопределения поведения браузера по умолчанию,
         * что позволяет нам прослушивать в дальнейшем событие drop.
         *
         * @method handleDragOverd
         * @param {Object} event объект события наведения на область dnd
         **/
        handleDragOver: function (event) {
            event.stopPropagation();
            event.preventDefault();
            event.originalEvent.dataTransfer.dropEffect = 'copy';
        },
        /**
         * Метод обработки перетаскивания файла на область загрузки файла.
         *
         * @method handleFileSelect
         * @param {Object} event объект события
         */
        handleFileSelect: function (event) {
            event.preventDefault();
            this.handleFile(event.originalEvent.dataTransfer.files[0]);
        },
        /**
         * Обработчик щелча мыши на области загрузки файла. Вызывает событие
         * click скрытого элемента file unput для имитации открытия диалога
         * выбора файла для загрузки.
         * 
         * @method chooseFile
         */
        chooseFile: function () { this.$('#file_input').trigger('click'); },
        /**
         * Обработчик щелчка мыши на скрытом file input'e. Необходим для того,
         * чтоб заблокировать рекурсивные вызовы события click. Конкретно,
         * просто блокирует распространение события вверх по DOM.
         *
         * @method fileInputClick
         * @param {Object} event объект события
         */
        fileInputClick: function (event) { event.stopPropagation(); },
        /**
         * Обработчик события выбора файла через file input.
         *
         * @method fileInputChange
         * @param {Object} event объект события
         */
        fileInputChange: function (event) {
            this.handleFile(event.target.files[0]);
        },
        
        /**
         * Обработчик загруженного файл вне зависимости каким именно образом он
         * был загружен в браузер.
         *
         * @method handleFile
         * @param {File} files объект массива с загруженым файлом
         */
        handleFile: function (file) {
            var reader,
                that,
                stegano,
                upload_container;
            
            if (file.type !== "image/bmp") {
                alert("Разрешено использовать только BMP файлы!");
                return;
            }
            
            that = this;
            upload_container = this.$el.children('#upload_container');
            reader = new FileReader();
            
            reader.onloadstart = function () {
                upload_container.addClass('onloadstart');
            };
            
            reader.onprogress = function (e) {
                var percents = (e.loaded / e.total) * 100;
                
                upload_container.addClass('onprogress')
                                .children('#progress_container')
                                .css('width', percents + "%");
            };
            
            reader.onload = function () {
               upload_container.addClass('onload');
                    that.$el.children('#source_image')
                            .attr('src', URL.createObjectURL(file));
            };
            
            reader.onloadend = function (e) {
                setTimeout(function () {
                    upload_container.addClass('onloadend');
                }, 1500);
                
                stegano = new Stegano(e.target.result);
                stegano.check();
            };
            
            reader.readAsArrayBuffer(file);
        },
        
        render: function () {
            this.$el.append(upload_tpl);
            
            return this;
        }
    });
    
    return ApplicationView;
});
