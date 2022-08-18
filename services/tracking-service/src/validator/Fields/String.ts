import { interpolate } from '@poppinss/utils/build/helpers'

import FieldValidationException from 'src/exceptions/FieldValidationException'
import { ErrorReporter } from 'src/validator/ErrorReporter'
import { BaseField, BaseFieldConfig } from 'src/validator/Fields'
import {
  FIELD_MUST_BE_VALID_STRING,
  STRING_CANT_EXCEED_LENGTH,
  FIELD_MUST_BE_VALID_EMAIL,
  STRING_SHOULD_BE_GREATER_THAN,
} from 'src/validator/constants'

/**
 * Options for string field.
 */
export interface StringFieldConfig extends BaseFieldConfig {
  maxLength?: number
  minLength?: number
  trim?: boolean // defaults to true
  email?: boolean
}

/**
 * Field class for string type.
 */
export class StringField<Config extends StringFieldConfig> extends BaseField<
  string,
  Config
> {
  constructor(config: Config) {
    super(config)

    // normalize options
    if (config.trim === undefined) {
      config.trim = true
    }
  }

  public validateType(value: string) {
    if (typeof value !== 'string') {
      throw new FieldValidationException(FIELD_MUST_BE_VALID_STRING)
    }
  }

  public async validate(
    value: string | null | undefined,
    reporter: ErrorReporter
  ) {
    let finalValue = await super.validate(value, reporter)

    if (!finalValue) {
      return finalValue
    }

    if (this.config.trim) {
      finalValue = finalValue.trim()
    }

    if (
      typeof this.config.maxLength === 'number' &&
      finalValue.length > this.config.maxLength
    ) {
      throw new FieldValidationException(
        interpolate(STRING_CANT_EXCEED_LENGTH, {
          maxLength: this.config.maxLength,
        })
      )
    }

    if (
      typeof this.config.minLength === 'number' &&
      finalValue.length < this.config.minLength
    ) {
      throw new FieldValidationException(
        interpolate(STRING_SHOULD_BE_GREATER_THAN, {
          minLength: this.config.minLength,
        })
      )
    }

    if (this.config.email && !finalValue.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      throw new FieldValidationException(FIELD_MUST_BE_VALID_EMAIL)
    }

    return finalValue
  }
}
