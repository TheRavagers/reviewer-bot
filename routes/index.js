'use strict'

import { Router } from 'express';
const router = new Router();

/* inject dependecies */
import GitService from '../services/git/GitService';
import IndexController from '../controllers/index';

const indexController = new IndexController(GitService);

router.post('/', indexController.pullRequest);
module.exports = router;