import { FormatResult, Conclusion } from '@aunited/beholder-formatter-common'
import request from '@octokit/request'
import Octokit from '@octokit/rest'
import App from '@octokit/app'

export class Publisher {
  private octokit: Octokit

  constructor(
    appId: string,
    privateKey: string,
    private owner: string,
    private repo: string
  ) {
    const app = new App({ id: appId, privateKey })

    this.octokit = new Octokit({
      async auth() {
        const { data } = await request({
          method: 'GET',
          url: `/repos/${owner}/${repo}/installation`,
          headers: {
            accept: 'application/vnd.github.machine-man-preview+json',
            authorization: `bearer ${app.getSignedJsonWebToken()}`,
          },
        })

        const installationAccessToken = await app.getInstallationAccessToken({
          installationId: data.id,
        })

        return `token ${installationAccessToken}`
      },
    })
  }

  async publish(commit: string, name: string, output: FormatResult) {
    try {
      await this.octokit.checks.create({
        owner: this.owner,
        repo: this.repo,
        name,
        head_sha: commit,
        status: 'completed',
        completed_at: new Date().toISOString(),
        conclusion:
          output.conclusion ||
          (output.annotations.length > 0
            ? Conclusion.Failure
            : Conclusion.Success),
        output,
      })
    } catch (error) {
      throw error
    }
  }
}
