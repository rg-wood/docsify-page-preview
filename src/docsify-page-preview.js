/* global marked */

import { cached } from './cached.js'
import './dom-structure.js'

class DocsifyPagePreview extends HTMLElement {
  constructor () {
    super()
    this.page = this.getAttribute('page')
    this.ref = this.getAttribute('ref')
    this.addEventListener('mouseover', this.showPreview)
    this.addEventListener('mouseout', this.hidePreview)
    this.parser = cached(marked.parse)
  }

  async showPreview () {
    if (!this.preview) {
      this.preview = await fetch(this.page, {
        method: 'GET',
        mode: 'same-origin',
        cache: 'no-cache'
      })
        .then(response => response.text())
        .then(markdown => this.parser(markdown))
    }

    if (!this.popup) {
      const page = document.createElement('div')
      page.innerHTML = this.preview

      this.popup = this.ref ? page.subsection(`#${this.ref}`) : page
      this.popup.setAttribute('class', 'docsify preview-popup')

      this.append(this.popup)
    }

    this.popup.style.cssText = this.popupStyle
    this.popup.hidden = false
  }

  get popupTop () {
    return this.offsetTop
  }

  get popupLeft () {
    const bodyLeft = document.body.getBoundingClientRect()
    const elementLeft = this.getBoundingClientRect().left
    const offset = elementLeft - bodyLeft - this.width

    return offset
  }

  hidePreview () {
    if (this.popup) this.popup.hidden = true
  }

  get popupStyle () {
    return `
      position: absolute;
      max-width: var(--docsify-page-preview-max-width, 450px);
      max-height: var(--docsify-page-preview-max-height, 200px);

      background: var(--docsify-page-preview-background, white);
      border-radius: .4em;
      border: solid var(--theme-color, #42b983);
      box-shadow:
        0 2.8px 2.2px rgba(0, 0, 0, 0.034),
        0 6.7px 5.3px rgba(0, 0, 0, 0.048),
        0 12.5px 10px rgba(0, 0, 0, 0.06),
        0 22.3px 17.9px rgba(0, 0, 0, 0.072),
        0 41.8px 33.4px rgba(0, 0, 0, 0.086),
        0 100px 80px rgba(0, 0, 0, 0.12);

      margin-top: 1.5em;
      padding: 1em;
      z-index: 1;

      pointer-events: none;
      overflow: hidden;

      top: ${this.popupTop}px;
      left: ${this.popupLeft}px;
    `
  }
}

customElements.define('docsify-page-preview', DocsifyPagePreview)
