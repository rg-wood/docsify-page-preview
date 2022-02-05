const cache = new Map()

export const cached = (f) => {
  return (input) => {
    const key = btoa(input)

    return cache.has(key)
      ? cache.get(key)
      : cache.set(key, f(input)).get(key)
  }
}
