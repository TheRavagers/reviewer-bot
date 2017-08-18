
import GitService from '../services/git/GitService';

export default class Index {

    constructor() { }

    pullRequest = (req, res, next) => {
        const body = req.body;
        const { action, number, pull_request, repository } = body;
        const { name, owner } = repository;

        if (['opened', 'closed', 'reopened', 'edited'].indexOf(action) !== -1) {
            const reviewers = {
                "reviewers": [
                    "sharma-sunil"
                ],
                "team_reviewers": []
            };

            const gitService = new GitService(owner.login);
            gitService.submitPullRequestReviewers(name, number, reviewers).then((response) => {
                console.log(response);
            }).catch((serverError) => {
                console.log('Some error while assigning review', serverError);
            });
        }

        res.status(200).json(body);
    }

}