import faker from 'faker'
import { waitFor, fireEvent, screen } from '@testing-library/react'

export const waitForElement = async (testId: string): Promise<void> => {
  const el = screen.getByTestId(testId)
  await waitFor(() => el)
}

export const testButtonDisabled = (
  testId: string,
  isDisabled: boolean
): void => {
  const button = screen.getByTestId(testId)
  expect((button as HTMLButtonElement).disabled).toBe(isDisabled)
}

export const clickElement = (testId: string): void => {
  const button = screen.getByTestId(testId)
  fireEvent.click(button)
}

export const populateField = (
  fieldName: string,
  value: string = faker.random.word()
): void => {
  const inputWrapper = screen.getByTestId(fieldName)
  const input = inputWrapper.querySelector(
    'input.MuiInput-input'
  ) as HTMLInputElement
  fireEvent.input(input, { target: { value: value } })
}

export const testFieldTextContent = (
  fieldName: string,
  errorMessage?: string
): void => {
  expect(screen.getByTestId(fieldName).textContent).toBe(errorMessage)
}
