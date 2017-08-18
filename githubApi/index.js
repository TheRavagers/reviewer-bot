import GitHubApi from 'github';

const github = new GitHubApi({
    debug: true,
    protocol: "https",
    host: "", // should be api.github.com for GitHub
    pathPrefix: "/api/v3", // for some GHEs; none for GitHub
    headers: {
        "user-agent": "My-Cool-GitHub-App-Bot" // GitHub is happy with a unique user agent
    },
    Promise: require('bluebird'),
    family: 6,
    followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
    timeout: 5000
});

export default class Api {

    constructor() {
        this.github = github;

        this.github.authenticate({
            type: "token",
            token: "112f52f8c8ff6ecf21bbe98ce31ce20f7dd9bb4b",
        });
    }

    getOrgs() {
        this.github.orgs.get({
            org: "TheRavagers"
        }, function (err, res) {
            console.log(JSON.stringify(res));
        });
    }
}