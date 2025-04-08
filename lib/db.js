var mysql = require('mysql');
//db 연결. 서버에 업로드 시 내용 변경 예정
var db = mysql.createConnection({
    host : 'localhost',
    user : 'nodejs',
    password : 'nodejs',
    database : 'bookCalander',
    multipleStatements : true
});

//db 연결
db.connect();
module.exports = db;