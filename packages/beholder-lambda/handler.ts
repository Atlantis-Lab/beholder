import { Publisher } from '@aunited/beholder-publisher'
import AWS from 'aws-sdk'

const ssm = process.env.IS_OFFLINE
  ? new AWS.SSM({
      endpoint: 'http://localhost:4583',
      region: process.env.AWS_REGION,
    })
  : new AWS.SSM()

const getParams = async () => {
  const { Parameters: parameters } = await ssm
    .getParameters({
      Names: ['/checks/app-id', '/checks/private-key'],
      WithDecryption: true,
    })
    .promise()

  return parameters.reduce(
    (result, param) => ({
      ...result,
      [param.Name.replace('/checks/', '').replace('-', '')]: param.Value,
    }),
    { appid: null, privatekey: null }
  )
}

export async function publish(event) {
  try {
    const params = await getParams()

    const { owner, repo, commit, name, output } = JSON.parse(event.body)

    const publisher = new Publisher(
      params.appid,
      params.privatekey,
      owner,
      repo
    )

    await publisher.publish(commit, name, output)

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Checks published successfully!',
      }),
    }
  } catch (error) {
    console.log(error) // tslint:disable-line no-console

    return {
      statusCode: error.status || 500,
      body: JSON.stringify({
        message: error.message,
      }),
    }
  }
}
