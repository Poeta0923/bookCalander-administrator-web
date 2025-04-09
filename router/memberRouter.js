const express = require('express');
const router = express.Router();

var member = require('../lib/member');

//회원 관리 화면 요청 라우팅
router.get('/', (req, res)=>{
    member.view(req, res)
})

//회원 삭제 버튼 클릭 시 요청 라우팅
router.get('/delete', (req, res)=>{
    member.delete(req, res)
})

module.exports=router;