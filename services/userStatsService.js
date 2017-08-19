export default class UserStatsService {

    constructor(gitService) {
        this.gitService = gitService;
    }

    getCount = (repo) => {
        return new Promise((resolve, reject) => {
            this.gitService.getContributorsStats(repo).then((response) => {
                const userStats = response;
                const length = userStats.length;

                let combinedResults = [];

                for (let i = 0; i < length; i++) {
                    const { total, weeks, author } = userStats[i];
                    const points = total * 1.5 + Math.abs(weeks[0]['a'] - weeks[0]['d']) / 4;
                    combinedResults.push({ points, author });
                }

                return resolve(combinedResults);

            }).catch((error) => {
                return reject(error);
            });
        });
    }

    getTopReviewers = (combinedResults = []) => {
        return combinedResults.sort((a, b) => {
            return b.points - a.points;
        });
    }
}