import { ZodError } from 'zod';

export class ValidationIssuesError extends Error {
  name = 'ValidationIssuesError';
  public readonly issues: Record<string, string[]>;
  private readonly errorMessage?: string;

  constructor(error: ZodError, message?: string) {
    super();

    this.issues = ValidationIssuesError.formatZodIssues(error);
    this.errorMessage = message;
  }

  private static formatZodIssues(error: ZodError) {
    const formattedIssues: Record<string, string[]> = {};

    for (const issue of error.issues) {
      const key = issue.path.join('.');

      if (!formattedIssues[key]) {
        formattedIssues[key] = [issue.message];
      } else {
        formattedIssues[key].push(issue.message);
      }
    }

    return formattedIssues;
  }

  get message() {
    return this.errorMessage
      ? this.errorMessage + ': ' + JSON.stringify(this.issues, null, 2)
      : JSON.stringify(this.issues, null, 2);
  }

  toString() {
    return this.message;
  }
}
