// Application Log
var log4js = require('log4js');
var log4js_extend = require('log4js-extend');
log4js_extend(log4js, {
    path: __dirname,
    format: '(@file:@line:@column)'
});
log4js.configure(__dirname + '/log4js.json');
var logger = log4js.getLogger('nodeCent');
logger.info('app.js start~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
var express = require('express');
var hashtable = require(__dirname + '/hashtable.js');

// 建立 express service
var express = require('express');  // var 宣告express物件， require請求
var app = express();
var fs = require('graceful-fs');
var mssql = require('mssql'); // mssql

var port = process.env.PORT || 8080;  //run 在8080 port上
var http = require('http');
var server = http.Server(app).listen(port);
var bodyParser = require('body-parser');  //JSON解析body的資料
var url = require("url");

app.use(bodyParser.urlencoded({  //app使用bodyParser來做解析
    extended: true
}));
app.use(bodyParser.json());
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    next();
});
app.use(express.static(__dirname + '/pages/tpe/channelwebs/assets'));

process.on('uncaughtException', function (e) {
    logger.info('process.on==============================================================');
    logger.error(e);
});

    //config for your database
    var config = ({
        user: 'bot-open-hack',
        password: 'P@ssw0rd',
        server: 'bot-open-hack.database.windows.net',   //這邊要注意一下!!
        database: 'bot-open-hack', //database名稱
        options: {
            encrypt: true // Use this if you're on Windows Azure
        }
    });

config.connect(function(error){ // mysql
    if(!!error){
        console.log('Error');
        console.log(error);
    }else{
        console.log('Connected');
    }
});