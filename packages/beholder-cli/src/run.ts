import {
  Formatter,
  FormatResult,
  AnnotationLevel,
} from '@aunited/beholder-formatter-common'
import ErrorStackParser from 'error-stack-parser'
import fetch from 'cross-fetch'
import logger from 'npmlog'
import { Options } from './types'
import { detect } from './ci'

const endpoint =
  process.env.CHECKS_PUBLISHER_URL || 'http://localhost:3000/publish'

const getOutput = async (target, data): Promise<FormatResult> => {
  try {
    const formatter: Formatter = require(`@aunited/beholder-formatter-${target}`)

    return await formatter.format(data)
  } catch (error) {
    const [stackFrame] = ErrorStackParser.parse(error)

    return {
      title: error.name,
      summary: error.message,
      annotations: [
        {
          path: stackFrame.fileName || __filename,
          start_line: stackFrame.lineNumber || 0,
          start_column: stackFrame.columnNumber || 0,
          end_line: stackFrame.lineNumber || 0,
          end_column: stackFrame.columnNumber || 0,
          annotation_level: AnnotationLevel.Failure,
          raw_details: error.message,
          title: error.name,
          message: error.message,
        },
      ],
    }
  }
}

export const run = async (options: Options, data: string) => {
  logger.verbose(`Format with ${options.target}, data:`, data)

  const { owner, repo, commit } = detect()

  const output: FormatResult = await getOutput(options.target, data)

  const payload = {
    owner,
    repo,
    commit,
    output,
    name: options.target,
  }

  logger.verbose('Check payload:', payload)

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return response.json()
}
