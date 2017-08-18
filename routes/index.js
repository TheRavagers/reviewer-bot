'use strict'

import {Router} from 'express';
const router = new Router();

router.get('/', ((req, res)=> {
    res.render('home');
}));

router.get('/health', ((req, res)=> {
    req.log.error("my log");
    res.json({
        success:true
    })
}));

module.exports=router;