const express = require('express');
const router = express.Router();
const logger = require('../lib/logger');

//lib 폴더의 comment.js파일 연결
var comment = require('../lib/comment');

//댓글 관리 화면 요청 라우팅
router.get('/:currentPage', (req, res)=>{
    logger.info(`GET /comment/${req.params.currentPage}`);
    comment.view(req, res);
})

//댓글 삭제 버튼 클릭 시 요청 라우팅
router.get('/delete/:commentId', (req, res)=>{
    logger.info(`GET /comment/delete/${req.params.commentId}`);
    comment.delete(req, res);
})

//댓글 검색란에 정보 기입 후 검색버튼 클릭 시 요청 라우팅
router.post('/search/:currentPage', (req, res)=>{
    logger.info(`POST /comment/search/${req.params.currentPage}`);
    comment.search(req, res);
})

module.exports=router;