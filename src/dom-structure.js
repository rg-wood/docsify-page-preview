HTMLElement.prototype.subsection = function (id) {
  nestedChildNodes(Array.from(this.childNodes))
    .flat(5)
    .every((node) => {
      if (node.id === id) {
        return false
      } else if (node.querySelector && node.querySelector(`#${id}`)) {
        return true
      } else {
        if (node.remove) node.remove()
        return true
      }
    })
  return this
}

const nestedChildNodes = (nodelist) => {
  return nodelist.map((node) => {
    if (node.childNodes.length > 0) {
      return nestedChildNodes(Array.from(node.childNodes))
    } else {
      return nodelist
    }
  })
}
