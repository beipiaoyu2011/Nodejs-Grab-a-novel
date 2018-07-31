var axios = require('axios');
var cheerio = require('cheerio');
var fetchUrl = 'https://book.qidian.com/info/1012477973#Catalog';
var all_url = [];
var all_title = [];
var fetchData = require('./fetchData');
var LIST_FILE_NAME = '';//章节 list
var OUTPUT_FILE_NAME = '';// 输出文件
var CONTENT_ID = '';//子页面 dom id

var argv = process.argv[2];// baijie  mingdian
console.log('=============start write ', argv, ' text==============');
console.log('准备写入：', process.argv[2], '.txt');

// if (argv == 'baijie') {
//     fetchUrl = 'https://www.sjtxt.la/book/73017/';
//     CONTENT_ID = '#content1';
// } else if (argv == 'mingdian') {
//     fetchUrl = 'http://www.dingdian.me/50424/';
//     CONTENT_ID = '#content';
// }
CONTENT_ID = '.j_readContent';
LIST_FILE_NAME = argv + '_list.txt';
OUTPUT_FILE_NAME = argv + '.txt';
if (!fetchUrl) return;
axios.get(fetchUrl).then(res => {
    var $ = cheerio.load(res.data);
    var $list = $('#j-catalogWrap .volume').eq(1).find('.cf a');
    $list.each(function (n) {
        var href = 'https:' + $(this).attr('href'),
            title = $(this).text();
        all_title.push(title);
        all_url.push(href);
    });
    // console.log(fetchUrl, all_title, all_url);
    // return;
    fetchData({
        TITLES: all_title,
        URLS: all_url,
        LIST_FILE_NAME: LIST_FILE_NAME,
        OUTPUT_FILE_NAME: OUTPUT_FILE_NAME,
        CONTENT_ID: CONTENT_ID
    });
});


