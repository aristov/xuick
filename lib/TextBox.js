import { RoleTextBox } from 'htmlmodule'
import { Widget } from './Widget.js'
import { Label } from './Label.js'
import { Control } from './Control.js'
import { Placeholder } from './Placeholder.js'
import './TextBox.css'

export class TextBox extends Widget
{
  static class = 'TextBox'

  static defaultProps = {
    inputRole : 'TextBox',
    tabIndex : null,
  }

  value = ''

  #anchorNode = null
  #focusNode = null
  #anchorOffset = 0
  #focusOffset = 0

  init() {
    super.init()
    this.on('focusin', () => {
      document.addEventListener('selectionchange', this.#onSelectionChange)
    })
    this.on('focusout', () => {
      document.removeEventListener('selectionchange', this.#onSelectionChange)
    })
    this.on('click', this.#onClick)
    this.on('input', this.#onInput)
    this.on('paste', this.#onPaste)
  }

  destroy() {
    super.destroy()
    document.removeEventListener('selectionchange', this.#onSelectionChange)
  }

  assign() {
    super.assign()
    if(!this.props.value) {
      this.classList = 'blank'
    }
  }

  render() {
    const props = this.props
    return [
      props.label && new TextBoxLabel({
        key : 'label',
        children : props.label,
      }),
      new TextBoxControl({
        key : 'control',
        children : [
          props.placeholder && new TextBoxPlaceholder({
            key : 'placeholder',
            children : props.placeholder,
          }),
          this._input = new TextBoxInput({
            key : 'edit',
            role : props.inputRole,
            tabIndex : props.disabled ? null : 0,
            contentEditable : props.editable ?? String(!props.disabled && !props.readOnly),
            disabled : props.disabled,
            readOnly : props.readOnly,
            placeholder : props.placeholder,
            label : props.label,
            invalid : props.invalid,
            required : props.required,
            errorMessage : props.errorMessage,
            inputMode : props.inputMode,
            enterKeyHint : props.enterKeyHint,
            autocapitalize : props.autocapitalize,
            spellcheck : props.spellcheck,
            [props.multiLine ?
              'innerText' :
              'textContent'] : props.value ?? '',
          }),
        ],
      }),
    ]
  }

  update(prevProps, prevState) {
    const node = this._input.node
    if(node !== document.activeElement || !node.hasChildNodes()) {
      return
    }
    if(!this.#anchorNode || !this.node.contains(this.#anchorNode)) {
      return
    }
    if(!this.#focusNode || !this.node.contains(this.#focusNode)) {
      return
    }
    const selection = getSelection()
    const anchorOffset = Math.min(this.#anchorOffset, this.#anchorNode.length ?? 0)
    const focusOffset = Math.min(this.#focusOffset, this.#focusNode.length ?? 0)
    selection.collapse(this.#anchorNode, anchorOffset)
    selection.extend(this.#focusNode, focusOffset)
  }

  focus() {
    this._input.focus()
  }

  blur() {
    this._input.blur()
  }

  #onSelectionChange = () => {
    const selection = getSelection()
    this.#anchorNode = selection.anchorNode
    this.#focusNode = selection.focusNode
    this.#anchorOffset = selection.anchorOffset
    this.#focusOffset = selection.focusOffset
  }

  /**
   * @param {EventType} e
   */
  #onClick(e) {
    if(e.target !== this._input) {
      this._input.focus()
    }
  }

  #onInput(e) {
    if(e.target === this) {
      return
    }
    e.stopImmediatePropagation()
    const node = e.target.node
    const selection = getSelection()
    if(this.multiLine) {
      if(/^\n$/.test(node.innerText)) {
        node.innerText = ''
      }
      this.value = node.innerText
    }
    else if(e.inputType === 'insertParagraph') {
      node.textContent = this.value
      if(node.firstChild) {
        selection.collapse(node.firstChild, this.#anchorOffset)
        selection.extend(node.firstChild, this.#focusOffset)
      }
      this.form?.emit('submit', {
        submitter : this.node,
      })
      return
    }
    else {
      this.value = node.textContent
    }
    this.#anchorNode = selection.anchorNode
    this.#focusNode = selection.focusNode
    this.#anchorOffset = selection.anchorOffset
    this.#focusOffset = selection.focusOffset
    this.emit('input', {
      data : e.data,
      inputType : e.inputType,
      isComposing : e.isComposing,
      detail : e.detail,
      view : e.view,
    })
  }

  #onPaste(e) {
    e.preventDefault()
    if(this.readOnly) {
      return
    }
    const node = this._input.node
    const selection = getSelection()
    const data = e.clipboardData.getData('text')
    let text, html, anchor, offset, index, boundary, offsetA, offsetB, textA, textB
    if(!this.multiLine) {
      text = node.textContent
      offsetA = Math.min(selection.anchorOffset, selection.focusOffset)
      offsetB = Math.max(selection.anchorOffset, selection.focusOffset)
      textA = text.slice(0, offsetA)
      textB = text.slice(offsetB)
      node.textContent = textA + data + textB
      anchor = node.firstChild
      index = textA.length + data.length
      selection.collapse(anchor, index)
      this._input.emit('input')
      return
    }
    if(!node.innerText) {
      node.innerText = data
      anchor = TextBox.findLastTextNode(node) || node.lastChild
      index = anchor.data?.length || 0
      selection.collapse(anchor, index)
      this._input.emit('input')
      return
    }
    selection.deleteFromDocument()
    boundary = TextBox.generateBoundary(node.innerHTML)
    anchor = selection.anchorNode
    offset = selection.anchorOffset
    if(anchor.nodeType !== Node.TEXT_NODE) {
      anchor = selection.anchorNode.childNodes[selection.anchorOffset]
      if(anchor) {
        anchor.before(boundary)
      }
      else node.append(boundary)
    }
    else {
      anchor.data = anchor.data.slice(0, offset) + boundary + anchor.data.slice(offset)
    }
    text = data.replace(/\n/g, '<br>') + boundary
    html = node.innerHTML
    html = html.replace(/<div><br><\/div>/g, '<br>')
    html = html.replace(/<\/div><br>/g, '<br>')
    html = html.replace(/<div>/g, '<br>')
    html = html.replace(/<\/div>/g, '')
    html = html.replace(boundary, text)
    node.innerHTML = html
    anchor = TextBox.findTextNodeBySample(node, boundary)
    if(anchor) {
      index = anchor.data.indexOf(boundary)
      anchor.data = anchor.data.replace(boundary, '')
    }
    else {
      anchor = node
      offset = selection.anchorOffset
      node.innerHTML = node.innerHTML.replace(boundary, '')
      index = Math.min(node.childNodes.length - 1, offset)
    }
    selection.collapse(anchor, index)
    this._input.emit('input')
  }

  static findLastTextNode(node) {
    if(!node) {
      return null
    }
    if(node.nodeType === Node.TEXT_NODE) {
      return node
    }
    let result
    if(result = this.findLastTextNode(node.lastChild)) {
      return result
    }
    if(result = this.findLastTextNode(node.previousSibling)) {
      return result
    }
    return null
  }

  static generateBoundary(text) {
    let boundary
    do boundary = btoa(Math.random())
    while(text.indexOf(boundary) > -1)
    return boundary
  }

  static findTextNodeBySample(node, sample) {
    let child
    for(child of node.childNodes) {
      if(child.data && child.data.indexOf(sample) > -1) {
        return child
      }
      if(child = this.findTextNodeBySample(child, sample)) {
        return child
      }
    }
    return null
  }
}

export class TextBoxLabel extends Label
{
  static class = 'TextBoxLabel'
}

export class TextBoxControl extends Control
{
  static class = 'TextBoxControl'
}

export class TextBoxPlaceholder extends Placeholder
{
  static class = 'TextBoxPlaceholder'
}

export class TextBoxInput extends RoleTextBox
{
  static class = 'TextBoxInput'
}
