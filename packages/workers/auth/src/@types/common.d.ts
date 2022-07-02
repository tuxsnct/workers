type PromiseType<T extends Promise<unknown>> = T extends Promise<infer P>
  ? P
  : never

type PartiallyPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

type ResponseItems<T = Record<string, unknown>> = {
  code: number,
  data: T
  headers: Record<string, string>
}
