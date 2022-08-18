import FieldValidationException from 'src/exceptions/FieldValidationException'
import ValidatorException from 'src/exceptions/ValidatorException'
import { ErrorReporter } from 'src/validator/ErrorReporter'
import {
  BaseField,
  BaseFieldConfig,
  BaseFieldReturnType,
} from 'src/validator/Fields'
import { FIELD_MUST_BE_VALID_OBJECT } from 'src/validator/constants'

/**
 * Options type for object field.
 * If members are not passed then no validation is applied on the members
 * and the type of members is set to any
 */
export interface ObjectFieldConfig extends BaseFieldConfig {
  members?: Record<string, BaseField<any, any>>
}

/**
 * Field class for handling nested objects.
 * Validates each member in a loop.
 */
export class ObjectField<Config extends ObjectFieldConfig> extends BaseField<
  Record<any, any>,
  Config
> {
  public validateType(value: Record<any, any>) {
    if (typeof value !== 'object') {
      throw new FieldValidationException(FIELD_MUST_BE_VALID_OBJECT)
    }
  }

  /**
   * Helper function to validate object schema.
   * Complex type is used to generate the return type
   * according to schema. We can't convert it to separate type
   * as it will make vscode simply show name of type instead of
   * expanding it.
   */
  public async validate(
    value: Record<any, any> | null | undefined,
    reporter: ErrorReporter
  ): Promise<
    BaseFieldReturnType<
      Config extends {
        members?: undefined
      }
        ? any
        : {
            [Key in keyof Config['members']]: Config['members'][Key] extends {
              validate(value: any, reporter: any): Promise<infer T>
            }
              ? T
              : never
          },
      Config
    >
  > {
    const finalValue: any = await super.validate(value, reporter)

    if (!this.config.members || !finalValue) {
      return finalValue
    }

    for (const key in this.config.members) {
      const field = this.config.members[key]

      try {
        finalValue[key] = await field.validate(
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
