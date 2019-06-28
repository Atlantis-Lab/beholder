import envCi from 'env-ci'

export const detect = () => {
  const { service, commit, slug, isCi } = envCi()

  if (!isCi) {
    throw new Error('CI environment not detected')
  }

  const [owner, repo] =
    service === 'codebuild' && process.env.CODEBUILD_SOURCE_REPO_URL
      ? process.env.CODEBUILD_SOURCE_REPO_URL.replace(
          'https://github.com/',
          ''
        ).split('/')
      : slug.split('/')

  return {
    commit,
    owner,
    repo,
  }
}
