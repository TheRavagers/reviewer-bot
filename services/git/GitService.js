'use strict'

import axios from 'axios';
const urlConfig = require('./repoURL.json');

export default class GitApiManager {
    constructor(org) {
        if (!org)
            throw new Error('org is required to instantiate GitApiManager');

        this.org = org;
    }

    getFileContent(fileName) {
        return this.makeHttpCall(fileName)
            .then((response) => {
                return Promise.resolve(response);
            });
    }

    getRepoList(repoName) {
        return this.makeHttpCall(this.processURL(urlConfig.repoListApiUrl, { repo: repoName }))
            .then((response) => {
                return Promise.resolve(response.data);
            });
    }

    getRepoInfo(repoName) {
        return this.makeHttpCall(this.processURL(urlConfig.repository_url, { repo: repoName }))
            .then((response) => {
                return Promise.resolve(response.data);
            });
    }

    getContributorsList(repoName) {
        return this.makeHttpCall(this.processURL(urlConfig.contributors_url, { repo: repoName }))
            .then((response) => {
                return Promise.resolve(response.data);
            });
    }

    getContributorsStats(repoName) {
        return this.makeHttpCall(this.processURL(urlConfig.contributors_stats_url, { repo: repoName }))
            .then((response) => {
                return Promise.resolve(response.data);
            });
    }

    getCommits(repoName) {
        return this.makeHttpCall(this.processURL(urlConfig.commits_url, { repo: repoName }))
            .then((response) => {
                return Promise.resolve(response.data);
            });
    }

    getComments(repoName) {
        return this.makeHttpCall(this.processURL(urlConfig.comments_url, { repo: repoName }))
            .then((response) => {
                return Promise.resolve(response.data);
            });
    }

    submitPullRequestReviewers(repo, prnumber, data) {
        console.log(this.processURL(urlConfig.submit_pull_requests_reviewers, { repo, prnumber }));

        return this.makeHttpCall(this.processURL(urlConfig.submit_pull_requests_reviewers, { repo, prnumber }), 'post', data)
            .then((response) => {
                return Promise.resolve(response.data);
            });
    }
    /**
     * 
     * @param {*} complete url of bitbucket 
     */
    makeHttpCall(url, method, data) {
        return this.generateToken().then((token) => {
            if (method == 'POST' || method == 'post') {
                return axios.post(url, JSON.stringify(data), {
                    headers: {
                        'Authorization': `token ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }

            return axios.get(url, {
                headers: {
                    "Authorization": `token ${token}`
                }
            });
        });
    }

    processURL(URL, data) {
        for (const key in data) {
            if (URL.indexOf(`{${key}}`) > 0) {
                URL = URL.replace(`{${key}}`, `${data[key]}`);
            }
        }

        URL = URL.replace(`{org}`, this.org);
        console.log(URL);
        return URL;
    }

    generateToken() {
        var username = 'moniv';
        var password = '8bilubarber';

        var encodedPassword = new Buffer(`${username}:${password}`).toString('base64');
        return axios.post(`https://api.github.com/authorizations`, {
            scopes: ['repo'],
            note: `BOT-${Math.floor(Math.random() * 900000)}`
        }, {
                headers: {
                    "Authorization": `Basic ${encodedPassword}`,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                return Promise.resolve(response.data.token);
            }).catch((authError) => {
                console.log(authError);
            })
    }
}