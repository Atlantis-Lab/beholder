import { Conclusion, FormatResult } from '@aunited/beholder-formatter-common'

const formatResultError = error => `✖   ${error.message} [${error.name}]`
const formatResultStatus = (errors, warnings) =>
  `${errors.length === 0 && warnings.length === 0 ? '✔' : '✖'}   found ${
    errors.length
  } problems, ${warnings.length} warnings`

const formatResult = ({ input, errors = [], warnings = [] }) => `
⧗   input: ${input}
${[
  ...errors.map(formatResultError),
  ...warnings.map(formatResultError),
  formatResultStatus(errors, warnings),
].join('\n')}
`

export const format = async (data: string): Promise<FormatResult> => {
  const { valid, results = [] } = JSON.parse(data)

  return {
    annotations: [],
    title: 'Commitlint',
    conclusion: valid ? Conclusion.Success : Conclusion.Failure,
    summary: results.map(formatResult).join('\n'),
  }
}
