import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
    let mostusedlang = await axios('https://apitool.pgl.my.id/api/githubmostusedlanguages?username=syxhri');
    let repocount = await axios('https://api.github.com/users/syxhri');
    let contrib = await axios('https://api.github.com/graphql', {
        method: 'post',
        headers: {
            Authorization: 'bearer ' + process.env.GITHUB_TOKEN
        },
        data: {
            query: `{
  viewer {
    repositoriesContributedTo(first: 100, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
      totalCount
    }
  }
}`
        }
    });

    let mostusedlangdata = mostusedlang.data.slice(0, 3).join(", ");
    let contribcount = contrib.data.data.viewer.repositoriesContributedTo.totalCount;
    let repo = repocount.data.public_repos;
    return NextResponse.json({ 
        most_used_lang: mostusedlangdata,
        contributed_to: repo + contribcount
    });
}
