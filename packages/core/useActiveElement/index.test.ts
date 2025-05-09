import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { useActiveElement } from './index'

describe('useActiveElement', () => {
  let shadowHost: HTMLElement
  let input: HTMLInputElement
  let shadowInput: HTMLInputElement
  let shadowRoot: ShadowRoot

  beforeEach(() => {
    shadowHost = document.createElement('div')
    shadowRoot = shadowHost.attachShadow({ mode: 'open' })
    input = document.createElement('input')
    shadowInput = input.cloneNode() as HTMLInputElement
    shadowRoot.appendChild(shadowInput)
    document.body.appendChild(input)
    document.body.appendChild(shadowHost)
  })

  afterEach(() => {
    shadowHost.remove()
    input.remove()
  })

  it('should be defined', () => {
    expect(useActiveElement).toBeDefined()
  })

  it('should initialise correctly', () => {
    const activeElement = useActiveElement()

    expect(activeElement.value).to.equal(document.body)
  })

  it('should initialise with already-active element', () => {
    input.focus()

    const activeElement = useActiveElement()

    expect(activeElement.value).to.equal(input)
  })

  it('should accept custom document', () => {
    const activeElement = useActiveElement({ document: shadowRoot })

    shadowInput.focus()

    expect(activeElement.value).to.equal(shadowInput)
  })

  it('should observe focus/blur events', () => {
    const activeElement = useActiveElement()

    input.focus()

    expect(activeElement.value).to.equal(input)

    input.blur()

    expect(activeElement.value).to.equal(document.body)
  })

  it('should update when activeElement is removed w/document', async () => {
    const activeElement = useActiveElement({ triggerOnRemoval: true })

    input.focus()

    expect(activeElement.value).to.equal(input)

    input.remove()

    await nextTick()

    expect(activeElement.value).to.equal(document.body)
  })

  it('should update when activeElement is removed w/shadowRoot', async () => {
    const activeElement = useActiveElement({ triggerOnRemoval: true, document: shadowRoot })

    shadowInput.focus()

    expect(activeElement.value).to.equal(shadowInput)

    shadowInput.remove()

    await nextTick()

    expect(activeElement.value).to.equal(null)
  })
})
