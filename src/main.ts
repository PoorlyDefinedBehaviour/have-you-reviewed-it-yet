import * as core from "@actions/core"
import * as github from "@actions/github"
import got from "got"

const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/778404181051965450/ODUyAOpVGXIrBFRaU67-YnS_U7sRIHC74iYLB7HxqCN4AYxJgg6CnDJVsiP1kddrX-YT"

const main = async () => {
  const githubToken = core.getInput("GITHUB_TOKEN")

  const octokit = github.getOctokit(githubToken)

  const assignees = await octokit.issues.listAssignees(github.context.repo)

  /* await octokit.issues.createComment({
    ...github.context.repo,
    issue_number: github.context.payload.pull_request.number,
    body: comment,
  }) */

  await got.post(DISCORD_WEBHOOK_URL, {
    json: {
      username: "Inguiçado",
      avatar_url: "",
      content: "The message to send",
    },
  })
  //
}

main().catch((error: Error) => core.setFailed(error.message))
