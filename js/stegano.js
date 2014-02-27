/**
 * Модуль стеганографии. В данном модуле определен единственный класс Stegano,
 * реализующий операции стеганографии файлов BMP.
 * 
 * @module Stegano
 */
define(function () {
    'use strict';
    var getBit,         // получение бита в числе
        setBit,         // установка бита в числе
        ab2str,
        str2ab,
        readSteganedBytes,
        writeBytesSteganed,
        Stegano;
    /**
     * Получение бита в байте по его номеру, нумерация начинается c права на
     * лево, нумерация начинается с 0 по 7
     *
     * @method getBit
     * @for Stegano
     * @private
     * @param {Number} number - число из которого извлекается бит
     * @param {Number} n - номер бита в байте, нумерация начинается с 0 по 7
     * @returns {Number} - значение указанного бита (0 или 1)
     */
    getBit = function (number, n) {
        return (number & (1 << n)) ? 1 : 0;
    };
    /**
     * Установка бита в байте по его номеру, нумерация начинается
     * с право на лево, с 0 по 7
     *
     * @method setBit
     * @for Stegano
     * @private
     * @param {Number} number - число в котором устанавливается бит
     * @param {Number} n - номер бита в байте, номера считаются c право налево
     * @param {Bool} set - значение указанного бита (true (1) или false (0))
     * @return {Number} - Модифицированное число
     */
    setBit = function (number, n, set) {
        var result;
        
        if (set) {
            result = number | (1 << n);
        } else {
            result = number & (~(1 << n));
        }
        
        return result;
    };
    /**
     * Преобразование объекта буфера в строку
     *
     * @method ab2str
     * @private
     * @for Stegano
     * @param {ArrayBuffer} buffer - объект буфера для преобразования в строку
     * @return {String} - строка, результат преобразования
     */
    ab2str = function (buffer) {
        return String.fromCharCode.apply(null, new Uint16Array(buffer));
    };
    /**
     * Преобразование строки в байтовый буфер
     * 
     * @method str2ab
     * @private
     * @for Stegano
     * @param {String} str строка для преобразования
     * @returns {ArrayBuffer}  байтовый буфер, результат преобразования
     */
    str2ab = function (str) {
        var buf,
            bufView,
            strLen,
            i;
        
        buf = new ArrayBuffer(str.length * 2); // 2 байта для каждого симола
        bufView = new Uint16Array(buf);
        strLen = str.length;
        
        for (i = 0; i < strLen; i += 1) {
            bufView[i] = str.charCodeAt(i);
        }
        
        return buf;
    };
    /**
     * Читает указанное количество зашифрованных байт в
     * из буфера,
     *
     * @method readSteganedBytes
     * @private
     * @param {ArrayBuffer} ab буфер из которого читаем данные
     * @param {Number} n количество байт которые необходимо прочитать
     * @param {Number} offset отступ от начала буфера в байтах
     * 
     * @returns {ArrayBuffer} buf буфер с собранными данными
     */
    readSteganedBytes = function (ab, n, offset) {
        var dv,         // объект представление буфера 
            bitLength,  // длина буфера в битах
            i,          // счетчик цикла по байтам буфера
            cb,         // циклический счетчик бит
            retBuff,    // буфер собираемых данных
            arr,        // типизированный массив собираемых данных
            buffPtr,    // указатель на байт в собираемом буфере
            bit;
        
        bitLength = n * 8;
        cb = 0;
        buffPtr = 0;
        retBuff = new ArrayBuffer(n);
        arr = new Uint8Array(retBuff);
        dv = new DataView(ab, offset, bitLength);
        
        for (i = 0; i < bitLength; i += 1) {
            bit = (getBit(dv.getUint8(i), 7) > 0) ? true : false;
            arr[buffPtr] = setBit(arr[buffPtr], cb, bit);
            
            buffPtr = (cb === 7) ? buffPtr + 1 : buffPtr;
            cb = (cb < 7) ? cb + 1 : 0;
        }
        
        return retBuff;
    };
    /**
     * Запись байт в буфер стеганографическим методом
     *
     * @method writeBytesSteganed
     * @private
     * @param {ArrayBuffer} ab - буфер в который производится запись 
     * @param {ArrayBuffer} bytes - буфер с записуемыми данными
     * @param {Number} - отступ от начала буфера в который производится запись
     */
    writeBytesSteganed = function (ab, bytes, offset) {
        var abDataView, // объект представления данных для буфера в который пишем
            btDataView, // объект представления данных для буфера из которого пишем
            bitsLength, // длина записываемой информации в битах
            buffPtr,    // указатель на байт в буфере из которого пишем
            cb,         // указатель на бит в буфере из которого пишем
            i,          // счетчик цикла, указатель на байт в буфере в который пишем
            writeByte,  // записываемый байт
            writeBit,   // модифицируемый стеганографической информацией
                        // байт из буфера в который пишем 
            bit;        // записываемый бит
        
        abDataView = new DataView(ab, offset);
        btDataView = new DataView(bytes);
        bitsLength = bytes.byteLength * 8;
        buffPtr = 0;
        cb = 0;
        
        for (i = 0; i < bitsLength; i += 1) {
            writeByte = btDataView.getUint8(buffPtr);
            writeBit = abDataView.getUint8(i);
            bit = (getBit(writeByte, cb) > 0) ? true : false;
            writeBit = setBit(writeBit, 7, bit);
            abDataView.setUint8(i, writeBit);
            
            buffPtr = (cb === 7) ? buffPtr + 1 : buffPtr;
            cb = (cb < 7) ? cb + 1 : 0;
        }
    };
    /**
     * Класс реализующий операции стеганографии файла BMP.
     * 
     * @class Stegano
     * @constructor
     * @param abFile {ArrayBuffer} - объект буфера файла над которым
     * производятся операции стеганографии
     **/
    Stegano = function (abFile) {
        var dv;
        
        this.abFile = abFile;
        this.dv = dv = new DataView(abFile);
        this.bArray = new Uint8Array(abFile);
        // читаем BITMAPFILEHEADER запоминаем его в атрибутах объекта
        this.bfType = dv.getUint16(0x00, true); // сигнатура формата 424D
        this.bfSize = dv.getUint32(0x02, true); // размер файла в байтах
        this.bfReserved1 = dv.getUint16(0x06, true); // Зарезервированы и 
        this.bfReserved2 = dv.getUint16(0x08, true); // должны содержать ноль.
        // положение пиксельных данных
        // относительной начала данной структуры (в байтах)
        this.bfOffBits = dv.getUint32(0x0A, true); 
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
        var steganedBytes,
            steganedText,
            steganedView,
            sign,
            byteLength,
            info;
            
        info = {
            Stegano: false,
            SteganoLength: 0,
            SteganoMax: Math.floor((this.abFile.byteLength - this.bfOffBits - 6) / 16)
        };
        
        steganedBytes = readSteganedBytes(this.abFile, 6, this.bfOffBits);
        steganedView = new DataView(steganedBytes);
        
        sign = String.fromCharCode(steganedView.getUint8(0),
                                   steganedView.getUint8(1));
        byteLength = steganedView.getUint32(2);
        
        if ((sign === "ST") && (byteLength > 0)) {
            info.Stegano = true;
            info.SteganoLength = byteLength;
        }
        
        return info;
    };
    /**
     * Читает скрытую информацию из файла
     * 
     * @method read
     * @return {String} - извлеченный скрытый текст
     */
    Stegano.prototype.read = function () {
        var steganedText,
            steganoInfo;
        
        steganedText = "";
        steganoInfo = this.check();
        
        if (steganoInfo.Stegano) {
            // 6 * 8 -> 6 байт записанных по одному биту в байт
            steganedText = ab2str(readSteganedBytes(this.abFile,
                                             steganoInfo.SteganoLength,
                                             this.bfOffBits + (6 * 8)));
        }
        
        return steganedText;
    };
    /**
     * Записывает скрываемый текст в файл
     * 
     * @method write
     * @param {String} text - строка записываемого скрываемого текста
     */
    Stegano.prototype.write = function (text) {
        var sign,
            txtBuff,
            steganoHeader,
            stHeadView;
            
        sign = "ST";
        // Преобразовываем полученную строку в буфер байтов
        txtBuff = str2ab(text);
        // Формируем заголовок стеганографической информации
        steganoHeader = new ArrayBuffer(6);
        stHeadView = new DataView(steganoHeader);
        
        stHeadView.setUint8(0, sign.charCodeAt(0));
        stHeadView.setUint8(1, sign.charCodeAt(1));
        stHeadView.setUint32(2, txtBuff.byteLength);
        
        // записываем заголовок стеганографической информации
        writeBytesSteganed(this.abFile, steganoHeader, this.bfOffBits);
        // записываем текст
        // 6 * 8 -> 6 байт записанных по одному биту в байт
        writeBytesSteganed(this.abFile, txtBuff, this.bfOffBits + (6 * 8));
    };
    
    return Stegano;
});