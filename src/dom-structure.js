HTMLElement.prototype.subsection = function (selector) {
  const subsection = this.cloneNode(true)
  const childNodes = Array.from(subsection.childNodes)

  const subheaderIndex = childNodes.findIndex(c => {
    if (c.querySelector) {
      return c.querySelector(selector)
    }
    return false
  })

  childNodes
    .splice(0, subheaderIndex)
    .forEach(child => {
      subsection.removeChild(child)
    })

  return subsection
}
