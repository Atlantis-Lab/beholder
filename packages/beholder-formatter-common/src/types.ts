export enum Conclusion {
  Success = 'success',
  Failure = 'failure',
  Neutral = 'neutral',
  Cancelled = 'cancelled',
  TimedOut = 'timed_out',
  ActionRequired = 'action_required',
}

export enum AnnotationLevel {
  Notice = 'notice',
  Warning = 'warning',
  Failure = 'failure',
}

export interface FormatAnnotation {
  path: string
  start_line: number
  start_column: number
  end_line: number
  end_column: number
  annotation_level: AnnotationLevel
  raw_details: string
  title: string
  message: string
}

export interface FormatResult {
  title: string
  summary: string
  conclusion?: Conclusion
  annotations: FormatAnnotation[]
}

export interface Formatter {
  format: (data: string) => Promise<FormatResult>
}
