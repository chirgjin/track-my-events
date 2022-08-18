import FieldValidationException from 'src/exceptions/FieldValidationException'
import { ErrorReporter } from 'src/validator/ErrorReporter'
import { BaseField, BaseFieldConfig } from 'src/validator/Fields'
import { FIELD_MUST_BE_VALID_BOOLEAN } from 'src/validator/constants'

/**
 * Options type for boolean.
 */
export interface BooleanFieldConfig extends BaseFieldConfig {}

/**
 * Field class for booleans.
 * Converts '1', 1, 'true' to true & '0', 0, 'false' to false
 */
export class BooleanField<Config extends BooleanFieldConfig> extends BaseField<
  boolean,
  Config
> {
  public validateType(value: boolean): void {
    if (typeof value !== 'boolean') {
      throw new FieldValidationException(FIELD_MUST_BE_VALID_BOOLEAN)
    }
  }

  public validate(value: any, reporter: ErrorReporter) {
    let finalValue = value

    if (finalValue === '1' || finalValue === 'true' || finalValue === 1) {
      finalValue = true
    } else if (
      finalValue === '0' ||
      finalValue === 0 ||
      finalValue === 'false'
    ) {
      finalValue = false
    }

    return super.validate(finalValue, reporter)
  }
}
