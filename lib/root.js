const bodyParser = require('body-parser');
const db = require('./db');
const auth = require('./util');
const logger = require('./logger');
var sanitizeHtml = require('sanitize-html');

module.exports = {

    //'/' 요청 응답
    home : (req, res)=>{

        //로그인 정보 반환 
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        //로그인 상태일 경우 회원 관리 페이지로 이동
        if(login===true){
            return res.redirect('/member/1');
        }

        //로그아웃 상태일 경우 로그인 화면 전송
        else{

            //ejs 템플릿에 전달할 파라미터들 저장
            //login.ejs 파일을 <%- include(body) %> 태그에 포함시켜 로그인 화면 구성
            var context = {
                who : name,
                login : login,
                body : 'login.ejs',
            };

            //mainFrame.ejs 파일에 context 파라미터를 전달하여 전송
            req.app.render('mainFrame', context, (error, html)=>{

                //화면 구성 실패 에러 처리
                if(error){
                    logger.error(`mainFrame 렌더링 오류`, error);
                    res.status(500).send(`<h1>서버 내부 오류 발생</h1>`)
                    return;
                }
                res.end(html);
            })
        }
    },

    //'/login' 요청 응답
    login : (req, res)=>{

        //post 요청으로 받아온 body 내부의 nickName과 password를 저장
        //sql injection 등의 공격을 대비하여 sanitizeHtml 사용
        var post = req.body;
        var sntzedNickName = sanitizeHtml(post.nickName);
        var sntzedPassword = sanitizeHtml(post.password);
        logger.debug(`${post.nickName} 로그인 시도`);

        //post로 받아온 파리미터들로 ServerDB에 쿼리 요청
        db.query(`SELECT COUNT(*) AS num FROM member WHERE nickName = ? AND password = ? AND role = 'administrator'`,
        [sntzedNickName, sntzedPassword], (error, results)=>{
            
            //데이터베이스 에러 처리
            if(error){
                logger.error(`데이터베이스 오류 발생`, error);
                res.status(1003).send(`<h1>데이터베이스 오류</h1>`);
                return;
            }
            

            //해당 nickName과 password를 만족하며 role이 administraotr일 경우 세션에 해당 계정 정보 저장
            if(results[0].num===1){
                db.query(`SELECT nickName FROM member WHERE nickName = ? and password = ?`,
                [sntzedNickName, sntzedPassword], (error, result)=>{

                    //데이터베이스 에러 처리
                    if(error){
                        logger.error(`데이터베이스 오류 발생`, error);
                        res.status(1003).send(`<h1>데이터베이스 오류</h1>`);
                        res.redirect('/');
                        return;
                    }

                    req.session.is_logined = true;
                    req.session.name = result[0].nickName;
                    logger.debug(`로그인 여부 : ${req.session.is_logined} 로그인 정보 : ${req.session.name}`);

                    //세션 정보 저장 완료 후 '/member' 자동 요청
                    res.redirect('/member/1');
                }
                )
            }

            //계정 정보가 잘못되었을 경우 세션 초기화 및 로그인 화면 제전송
            else{
                logger.debug(`로그인 실패. 로그인 시도 nickName : ${post.nickName}`);
                req.session.is_logined = false;
                req.session.name = 'Guest';
                res.redirect('/');
            }
        }
        )
    },

    logout : (req, res)=>{

        //로그인 세션 삭제
        req.session.destroy((error)=>{

            //로그아웃 실패 에러 처리
            if(error){
                logger.error(`로그아웃 실패`, error);
                res.redirect('/');
            }

            //세션 삭제 후 로그인 전 메인화면으로 이동
            res.redirect('/');
        })
    }
}