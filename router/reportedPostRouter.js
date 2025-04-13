const express = require('express');
const router = express.Router();
const logger = require('../lib/logger');

//lib 폴더의 reportedPost.js파일 연결
var reportedPost = require('../lib/reportedPost');

//신고 게시물 관리 화면 요청 라우팅
router.get('/:currentPage', (req, res)=>{
    logger.info(`GET /reportedPost/${req.params.currentPage}`);
    reportedPost.view(req, res);
})

//신고 게시물 삭제 버튼 클릭 시 요청 라우팅
router.get('/delete/:postId', (req, res)=>{
    logger.info(`GET /reportedPost/delete/${req.params.postId}`);
    reportedPost.delete(req, res);
})

//신고 게시물 검색란에 정보 기입 후 검색버튼 클릭 시 요청 라우팅
router.post('/search/:currentPage', (req, res)=>{
    logger.info(`POST /reportedPost/search/${req.params.currentPage}`);
    reportedPost.search(req, res);
})

module.exports=router;