const express = require('express');
const router = express.Router();
const logger = require('../lib/logger');

//lib 폴더의 root.js파일 연결
var root = require('../lib/root');

//'/' 요청 라우팅
router.get('/', (req, res)=>{
    logger.info(`GET /`);
    root.home(req, res);
})

//'login'버튼 클릭 시 요청 라우팅
router.post('/login', (req, res)=>{
    logger.info(`POST /login`);
    root.login(req, res);
})


//'logout'버튼 클릭 시 요청 라우팅
router.get('/logout', (req, res)=>{
    logger.info(`GET /logout`);
    root.logout(req, res);
})

module.exports = router;