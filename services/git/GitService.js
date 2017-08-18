'use strict'

import axios from 'axios';
//import urlConfig from './repoURL.json'
const urlConfig = require('./repoURL.json');

export default class GitApiManager {
    constructor(org) {
        if (!org)
            throw new Error('org is required to instantiate GitApiManager');

        this.token = urlConfig.security_token;
        this.org = org
    }
    getFileContent(fileName) {
        return this.makeHttpCall(fileName)
            .then((response) => {
                return Promise.resolve(response);
            });
    }
    getRepoList(repoName) {
        if (!this.token)
            throw new Error("No token found");

        return this.makeHttpCall(this.processURL(urlConfig.repoListApiUrl, { repo: repoName }))
            .then((response) => {
                return Promise.resolve(response.data);
            });
    }
    getRepoInfo(repoName) {
        if (!this.token)
            throw new Error("No token found");

        return this.makeHttpCall(this.processURL(urlConfig.repository_url, { repo: repoName }))
            .then((response) => {
                return Promise.resolve(response.data);
            });
    }
    getContributorsList(repoName) {
        if (!this.token)
            throw new Error("No token found");

        return this.makeHttpCall(this.processURL(urlConfig.contributors_url, { repo: repoName }))
            .then((response) => {
                return Promise.resolve(response.data);
            });
    }
    getCommits(repoName) {
        if (!this.token)
            throw new Error("No token found");

        return this.makeHttpCall(this.processURL(urlConfig.commits_url, { repo: repoName }))
            .then((response) => {
                return Promise.resolve(response.data);
            });
    }

    getComments(repoName) {
        if (!this.token)
            throw new Error("No token found");

        return this.makeHttpCall(this.processURL(urlConfig.comments_url, { repo: repoName }))
            .then((response) => {
                return Promise.resolve(response.data);
            });
    }
    submitPullRequestReviewers(repo, prnumber, data) {
        if (!this.token)
            throw new Error("No token found");

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
        if (!this.token)
            throw new Error("No token found");

        if (method == 'POST' || method == 'post') {
            return axios.post(url, JSON.stringify(data), {
                headers:{
                    'Authorization': `token ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });
        }

        return axios.get(url, {
            headers: {
                "Authorization": `token ${this.token}`
            }
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
}