/**
 * Модуль стеганографии. В данном модуле определен единственный класс Stegano,
 * реализующий операции стеганографии файлов BMP.
 * 
 * @module Stegano
 */
define(function () {
    'use strict';
    /**
     * Класс реализующий операции стеганографии файла BMP.
     * 
     * @class Stegano
     * @constructor
     * @param abFile {ArrayBuffer} - объект буфера файла над которым
     * производятся операции стеганографии
     **/
    var Stegano = function (abFile) {
        this.abFile = abFile;
    };
    /**
     * Проверяет наличие скрытой информации в файле,
     * расчитывает возможное количество записываемой 
     * информации в файл.
     * 
     * @method check
     * @returns {Object} - объект описывающий есть ли в файле скрытая
     * информация, и максимальную длину текста, который можно скрыть в данном
     * файле.
     */
    Stegano.prototype.check = function () {
        
    };
    /**
     * Читает скрытую информацию из файла
     * 
     * @method read
     * @return {String} - извлеченный скрытый текст
     */
    Stegano.prototype.read = function () {
        
    };
    /**
     * Записывает скрываемый текст в файл
     * 
     * @method write
     * @param {String} text - строка записываемого скрываемого текста
     */
    Stegano.prototype.write = function (text) {
        
    };
    
    return Stegano;
});