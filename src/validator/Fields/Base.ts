import FieldValidationException from 'src/exceptions/FieldValidationException'
import { ErrorReporter } from 'src/validator/ErrorReporter'
import { FIELD_CANT_BE_NULL, FIELD_IS_REQUIRED } from 'src/validator/constants'

/**
 * Return type class for base field.
 * If config has allowNull=true then adds union of null.
 * If config has required=false then adds union of undefined.
 */
export type BaseFieldReturnType<ValueType, Config extends BaseFieldConfig> =
  | ValueType
  | (Config extends { allowNull: true } ? null : ValueType)
  | (Config extends {
      required: false
    }
      ? undefined
      : ValueType)

/**
 * Base config options.
 */
export interface BaseFieldConfig {
  allowNull?: boolean // defaults to false
  required?: boolean // defaults to true
  emptyStringsToNull?: boolean // defaults to true
}

/**
 * Base class for a validator field
 */
export class BaseField<
  ValueType,
  Config extends BaseFieldConfig = BaseFieldConfig
> {
  constructor(public config: Config) {
    // normalize options
    if (config.allowNull === undefined) {
      config.allowNull = false
    }

    if (config.required === undefined) {
      config.required = true
    }

    if (config.emptyStringsToNull === undefined) {
      config.emptyStringsToNull = true
    }
  }

  /**
   * Function to validate that the type of given value
   * is correct for this field.
   * This field will be implemented in the inherited classes
   */
  public validateType(_value: ValueType): void {}

  /**
   * Function to validate value of this field.
   * The return value is used for further validation.
   * Reporter is used to report errors for object & array fields.
   *
   * Not using {@link BaseFieldReturnType} here due to the
   * nesting of types in ObjectField & ArrayField
   */
  public async validate(
    value: ValueType | null | undefined,
    _reporter: ErrorReporter
  ): Promise<
    | ValueType
    | (Config extends { allowNull: true } ? null : ValueType)
    | (Config extends {
        required: false
      }
        ? undefined
        : ValueType)
  > {
    let finalValue = value

    if (
      this.config.emptyStringsToNull &&
      typeof finalValue === 'string' &&
      finalValue.trim() === ''
    ) {
      finalValue = null
    }

    if (!this.config.allowNull && finalValue === null) {
      throw new FieldValidationException(FIELD_CANT_BE_NULL)
    } else if (this.config.required && finalValue === undefined) {
      throw new FieldValidationException(FIELD_IS_REQUIRED)
    }

    if (finalValue !== null && finalValue !== undefined) {
      this.validateType(finalValue)
    }

    return finalValue as any
  }
}
