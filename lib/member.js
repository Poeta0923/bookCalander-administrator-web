const bodyParser = require('body-parser');
const db = require('./db');
const auth = require('./util');

module.exports = {

    //'/member' 요청 응답
    view : (req, res)=>{

        //로그인 정보 반환 
        var { login, name } = auth.authIsOwner(req, res);

        //로그인 되어있을 경우에만 접근 허용
        if(login===true){

            //Server DB에 member 테이블 쿼리 요청
            db.query(`SELECT * FROM member WHERE role = 'user'`, (error, results)=>{

                //ejs 템플릿에 넘겨줄 파라미터 저장
                //mainFrame <%- include(body) %> 태그에 member.ejs파일 전송하여 회원 관리 화면 구성
                var context = {
                    who : name,
                    login : login,
                    body : 'member.ejs',
                    member : results
                };

                //mainFrame.ejs 화면에 context 내용 추가하여 전송
                req.app.render('mainFrame', context, (err, html)=>{
                    res.end(html);
                })
            })
        }
    }
}