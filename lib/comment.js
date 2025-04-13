const bodyParser = require('body-parser');
const db = require('./db');
const auth = require('./util');
const logger = require('./logger');
var sanitizeHtml = require('sanitize-html');

module.exports = {

    //'/comment' 요청 응답
    view : (req, res)=>{

        //로그인 정보 반환 
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        //현재 페이지 저장
        var currentPage = req.params.currentPage;
        logger.debug(`접속 페이지 : ${currentPage}`);

        //ejs 파일에서 검색 화면인지 아닌지 확인을 위해 변수 저장
        var requestIsSearch = false;

        //ejs 파일 화면 구성 실패를 방지하기 위해 검색어 저장
        var searchTerm = 'no searchTerm';

        //현재 화면 내용
        var pageTitle = `댓글 관리`;

        //댓글 신고 관리 페이지인지 아닌지 구분하는 변수
        var requestIsReport = false;

        //로그인 되어있을 경우에만 접근 허용
        if(login===true){

            //Server DB에 comment 테이블 쿼리 요청
            db.query(`SELECT c.commentId, p.title, m.nickName, c.contents, c.date, c.reportCount FROM comment c JOIN post p ON c.postId = p.postId JOIN member m ON c.memberId = m.memberId`, (error, results)=>{

                //데이터베이스 에러 처리
                if(error){
                    logger.error(`데이터베이스 오류 발생`, error);
                    res.status(1003).send(`<h1>데이터베이스 오류</h1>`);
                    return;
                }

                //페이징 기능을 위한 페이지 수와 표시할 칼럼 수 계산
                logger.debug(`전체 데이터 수 : ${results.length}`);
                var pageNum = Math.ceil(results.length / 10);
                if (results.length - ((currentPage - 1) * 10) >= 10){
                    columns = 10;
                } else {
                    columns = results.length % 10;
                }
                logger.debug(`총 페이지 수 : ${pageNum} 출력 데이터 수 : ${columns}`);

                //ejs 템플릿에 넘겨줄 파라미터 저장
                //mainFrame <%- include(body) %> 태그에 comment.ejs파일 전송하여 회원 관리 화면 구성
                var context = {
                    who : name,
                    login : login,
                    pageTitle : pageTitle,
                    body : 'comment.ejs',
                    comment : results,
                    currentPage : currentPage,
                    pageNum : pageNum,
                    columns : columns,
                    requestIsSearch : requestIsSearch,
                    requestIsReport : requestIsReport,
                    searchTerm : searchTerm
                };

                //mainFrame.ejs 화면에 context 내용 추가하여 전송
                req.app.render('mainFrame', context, (error, html)=>{

                    //화면 구성 실패 에러 처리
                    if(error){
                        logger.error(`mainFrame 렌더링 오류`, error);
                        res.status(500).send(`<h1>서버 내부 오류 발생</h1>`)
                        return;
                    }
                    res.end(html);
                })
            })
        } else {
            logger.warn(`인증 없는 접속 시도`);
            res.status(401).send(`<h1>인증 필요</h1>`);
            return;
        }
    },

    //'/comment/delete/:commentId' 요청 응답
    delete : (req, res)=>{

        //로그인 정보 반환 
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        //comment.ejs 파일에서 전달된 파라미터인 commentId를 저장
        var commentId = req.params.commentId;

        //로그인 되어있을 경우에만 삭제 허용
        if (login==true){
            //commentId가 동일한 컬럼을 DB에서 삭제
            db.query(`DELETE FROM comment WHERE commentId = ?`,
                [commentId], (error, result)=>{

                    //데이터베이스 에러 처리
                    if(error){
                        logger.error(`데이터베이스 오류 발생`, error);
                        res.status(1003).send(`<h1>데이터베이스 오류</h1>`);
                        return;
                    }

                    //삭제 후 다시 회원 관리 화면으로 연결
                    logger.debug(`commentId : ${commentId} 댓글 삭제`);
                    res.redirect('/comment/1');
                    res.end();
                }
            )
        } else {
            logger.warn(`인증 없는 접속 시도`);
            res.status(401).send(`<h1>인증 필요</h1>`);
            return;
        }
    },

    //'/comment/search' 요청 응답
    search : (req, res)=>{

        //로그인 정보 반환 
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        //post 방식으로 전달된 검색어를 페이지 선택 시 사용하기 위해 변수에 저장
        var post = req.body;
        var searchTerm = post.searchTerm;
        logger.debug(`검색어 : ${searchTerm}`);

        //post 방식으로 전달된 검색어를 sql문에 사용하기 위해 wildcard를 추가하여 저장
        var sntzedSearchTerm = sanitizeHtml(post.searchTerm);
        var sntzedSearchTerm = `%${sntzedSearchTerm}%`;

        //현재 페이지 저장
        var currentPage = req.params.currentPage;
        logger.debug(`접속 페이지 : ${currentPage}`);

        //ejs 파일에서 검색 화면인지 아닌지 확인을 위해 변수 저장
        var requestIsSearch = true;

        //현재 화면 내용
        var pageTitle = `댓글 관리`;

        //게시물 신고 관리 페이지인지 아닌지 구분하는 변수
        var requestIsReport = false;

        if(login===true){

            //Server DB에 검색어를 포함한 comment 테이블 쿼리 요청
            db.query('SELECT c.commentId, p.title, m.nickName, c.contents, c.date, c.reportCount FROM comment c JOIN post p ON c.postId = p.postId JOIN member m ON c.memberId = m.memberId WHERE title LIKE ? OR nickName LIKE ? OR c.date LIKE ? OR c.contents LIKE ? OR c.reportCount LIKE ?',
                [sntzedSearchTerm, sntzedSearchTerm, sntzedSearchTerm, sntzedSearchTerm, sntzedSearchTerm], (error, results)=>{

                    //데이터베이스 에러 처리
                    if(error){
                        logger.error(`데이터베이스 오류 발생`, error);
                        res.status(1003).send(`<h1>데이터베이스 오류</h1>`);
                        return;
                    }

                    //페이징 기능을 위한 페이지 수와 표시할 칼럼 수 계산
                    logger.debug(`전체 데이터 수 : ${results.length}`);
                    var pageNum = Math.ceil(results.length / 10);
                    if (results.length - ((currentPage - 1) * 10) >= 10){
                        columns = 10;
                    } else {
                        columns = results.length % 10;
                    }
                    logger.debug(`총 페이지 수 : ${pageNum} 출력 데이터 수 : ${columns}`);

                    //ejs 템플릿에 넘겨줄 파라미터 저장
                    //mainFrame <%- include(body) %> 태그에 comment.ejs파일 전송하여 회원 관리 화면 구성
                    var context = {
                        who : name,
                        login : login,
                        pageTitle : pageTitle,
                        body : 'comment.ejs',
                        comment : results,
                        currentPage : currentPage,
                        pageNum : pageNum,
                        columns : columns,
                        requestIsSearch : requestIsSearch,
                        requestIsReport : requestIsReport,
                        searchTerm : searchTerm
                    };

                    //comment.ejs 화면에 context 내용 추가하여 전송
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
            )
        }

        //로그인 상태가 아닐 경우 
        else {
            logger.warn(`인증 없는 접속 시도`);
            res.status(401).send(`<h1>인증 필요</h1>`);
            return;
        }
    }

}