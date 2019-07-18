import {
  FormatResult,
  getLineWithOffset,
} from '@aunited/beholder-formatter-common'
import path from 'path'

export const format = async (data: string): Promise<FormatResult> => {
  const cwd = path.join(process.cwd(), '/')

  const { testResults } = JSON.parse(data)

  const assertions = testResults
    .reduce(
      (result, testResult) => [
        ...result,
        ...testResult.assertionResults.map(assertion => ({
          ...assertion,
          path: testResult.name.replace(cwd, ''),
        })),
      ],
      []
    )
    .filter(assertion => assertion.status === 'failed')

  return {
    title: 'Jest',
    summary:
      assertions.length > 0
        ? `Found ${assertions.length} errors`
        : 'All checks passed',
    annotations: assertions.map(assertion => ({
      path: assertion.path,
      start_line: getLineWithOffset(assertion.location.line),
      start_column: assertion.location.column,
      end_line: getLineWithOffset(assertion.location.line),
      end_column: assertion.location.column,
      annotation_level: 'failure',
      raw_details: assertion.fullName,
      title: assertion.ancestorTitles.join(' '),
      message: assertion.title,
    })),
  }
}
