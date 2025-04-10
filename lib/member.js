const bodyParser = require('body-parser');
const db = require('./db');
const auth = require('./util');
var sanitizeHtml = require('sanitize-html');

module.exports = {

    //'/member' 요청 응답
    view : (req, res)=>{

        //로그인 정보 반환 
        var { login, name } = auth.authIsOwner(req, res);

        //현재 페이지 저장
        var currentPage = req.params.currentPage;

        //로그인 되어있을 경우에만 접근 허용
        if(login===true){

            //Server DB에 member 테이블 쿼리 요청
            db.query(`SELECT * FROM member WHERE role = 'user'`, (error, results)=>{

                //페이징 기능을 위한 페이지 수와 표시할 칼럼 수 계산
                var pageNum = Math.ceil(results.length / 10);
                if (results.length - ((currentPage - 1) * 10) >= 10){
                    columns = 10;
                } else {
                    columns = results.length % 10;
                }

                //ejs 템플릿에 넘겨줄 파라미터 저장
                //mainFrame <%- include(body) %> 태그에 member.ejs파일 전송하여 회원 관리 화면 구성
                var context = {
                    who : name,
                    login : login,
                    body : 'member.ejs',
                    member : results,
                    currentPage : currentPage,
                    pageNum : pageNum,
                    columns : columns
                };

                //mainFrame.ejs 화면에 context 내용 추가하여 전송
                req.app.render('mainFrame', context, (err, html)=>{
                    res.end(html);
                })
            })
        }
    },

    //'/member/delete/:memberId' 요청 응답
    delete : (req, res)=>{

        //member.ejs 파일에서 전달된 파라미터인 memberId를 저장
        var memberId = req.params.memberId;

        //memberId가 동일한 컬럼을 DB에서 삭제
        db.query(`DELETE FROM member WHERE memberId = ?`,
            [memberId], (err, result)=>{

                //삭제 후 다시 회원 관리 화면으로 연결
                res.redirect('/member');
                res.end();
            }
        )


    },

    //'/member/search' 요청 응답
    search : (req, res)=>{

        //로그인 정보 반환 
        var { login, name } = auth.authIsOwner(req, res);

        //post 방식으로 전달된 검색어에 wildcard를 추가하여 저장
        var post = req.body;
        var sntzedSearchTerm = sanitizeHtml(post.searchTerm);
        var sntzedSearchTerm = `%${sntzedSearchTerm}%`;
        var role = 'user';

        //Server DB에 검색어를 포함한 member 테이블 쿼리 요청
        db.query('SELECT * FROM member WHERE (nickName LIKE ? OR birth LIKE ? OR phoneNumber LIKE ? OR genre LIKE ? OR job LIKE ? OR completion LIKE ? OR `rank` LIKE ?) AND role = ?',
            [sntzedSearchTerm, sntzedSearchTerm, sntzedSearchTerm, sntzedSearchTerm, sntzedSearchTerm, sntzedSearchTerm, sntzedSearchTerm, role], (error, results)=>{

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
            }
        )
    }

}