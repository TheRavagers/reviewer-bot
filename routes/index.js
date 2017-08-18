'use strict'

import { Router } from 'express';
const router = new Router();

import Api from '../githubApi/index';
const api = new Api();

router.get('/', (req, res) => {
    api.getOrgs();
});

module.exports = router;