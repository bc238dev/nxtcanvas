export interface ErrorCodeMap {
  code: number
  key?: string
  msg?: string
}

export const NxtCanvasErrorCode: { [key in keyof ErrorCodes]: ErrorCodeMap } = {
  Undefined: { code: -1, key: "undefined_error" },
  NoRootElement: { code: 1000, key: "no_root_element", msg: "No root element found!" },
}

export interface ErrorCodes {
  Undefined: string
  NoRootElement: string
}

export class NxtCanvasError extends Error {
  constructor(public errorMap: ErrorCodeMap, detail?: string) {
    super(`${errorMap.msg} ${detail ? `: ${detail}` : ""}`)
  }
}
