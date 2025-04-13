const express = require('express');
const router = express.Router();
const logger = require('../lib/logger');

//lib 폴더의 post.js파일 연결
var post = require('../lib/post');

//게시물 관리 화면 요청 라우팅
router.get('/:currentPage', (req, res)=>{
    logger.info(`GET /post/${req.params.currentPage}`);
    post.view(req, res);
})

//게시물 삭제 버튼 클릭 시 요청 라우팅
router.get('/delete/:postId', (req, res)=>{
    logger.info(`GET /post/delete/${req.params.postId}`);
    post.delete(req, res);
})

//게시물 검색란에 정보 기입 후 검색버튼 클릭 시 요청 라우팅
router.post('/search/:currentPage', (req, res)=>{
    logger.info(`POST /post/search/${req.params.currentPage}`);
    post.search(req, res);
})

module.exports=router;