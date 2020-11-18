import * as core from "@actions/core"
import * as github from "@actions/github"
import got from "got"

const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/778404181051965450/ODUyAOpVGXIrBFRaU67-YnS_U7sRIHC74iYLB7HxqCN4AYxJgg6CnDJVsiP1kddrX-YT"

interface Assignee {
  id: number
}

interface User {
  id: number
}

interface Comment {
  id: number
  user: User
}

const getAssigneesThatHaventCommented = (
  assignees: Assignee[],
  comments: Comment[]
) => {
  const assigneeIdsThatCommented = new Set(
    comments.map(comment => comment.user.id)
  )
  return assignees.filter(
    assignee => !assigneeIdsThatCommented.has(assignee.id)
  )
}

const sendFirstCommentReminders = (assignes: Assignee[], _message: string) =>
  Promise.all(
    assignes.map(_assigne =>
      got.post(DISCORD_WEBHOOK_URL, {
        json: {
          username: "Inguiçado",
          avatar_url: "https://i.ytimg.com/vi/JVoZdm6h-Uo/hqdefault.jpg",
          content: "The message to send",
        },
      })
    )
  )

const main = async () => {
  if (!github.context.payload.pull_request) {
    return
  }

  const githubToken = core.getInput("GITHUB_TOKEN")

  const octokit = github.getOctokit(githubToken)

  const pullRequest = {
    ...github.context.repo,
    issue_number: github.context.payload.pull_request.number,
  }

  const { data: assigness } = await octokit.issues.listAssignees(pullRequest)

  const { data: comments } = await octokit.issues.listComments(pullRequest)

  await sendFirstCommentReminders(
    getAssigneesThatHaventCommented(assigness, comments),
    "imbica jogador"
  )
}

main().catch((error: Error) => core.setFailed(error.message))
