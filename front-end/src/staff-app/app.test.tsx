import React from "react"
import { render } from "@testing-library/react"
import App from "staff-app/app"

test("renders app", () => {
  const { getByText } = render(<App />)
  expect(getByText(/hello world/i)).toBeInTheDocument()
})
