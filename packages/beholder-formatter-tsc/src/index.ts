import { FormatResult } from '@aunited/beholder-formatter-common'

const annotationLevels = {
  error: 'failure',
  default: 'notice',
}

const formatLine = line => {
  const [file, rule, message] = line.split(':')

  const [filePath, position] = file.split(/\(|\)/).filter(f => f)
  const [startLine, startColumn] = position.split(',')
  const [level] = rule.trim().split(' ')

  return {
    path: filePath,
    start_line: startLine,
    start_column: startColumn,
    end_line: startLine,
    end_column: startColumn,
    annotation_level: annotationLevels[level] || annotationLevels.default,
    title: rule,
    message,
    raw_details: `(${rule}): ${message}`,
  }
}

export const format = async (data: string): Promise<FormatResult> => {
  const annotations = data
    .split('\n')
    .filter(line => line.includes(' TS'))
    .map(formatLine)

  return {
    title: 'TypeScript',
    summary:
      annotations.length > 0
        ? `Found ${annotations.length} errors`
        : 'All checks passed',
    annotations,
  }
}
