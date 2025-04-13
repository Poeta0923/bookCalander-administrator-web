const express = require('express');
const router = express.Router();
const logger = require('../lib/logger');

//lib 폴더의 member.js파일 연결
var member = require('../lib/member');

//회원 관리 화면 요청 라우팅
router.get('/:currentPage', (req, res)=>{
    logger.info(`GET /member/${req.params.currentPage}`);
    member.view(req, res);
})

//회원 삭제 버튼 클릭 시 요청 라우팅
router.get('/delete/:memberId', (req, res)=>{
    logger.info(`GET /member/delete/${req.params.memberId}`);
    member.delete(req, res);
})

//회원 검색란에 정보 기입 후 검색버튼 클릭 시 요청 라우팅
router.post('/search/:currentPage', (req, res)=>{
    logger.info(`POST /member/search/${req.params.currentPage}`);
    member.search(req, res);
})

module.exports=router;