import ValidatorException from 'src/exceptions/ValidatorException'
import { getValue, setKey } from 'src/helpers/misc'

/**
 * Reporter class for reporting errors during validation.
 */
export class ErrorReporter {
  constructor(
    public errors: Record<any, any> = {},
    public status: number = 400,
    private initialize?: (key: string) => Record<any, any>
  ) {}

  /**
   * Property to check if reporter has collected any errors
   */
  public get hasErrors() {
    if (!this.errors) {
      return false
    }

    return Object.keys(this.errors).length > 0
  }

  /**
   * Helper function to report an error during validation.
   * If error is an object then it is shallow merged with exising value.
   */
  public report(key: string, error: Record<any, any> | string) {
    if (!this.errors) {
      this.errors = this.initialize ? this.initialize(key) : {}
    }

    if (typeof error === 'string') {
      setKey(this.errors, key, error)
    } else {
      let val = getValue(this.errors, key)

      if (!val) {
        val = {}
        setKey(this.errors, key, val)
      }

      Object.assign(val, error)
    }
  }

  /**
   * Helper function to get child instance of this reporter.
   * This child instance has errors from parent instance so that
   * any error reported on child will also be reflected on parent.
   */
  public getChild(key: string) {
    const val = (this.errors && getValue(this.errors, key)) || null

    return new ErrorReporter(val, this.status, () => {
      this.report(key, {})

      return getValue(this.errors, key)
    })
  }

  /**
   * Helper method to generate validator exception for this reporter
   */
  public toError() {
    return new ValidatorException(this.errors, this.status)
  }
}
