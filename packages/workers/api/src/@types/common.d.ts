type PromiseType<T extends Promise<unknown>> = T extends Promise<infer P>
  ? P
  : never

type PartiallyPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

type ResponseItems = {
  code: number,
  data: Record<string, unknown> | import('graphql').ExecutionResult
  headers: Record<string, string>
}
