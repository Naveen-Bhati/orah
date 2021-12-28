import { getRandomInt } from "shared/helpers/math-utils"

interface Options {
  success?: boolean
  randomFailure?: boolean
}
export function httpMock({ success, randomFailure }: Options) {
  return new Promise<void>((resolve, reject) => {
    // resolves randomly between 500ms to 2000ms
    setTimeout(() => {
      if ((randomFailure && Math.random() < 0.9) || success) {
        resolve()
      } else {
        reject({ message: "Failed" })
      }
    }, getRandomInt(5, 20) * 100)
  })
}
