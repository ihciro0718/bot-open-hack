console.info('app.js start~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
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
    console.info('process.on==============================================================');
    console.error(e);
});

//config for your database
var sql=require('mssql');
var config = ({
        user: 'bot-open-hack',
        password: 'P@ssw0rd',
        server: 'bot-open-hack.database.windows.net',   //這邊要注意一下!!
        database: 'bot-open-hack', //database名稱
        options: {
            encrypt: true // Use this if you're on Windows Azure
        }});
const pool = new sql.ConnectionPool(config);
// HTTP POST
app.post('/order', function (req, res) {
    //console.log(getRandomStr(10));
    var line_id = "'" + req.body.line_id + "'",
    content = "'" + req.body.content + "'",
    phone = "'" + req.body.phone + "'";
    InsertToDB(res, line_id, content, getRandomStr(), phone);
});
module.exports = app;

app.get('/menu/:id',function(req,res){
    //res.send('id: ' + req.params.id);
    var id = req.params.id;
    QueryToDB(id, res);
});
console.log('Server is running!');

function QueryToDB(id, res) {
    pool.connect(function(err){
        //create Request object
        var request = new sql.Request(pool);
        var QuerySQL = 'select NAME, PICTURE, CAL, PRICE from Detail_menu WHERE SEQ=@SEQ';
        QuerySQL = QuerySQL.replace('@SEQ', id);
        request.query(QuerySQL,
        function(err, result){
            if(err) console.log(err);
            //send records as a response
            //res.send(result);
            res.writeHead( 200, { 'Content-Type' : 'application/json'});
            var NAME = '"' + result.recordset[0].NAME.trim() + '"';
            var PICTURE = '"' + result.recordset[0].PICTURE.trim() + '"';
            var CAL = result.recordset[0].CAL;
            var PRICE = result.recordset[0].PRICE;
            var str = '{ "code": "200",    "message": "OK" , "data":  {"NAME": @NAME, "PICTURE": @PICTURE, "CAL": @CAL,"PRICE": @PRICE}}';
            str = str.replace('@NAME', NAME).replace('@PICTURE',PICTURE).replace('@CAL',CAL).replace('@PRICE',PRICE);
            var obj = JSON.parse(str);
            res.end( str );
        });
    });
}

function InsertToDB(res, line_id, content, seq, phone) {
    pool.connect(function(err){         
    var request = new sql.Request(pool);
        var insertSQL = 'INSERT INTO Cus_menu (LINE_ID ,訂單成立時間, 訂單內容, 取餐序號, 手機號碼) VALUES (@line_id, Getdate(), @content, @seq, @phone);';
        insertSQL = insertSQL.replace('@line_id', line_id).replace('@content',  content ).replace('@seq', seq).replace('@phone',phone );
        request.query(insertSQL,
        function(err,recordset){
            if(err) 
            {
                console.log(err);
            }
            else
            {
                res.writeHead( 200, { 'Content-Type' : 'application/json'});
                var str = '{ "code": "200",    "message": "OK" }';
                var obj = JSON.parse(str);
                res.end( str );
            }
        });
    });
}
    
function getRandomStr() {
    var randomStr = '';
    for(var i = 0 ; i < 10 ; i++)
    {
        randomStr+=Math.floor(Math.random() * Math.floor(10));
    }
    return randomStr;
}
app.get('/cusmenu',function(req,res){ //主頁
    request.header("Content-Type", 'text/html');
    fs.readFile(__dirname + '/cusmenu.html', 'utf8', function (err, data) {
        if (err) {
            console.log(err);
            this.res.send(err);
            return;
        }
        this.res.send(data);
    }.bind({ req: request, res: response }));
});

app.get('/search/:num',function(req,res){
    //res.send('id: ' + req.params.id);
    var num = req.params.num;
    FindDB(num, res);
});

function FindDB(id, res) {
    pool.connect(function(err){
        //create Request object
        var request = new sql.Request(pool);
        var QuerySQL = 'select * from Cus_menu WHERE (cum_num = ' +id+')';
        //QuerySQL = QuerySQL.replace('@SEQ', id);
        request.query(QuerySQL, function(err, result){
            if(err) console.log(err);
            //send records as a response
            //res.send(result);
            /*
            res.writeHead( 200, { 'Content-Type' : 'application/json'});
            var NAME = '"' + result.recordset[0].NAME.trim() + '"';
            var PICTURE = '"' + result.recordset[0].PICTURE.trim() + '"';
            var CAL = result.recordset[0].CAL;
            var PRICE = result.recordset[0].PRICE;
            var str = '{ "code": "200",    "message": "OK" , "data":  {"NAME": @NAME, "PICTURE": @PICTURE, "CAL": @CAL,"PRICE": @PRICE}}';
            str = str.replace('@NAME', NAME).replace('@PICTURE',PICTURE).replace('@CAL',CAL).replace('@PRICE',PRICE);
            var obj = JSON.parse(str);
            res.end( str );
            */
            res.send(result);
        });
    });
}
 /*config.connect(function(error){ // mysql
    if(!!error){
        console.log('Error');
        console.log(error);
    }else{
        console.log('Connected');
    }
});*/