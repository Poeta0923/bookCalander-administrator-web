const express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');

//세션 저장소 관련 설정. mariadb npm 패키지는 정상 작동하지 않는 경우가 많아 express-mysql-session 사용
//정보 기입은 추후 로컬에 mariadb 다운로드받은 뒤 테스트할 때 기입할 예정
var MySqlStore = require('express-mysql-session')(session);
var options = {
    host : '',
    user : '',
    password : '',
    database : ''
};
var sessionStore = new MySqlStore(options)

//세션 관련 설정
const app = express();
app.use(session({
    secret : 'not decided yet',
    resave : false,
    saveUninitialized : true,
    store : sessionStore
}));

//ejs 파일들 관련 설정
app.set('views',__dirname+'/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));

//정적 파일들이 위치한 폴더 지정
app.use(express.static('public'));

const rootRouter = require('./router/rootRouter');
var memberRouter = require('./router/memberRouter');
var postRouter = require('./router/postRouter');
var commentRouter = require('./router/commentRouter');
var satisticsRouter = require('./router/satisticsRouter');
var aiRouter = require('./router/aiRouter');
var reportedPostRouter = require('./router/reportedPostRouter');
var reportedCommentRouter = require('./router/reportedCommentRouter');

app.use('/', rootRouter);
app.use('/member', memberRouter);
app.use('/post', postRouter);
app.use('/comment', commentRouter);
app.use('/satistics', satisticsRouter);
app.use('/ai', aiRouter);
app.use('/reportedPost', reportedPostRouter);
app.use('/reportedComment', reportedCommentRouter);

//favicon 파일이 없기 때문에 브라우저가 요청 시 에러 처리.
app.get('/favicon.ico', (req, res)=>res.writeHead(404));

//포트 번호는 수정 예정. callback 함수는 개발 이후에도 로깅을 위해 남겨둘 예정
app.listen(3000, ()=>console.log('Example app listening on port 3000'))