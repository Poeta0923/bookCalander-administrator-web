const express = require('express');
const router = express.Router();

var root = require('../lib/root');

router.get('/', (req, res)=>{
    root.home(req, res)
})

router.post('/login', (req, res)=>{
    root.login(req, res);
})

router.get('/logout', (req, res)=>{
    root.logout(req, res)
})

module.exports = router;