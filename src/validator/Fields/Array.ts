import FieldValidationException from 'src/exceptions/FieldValidationException'
import ValidatorException from 'src/exceptions/ValidatorException'
import { ErrorReporter } from 'src/validator/ErrorReporter'
import {
  BaseField,
  BaseFieldConfig,
  BaseFieldReturnType,
} from 'src/validator/Fields'
import { FIELD_MUST_BE_VALID_ARRAY } from 'src/validator/constants'

/**
 * Options type for array field.
 * If members are not passed then no validation is applied on the members
 * and the type of members is set to any[]
 */
export interface ArrayFieldConfig extends BaseFieldConfig {
  members?: BaseField<any, any>
}

/**
 * Field class for handling typed arrays.
 * Validates each member in a loop.
 */
export class ArrayField<Config extends ArrayFieldConfig> extends BaseField<
  any[],
  Config
> {
  public validateType(value: any[]) {
    if (!Array.isArray(value)) {
      throw new FieldValidationException(FIELD_MUST_BE_VALID_ARRAY)
    }
  }

  /**
   * Helper function to validate array members.
   * Complex type is used to generate the return type
   * according to schema. We can't convert it to separate type
   * as it will make vscode simply show name of type instead of
   * expanding it.
   */
  public async validate(
    value: any[] | null | undefined,
    reporter: ErrorReporter
  ): Promise<
    BaseFieldReturnType<
      Config extends {
        members?: undefined
      }
        ? any[]
        : Config['members'] extends {
            validate(value: any, reporter: any): Promise<infer T>
          }
        ? T[]
        : never,
      Config
    >
  > {
    const finalValue: any = await super.validate(value, reporter)

    if (!this.config.members || !finalValue) {
      return finalValue
    }

    for (const key in finalValue) {
      try {
        finalValue[key] = await this.config.members.validate(
          finalValue[key],
          reporter.getChild(key)
        )
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

    return finalValue
  }
}
