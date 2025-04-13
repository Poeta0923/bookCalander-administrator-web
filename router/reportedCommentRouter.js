const express = require('express');
const router = express.Router();
const logger = require('../lib/logger');

//lib 폴더의 reportedComment.js파일 연결
var reportedComment = require('../lib/reportedComment');

//신고 댓글 관리 화면 요청 라우팅
router.get('/:currentPage', (req, res)=>{
    logger.info(`GET /reportedComment/${req.params.currentPage}`);
    reportedComment.view(req, res);
})

//신고 댓글 삭제 버튼 클릭 시 요청 라우팅
router.get('/delete/:commentId', (req, res)=>{
    logger.info(`GET /reportedComment/delete/${req.params.commentId}`);
    reportedComment.delete(req, res);
})

//신고 댓글 검색란에 정보 기입 후 검색버튼 클릭 시 요청 라우팅
router.post('/search/:currentPage', (req, res)=>{
    logger.info(`POST /reportedComment/search/${req.params.currentPage}`);
    reportedComment.search(req, res);
})

module.exports=router;