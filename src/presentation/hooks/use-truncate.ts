export const useTruncate = (text: string, charLimit: number): string => {
  if (text?.length < charLimit || !text) { return text }

  const words = text.split(' ')
  const stringBatch = []
  let charCount = 0

  if (words[0].length > charLimit) {
    return words[0].slice(0, charLimit).concat('...')
  }

  for (let i = 0; i < words.length; i++) {
    const word = words[i]

    if (charCount + word.length <= charLimit) {
      stringBatch.push(word)
      charCount += word.length + 1
    } else {
      break
    }
  }
  return stringBatch.join(' ').concat('...')
}
