'use strict'

import { Router } from 'express';
const router = new Router();

/* inject dependecies */
import IndexController from '../controllers/index';
const indexController = new IndexController();

router.post('/', indexController.pullRequest);

module.exports = router;