
import GitService from '../services/git/GitService';

export default class Index {

    constructor() { }

    pullRequest = (req, res, next) => {
        const body = req.body;
        const { number, pull_request, repository } = body;
        const { name, owner } = repository;

        const reviewers = {
            "reviewers": [
                "moniv",
                "sharma-sunil"
            ],
            "team_reviewers": []
        };

        const gitService = new GitService(owner.login);
        gitService.submitPullRequestReviewers(name, number, reviewers).then((response) => {
            console.log(response);
        }).catch((serverError) => {
            console.log('some error while assigning review');
        });

        res.status(200).json(body);
    }

}