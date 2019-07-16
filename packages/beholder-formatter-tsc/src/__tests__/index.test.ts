import path from 'path'
import fs from 'fs'
import { format } from '../'

const loadFixtures = name =>
  fs.readFileSync(path.join(__dirname, 'fixtures', `${name}.txt`)).toString()

describe('format', () => {
  it('should match base snapshot', async () => {
    const result = await format(loadFixtures('base'))

    expect(result).toMatchSnapshot()
  })
})
