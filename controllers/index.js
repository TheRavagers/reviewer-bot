import GitService from '../services/git/GitService';
import UserStatsService from '../services/userStatsService';

export default class Index {

    pullRequest = (req, res, next) => {
        const body = req.body;

        const { action, number, pull_request, repository } = body;
        const { name, owner } = repository;
        const userWhoRaisedPR = pull_request.user.login;

        console.log('action', action)

        if (['opened', 'closed', 'reopened', 'edited', 'review_requested'].indexOf(action) !== -1) {
            const gitService = new GitService(owner.login);
            const userStatService = new UserStatsService(gitService);

            userStatService.getCount(name).then((result) => {
                const topReviewers = userStatService.getTopReviewers(result);
                const removePRRaiser = topReviewers.filter((user) => {
                    if (user.author.login !== userWhoRaisedPR && user.author.login !== 'sunil-exzeo') {
                        return user.author.login;
                    }
                });

                const reviewers = {
                    "reviewers": removePRRaiser.map((user) => { return user.author.login; }),
                    "team_reviewers": []
                };

                addReviewers(gitService, name, number, reviewers);
            }).catch((error) => {
                console.log('something went wrong while calculating results', error);
            });
        }

        res.status(200).json(body);
    }
}

const addReviewers = (gitService, name, number, reviewers) => {
    gitService.submitPullRequestReviewers(name, number, reviewers).then((response) => {
        console.log(response);
    }).catch((serverError) => {
        console.log('Some error while assigning review', serverError);
    });
}