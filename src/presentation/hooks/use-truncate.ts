export const useTruncate = (text: string, charLimit: number): string => {
  if (text?.length > charLimit) {
    const words = text.split(' ')
    const emptySpaces = words.length - 1
    let charCount = emptySpaces
    const stringBatch = []
    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      if (charCount + word.length <= charLimit) {
        stringBatch.push(word)
        charCount += word.length
      } else {
        break
      }
    }
    return stringBatch.join(' ').concat('...')
  }
  return text
}
