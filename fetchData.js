var fs = require('fs');
var axios = require('axios');
var cheerio = require('cheerio');

var fetchData = function (opts) {
    var url = opts.URLS,
        LIST_FILE_NAME = opts.LIST_FILE_NAME,
        OUTPUT_FILE_NAME = opts.OUTPUT_FILE_NAME,
        CONTENT_ID = opts.CONTENT_ID,
        TITLES = opts.TITLES;
    var writeStream = fs.createWriteStream(LIST_FILE_NAME);
    for (var i = 0; i < url.length; i++) {
        writeStream.write('\n' + TITLES[i] + '\n' + ' ' + url[i] + '\n');
    }
    writeStream.end();
    var arr = [];
    function getData(i) {
        return new Promise(resolve => {
            var _url = url[i];
            axios.get(_url).then(res => {
                var $ = cheerio.load(res.data, {
                    ignoreWhitespace: false,
                    xmlMode: false
                });                
                arr[i] = '\n' + TITLES[i] + '\n' + $(CONTENT_ID).text();
                resolve();
            });
        });
    }
    for (var promiseArr = [], i = 0; i < url.length; i++) {
        promiseArr.push(getData(i));
    }
    Promise.all(promiseArr).then(function () {
        var writeStream = fs.createWriteStream(OUTPUT_FILE_NAME);
        for (var i = 0; i < arr.length; i++) {
            writeStream.write(' ' + arr[i] + '\n');
        }
        writeStream.on('data', () => {
            console.log('写入开始');
        });
        writeStream.on('finish', () => {
            console.log('写入结束');
        });
        writeStream.end();
    });
};

module.exports = fetchData;
