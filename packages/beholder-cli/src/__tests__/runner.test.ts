import fetch from './__mocks__/cross-fetch'
import { run } from '../run'

jest.mock('@aunited/beholder-formatter-tslint', () => ({
  format: async data => ({
    title: 'test',
    summary: 'test',
    annotations: JSON.parse(data),
  }),
}))

interface RequestParams {
  body: string
}

describe('run', () => {
  it('check valid format data', async () => {
    await run({ target: 'tslint' }, '[]')

    const params: RequestParams = Array.from(fetch.mock.calls[0])[1]
    const body = JSON.parse(params.body)

    expect(body.owner).toBe('owner')
    expect(body.repo).toBe('repo')
    expect(body.commit).toBe('commit')
    expect(body.name).toBe('tslint')
    expect(body.output.title).toBe('test')
    expect(body.output.summary).toBe('test')
    expect(body.output.annotations).toEqual([])
  })

  it('check invalid format data', async () => {
    await run({ target: 'tslint' }, '[]invalid')

    const params: RequestParams = Array.from(fetch.mock.calls[1])[1]
    const body = JSON.parse(params.body)

    expect(body.owner).toBe('owner')
    expect(body.repo).toBe('repo')
    expect(body.commit).toBe('commit')
    expect(body.name).toBe('tslint')
    expect(body.output.title).toBe('SyntaxError')
    expect(body.output.summary).toBe('Unexpected token i in JSON at position 2')
    expect(body.output.annotations).toHaveLength(1)
  })
})
