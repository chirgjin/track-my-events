export type FormState<Key extends string> = Record<
  Key,
  {
    error?: false | string
    value: string
  }
>
