import GitService from '../services/git/GitService';
import UserStatsService from '../services/userStatsService';
import RepoService from '../services/RepoService';

export default class Index {

    pullRequest = (req, res, next) => {
        console.log('need to change this', req);
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

    pullRequestTwo = (req, res, next) => {
    
        const body = req.body;

        const { action, number, pull_request, repository } = body;
        const { name, owner } = repository;
        const userWhoRaisedPR = pull_request.user.login;

        if (['opened', 'reopened', 'review_requested'].indexOf(action) !== -1) {
            const gitService = new GitService(owner.login);
            const userStatService = new UserStatsService(gitService);
            const repoService = new RepoService();
             repoService.upsertRepo({
                repo_id: req.body.repository.id, 
                repoName: req.body.repository.name, 
                repoType: req.body.repository.description,
                language: req.body.repository.language,
                private: req.body.repository.private,
                author: [req.body.repository.owner.id]
            }).catch ((err) => {
                console.log(err);
            });

            repoService.upsertUserData({
                id: req.body.repository.owner.id,
                login: req.body.repository.owner.login,
                lastName: req.body.repository.owner.login,
                email: req.body.repository.owner.login,
                repo: [req.body.repository.id],
                type: req.body.repository.owner.type,
                site_admin: req.body.repository.owner.site_admin
            }).catch ((err) => {
                console.log(err);
            });

            gitService.getContributorsStats(req.body.repository.name)
            .then((data)=> {
               
                data.forEach((el) => {

                    repoService.upsertUserData(              
                    {
                        id: el.author.id,
                        login: el.author.login,
                        lastName: el.author.login,
                        email: el.author.login,
                        repo: [req.body.repository.id],
                        type: el.author.type,
                        site_admin: el.author.site_admin
                    }).catch ((err) => {
                        console.log('upsertUserData')
                        console.log(err);
                    });

                    repoService.upsertUserStatics(
                    {
                        id: el.author.id,
                        days: [28, 1, 2],
                        contributions: el.total
                    }).catch ((err) => {
                        console.log(err);
                    });

                })
            });



            userStatService.getCount(name).then((result) => {
                const topReviewers = userStatService.getTopReviewers(result);
                const removePRRaiser = topReviewers.filter((user) => {
                    if (user.author.login !== userWhoRaisedPR && user.author.login !== 'sunil-exzeo') {
                        return user.author.login;
                    }
                });

                const reviewers = {
                    "reviewers": removePRRaiser.map((user) => { 
                    console.log('--------------------------');

                    console.log(user)

                    console.log('--------------------------');

                    //repoService.insertReviewersToMongo({})

                        return user.author.login; }),
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