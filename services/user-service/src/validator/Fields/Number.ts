import FieldValidationException from 'src/exceptions/FieldValidationException'
import { ErrorReporter } from 'src/validator/ErrorReporter'
import { BaseField, BaseFieldConfig } from 'src/validator/Fields'
import { FIELD_MUST_BE_VALID_NUMBER } from 'src/validator/constants'

/**
 * Options for number field.
 * TODO: implement integer, maxValue, minValue options
 */
export interface NumberFieldConfig extends BaseFieldConfig {}

/**
 * Field class for handling numbers.
 * Auto casts string to number type.
 */
export class NumberField<Config extends NumberFieldConfig> extends BaseField<
  number,
  Config
> {
  public validateType(value: number): void {
    if (typeof value !== 'number') {
      throw new FieldValidationException(FIELD_MUST_BE_VALID_NUMBER)
    }
  }

  public validate(
    value: number | string | null | undefined,
    reporter: ErrorReporter
  ) {
    let finalValue = value

    if (typeof value === 'string' && value.match(/^\d+(\.\d+)?$/)) {
      finalValue = +value
    }

    return super.validate(finalValue as number, reporter)
  }
}
