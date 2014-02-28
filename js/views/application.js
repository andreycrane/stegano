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
        stegano: null,
        
        initalize: function () {},
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
            'change #file_input': 'fileInputChange',
            'click #close_file_btn': 'close_file',
            'click #stegano_btn': 'stegano_modal',
            'keypress #modal-text': 'count_max_text',
            'click #modal-save': 'stegano_modal_save'
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
                that.$('#source_image').attr('src', URL.createObjectURL(file));
            };
            
            reader.onloadend = function (e) {
                setTimeout(function () {
                    var source_img = that.$('#source_image');
                    
                    upload_container.addClass('onloadend');
                    // разблокируем кнопку закрытия открытого файла
                    that.$('#close_file_btn').removeAttr("disabled");
                    that.$('#stegano_btn').removeAttr('disabled');
                    // выводим загруженное изображение
                    source_img.addClass('onloadend');
                    // переносим его по экрану влево и выводим модальное окно
                    source_img.animate({'margin-left': '-600px' },
                        500,
                        function () { that.stegano_modal(); }
                    );
                    
                }, 500);
                
                that.stegano = new Stegano(e.target.result);
            };
            // запускаем чтение файла как буфера
            reader.readAsArrayBuffer(file);
        },
        /**
         * Метод рендеринга вида в собственный контейнер
         *
         * @method render
         * @chainable
         */
        render: function () {
            this.$el.append(upload_tpl);
            return this;
        },
        /**
         * Вывод модального окна с скрытой в файле информацией извлеченной из
         * загруженного файла если такая есть.
         * 
         * @method stegano_modal
         */
        stegano_modal: function () {
            var modal = this.$("#stegano_modal"),
                txt,
                steg_info;
            
            steg_info = this.stegano.check();
            
            if (steg_info.Stegano) {
                txt = this.stegano.read();
                this.$("#modal-text").text(txt);
                this.$('#symbols_cnt').text(steg_info.SteganoMax - txt.length);
            } else {
                this.$("#modal-text").text("");
                this.$('#symbols_cnt').text(steg_info.SteganoMax);
            }
            
            modal.attr('data-steganomax', steg_info.SteganoMax);
            modal.modal();
        },
        /**
         * Сохранение скрытой информации в новом BMP файле.
         *
         * @method stegano_modal_save
         */
        stegano_modal_save: function () {
            var modal = this.$("#stegano_modal"),
                text,
                blob;
            
            text = this.$('#modal-text').val();
            this.stegano.write(text);
            blob = new Blob([this.stegano.abFile]);
            this.$('#dest_image').attr('src', URL.createObjectURL(blob))
                                 .addClass('onloadend')
                                 .animate({'margin-left': '200px' }, 800);
            
            modal.modal('hide');
        },
        /**
         * Счетчик (в символах) оставшегося места под скрываемую информацию.
         * 
         * @method count_max_text
         */
        count_max_text: function () {
            var steganomax = this.$("#stegano_modal").attr('data-steganomax'),
                modal_text_length = this.$("#modal-text").val().length;
            
            this.$('#symbols_cnt').text(parseInt(steganomax, 10) - modal_text_length);
        },
        /**
         * Метод восстановления первичного состояния вида. Срываются
         * изображения, заново выводиться область загрузки файла,
         * удаляется объект стеганографии.
         *
         * @method close_file
         */
        close_file: function() {
            this.stegano = null;
            
            this.$('#stegano_btn').attr("disabled", "disabled");
            this.$('#close_file_btn').attr("disabled", "disabled");
            
            this.$('#file_input').val('');
            this.$('#source_image, #dest_image').attr('src', '')
                                    .removeClass('onloadend');
            
            this.$('#upload_container').removeClass('onloadstart ' +
                                                    'onprogress ' +
                                                    'onload ' +
                                                    'onloadend');
        }
    });
    
    return ApplicationView;
});
