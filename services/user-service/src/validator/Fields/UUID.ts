import FieldValidationException from 'src/exceptions/FieldValidationException'
import { ErrorReporter } from 'src/validator/ErrorReporter'
import { StringField, StringFieldConfig } from 'src/validator/Fields'
import { FIELD_MUST_BE_VALID_UUID } from 'src/validator/constants'

/**
 * Field class for UUIDs. Inherits {@link StringField} &
 * simply uses regex to ensure string is a valid uuid.
 */
export class UUIDField<
  Config extends StringFieldConfig
> extends StringField<Config> {
  public async validate(
    value: string | null | undefined,
    reporter: ErrorReporter
  ) {
    const validatedValue = await super.validate(value, reporter)

    if (
      validatedValue &&
      !validatedValue.match(
        /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
      )
    ) {
      throw new FieldValidationException(FIELD_MUST_BE_VALID_UUID)
    }

    return validatedValue
  }
}
