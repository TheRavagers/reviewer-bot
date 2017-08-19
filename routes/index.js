'use strict'

import { Router } from 'express';
const router = new Router();

/* inject dependecies */
import GitService from '../services/git/GitService';
import IndexController from '../controllers/index';
import RepoController from '../controllers/dataSeed';

const indexController = new IndexController(GitService);
const repoController = new RepoController(GitService);

router.post('/repoData', repoController.repoData);
router.get('/repoData', repoController.getRepoData);

router.post('/', indexController.pullRequestTwo);
module.exports = router;