import FieldValidationException from 'src/exceptions/FieldValidationException'
import ValidatorException from 'src/exceptions/ValidatorException'
import { BaseField } from 'src/validator'
import { ErrorReporter } from 'src/validator/ErrorReporter'

/**
 * Helper function to validate the body.
 * Schema is converted to readonly so that types are preserved
 * and not generalized to boolean/string etc.
 */
export async function validate<Schema extends Record<any, BaseField<any, any>>>(
  body: Record<any, any>,
  schema: Readonly<Schema>
): Promise<{
  [Key in keyof Schema]: Schema[Key] extends {
    validate(value: any, reporter: any): Promise<infer T>
  }
    ? T
    : Schema[Key]
}> {
  const reporter = new ErrorReporter()
  const data: any = {}

  for (const key in schema) {
    try {
      data[key] = await schema[key].validate(body[key], reporter.getChild(key))
    } catch (error) {
      if (error instanceof FieldValidationException) {
        reporter.report(key, error.error)
      } else if (error instanceof ValidatorException) {
        reporter.report(key, error.errors)
      } else {
        throw error
      }
    }
  }

  if (reporter.hasErrors) {
    throw reporter.toError()
  }

  return body as any
}
