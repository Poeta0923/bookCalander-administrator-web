const bodyParser = require('body-parser');
const db = require('./db');
const auth = require('./util');
var sanitizeHtml = require('sanitize-html');

module.exports = {

    //'/' 요청 응답
    home : (req, res)=>{

        //로그인 정보 반환 
        var { login, name } = auth.authIsOwner(req, res);

        //로그인 상태일 경우 회원 관리 화면 전송
        if(login===true){
            db.query(`SELECT * FROM member;`, (error, results)=>{
                var context = {
                    who : name,
                    login : login,
                    body : 'member.ejs',
                    member : results
                };
                req.app.render('mainFrame', context, (err, html)=>{
                    res.end(html);
                })
            })
        }

        //로그아웃 상태일 경우 로그인 화면 전송
        else{
            var context = {
                who : name,
                login : login,
                body : 'login.ejs',
            };
            req.app.render('mainFrame', context, (err, html)=>{
                res.end(html);
            })
        }
    }
}