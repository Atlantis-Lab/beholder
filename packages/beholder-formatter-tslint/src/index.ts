import path from 'path'
import { IRuleFailureJson } from 'tslint'
import {
  FormatResult,
  getLineWithOffset,
} from '@monstrs/github-checks-formatter-common'

const ruleSeverities = {
  ERROR: 'failure',
  WARNING: 'warning',
  DEFAULT: 'notice',
  OFF: 'notifce',
}

export const format = async (data: string): Promise<FormatResult> => {
  const parsed: IRuleFailureJson[] = JSON.parse(data)
  const cwd = path.join(process.cwd(), '/')

  return {
    title: 'TSLint',
    summary:
      parsed.length > 0 ? `Found ${parsed.length} errors` : 'All checks passed',
    annotations: parsed.map(item => ({
      path: item.name.replace(cwd, ''),
      start_line: getLineWithOffset(item.startPosition.line),
      start_column: item.startPosition.character,
      end_line: getLineWithOffset(item.endPosition.line),
      end_column: item.endPosition.character,
      annotation_level:
        ruleSeverities[item.ruleSeverity] || ruleSeverities.DEFAULT,
      raw_details: `(${item.ruleName}): ${item.failure}`,
      title: item.ruleName,
      message: item.failure,
    })),
  }
}
