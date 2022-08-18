import { SetKey } from 'src/helpers/types'

/**
 * Set key on an object.
 * @param obj Object to set key on
 * @param key Key
 * @param value value
 */
export function setKey<T extends object, Key extends string, Value>(
  obj: T,
  key: Key,
  value: Value
): SetKey<T, Key, Value> {
  // handles edge case where there's error on both obj.a & obj.a.0
  if (typeof obj !== 'object' || !obj) {
    return obj
  }

  if (key.includes('.')) {
    const keys = key.split('.')

    obj[keys[0]] = obj[keys[0]] || {}

    setKey(obj[keys[0]], keys.slice(1).join('.'), value)
  } else {
    obj[key as any] = value
  }

  return obj as SetKey<T, Key, Value>
}

/**
 * Helper function to get value of specified key on object.
 * TODO: Make type for return value
 */
export function getValue<T extends object, Key extends string>(
  obj: T,
  key: Key,
  defaultValue?: any
): Key extends keyof T ? T[Key] : any {
  if (defaultValue !== undefined && !obj) {
    return defaultValue
  }

  if (key.includes('.')) {
    const keys = key.split('.')

    return getValue(obj[keys[0]], keys.slice(1).join('.'), defaultValue)
  }

  return key in obj ? obj[key as any] : defaultValue
}
