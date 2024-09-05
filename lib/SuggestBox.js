import lodash from 'lodash'
import debounce from 'lodash/debounce'
import { Id } from 'htmlmodule'
import { Widget } from './Widget.js'
import { Label } from './Label.js'
import { Control } from './Control.js'
import { TextBox } from './TextBox.js'
import { ClearButton } from './ClearButton.js'
import { SuggestBoxPopup } from './SuggestBoxPopup.js'
import { ListBox } from './ListBox.js'
import { Option } from './Option.js'
import { Status } from './Status.js'
import './SuggestBox.css'

const DEFAULT_LIMIT = 50
const DEBOUNCE_DELAY = 500

export class SuggestBox extends Widget
{
  static class = 'SuggestBox'

  static role = 'combobox'

  static defaultProps = {
    tabIndex : null,
    autoComplete : 'list',
    hasPopup : 'listbox',
    limit : DEFAULT_LIMIT,
    delay : DEBOUNCE_DELAY,
    Option,
  }

  state = {
    ...this.state,
    query : '',
    expanded : false,
    items : undefined,
    busy : false,
    stop : false,
  }

  item = null

  #reqId = 0

  #listBoxId

  #debounceLoad = debounce(() => this.#load(), this.props.delay)

  /**
   * @protected
   */
  init() {
    super.init()
    this.on('click', this.#onClick)
    this.on('input', this.#onInput)
    this.on('change', this.#onChange)
    this.on('scroll', this.#onScroll, true)
    this.on('keydown', this.#onKeyDown)
    this.on('keydown', this.#onKeyDownCapture, true)
    this.on('pointerdown', this.#onPointerDown)
  }

  /**
   * @protected
   */
  assign() {
    super.assign()
    this.expanded = this.state.expanded
    this.controls = this.#listBoxId ??= Id.generate()
    if(this.props.value === undefined) {
      this.classList = 'blank'
    }
  }

  /**
   * @protected
   */
  render() {
    const { props, state } = this
    const items = state.items
    const item = items?.find(item => {
      return this.getItemId(item) === props.value
    })
    const query = item ?
      this.getItemName(item) :
      props.query ?? state.query
    const excludes = lodash.keyBy(props.excludeIds)
    const options = items?.flatMap(item => {
      const id = this.getItemId(item)
      if(excludes[id]) {
        return []
      }
      return [
        new props.Option({
          item,
          key : id,
          value : id,
          text : this.getItemName(item),
        }),
      ]
    })
    return [
      props.label && new SuggestBoxLabel({
        key : 'label',
        children : props.label,
      }),
      new SuggestBoxControl({
        key : 'control',
        children : [
          this._textBox = new SuggestTextBox({
            inputRole : 'SearchBox',
            inputMode : 'search',
            enterKeyHint : 'search',
            autocapitalize : 'none',
            spellcheck : 'false',
            editable : item && 'false',
            placeholder : props.placeholder,
            readOnly : props.readOnly,
            value : query,
          }),
          item && new ClearButton({ tabIndex : -1 }),
        ],
      }),
      this._popup = new SuggestBoxPopup({
        key : 'popup',
        float : true,
        width : 'anchor',
        height : 'auto',
        anchor : this._textBox,
        open : state.expanded,
        oncancel : this.#onPopupCancel,
        content : [
          this._listBox = new ListBox({
            id : this.#listBoxId,
            tabIndex : null,
            hidden : !options?.length,
            value : props.value,
            options,
          }),
          !options && state.busy && new SuggestBoxStatus('Loading...'),
          options && !options.length && new SuggestBoxStatus('Not found'),
        ],
      }),
    ]
  }

  /**
   * @protected
   */
  async mount() {
    super.mount()
    if(!this.value) {
      return
    }
    this.setState({
      items : [await this.loadItem(this.value)],
    })
  }

  /**
   * @param {{}} prevProps
   * @param {{}} prevState
   * @protected
   */
  update(prevProps, prevState) {
    const state = this.state
    if(state.expanded) {
      if(state.items === undefined && !state.busy) {
        void this.#load()
        return
      }
      if(!prevState.expanded) {
        this._listBox.scrollToOption()
      }
      return
    }
    const props = this.props
    if(!props.value || !state.items) {
      this.item = null
      return
    }
    this.item = state.items.find(item => {
      return this.getItemId(item) === props.value
    })
  }

  /**
   * @public
   */
  focus() {
    this._textBox.focus()
  }

  /**
   * @public
   */
  blur() {
    this._textBox.blur()
  }

  /**
   * @public
   */
  reset() {
    this.query = ''
    this.value = undefined
    this.item = null
    this.setState({
      query : '',
      expanded : false,
      items : undefined,
      stop : false,
    })
  }

  /**
   * @private
   */
  #clear() {
    this.query = ''
    this.value = undefined
    this.item = null
    this.emit('change')
    this.setState({
      query : '',
      items : undefined,
      stop : false,
      busy : true,
      expanded : true,
    })
    void this.#load()
    this.focus()
  }

  /**
   * @param {{}[]} items
   * @return {Promise<void>}
   * @private
   */
  async #load(items = []) {
    const state = this.state
    if(!state.busy) {
      this.setState({ busy : true })
    }
    try {
      const props = this.props
      const query = props.query ?? state.query
      const limit = props.limit
      const reqId = ++this.#reqId
      const result = await this.loadItems(query, limit, items.length)
      if(this.#reqId !== reqId) {
        return
      }
      this.setState({
        busy : false,
        items : result && lodash.uniqBy(
          [...items, ...result],
          item => this.getItemId(item),
        ),
        stop : result === null || result.length < limit,
      })
    }
    catch(error) {
      this.setState({
        busy : false,
        items : [],
      })
      console.error(error)
    }
  }

  /**
   * @param {string} query
   * @param {number} limit
   * @param {number} offset
   * @return {Promise<{}[]>}
   * @protected
   * @abstract
   */
  async loadItems(query, limit, offset) {
    const url = Object.assign(new URL(location.origin), {
      pathname : this.props.pathname || '/items',
      search : new URLSearchParams({ query, limit, offset }),
    })
    const res = await fetch(url)
    return res.json()
  }

  /**
   * @param {number} id
   * @return {Promise<{}>}
   * @protected
   * @abstract
   */
  async loadItem(id) {
    const pathname = this.props.pathname || '/items'
    const url = new URL(pathname + '/' + id, location.origin)
    const res = await fetch(url)
    return res.json()
  }

  /**
   * @param {{}} item
   * @return {number|string}
   * @protected
   */
  getItemId(item) {
    return item.id
  }

  /**
   * @param {{}} item
   * @return {string}
   * @protected
   */
  getItemName(item) {
    return item.name
  }

  /**
   * @private
   */
  #updateValue() {
    const value = this.value
    this.value = this._listBox.value
    if(this.value === value) {
      return
    }
    const items = this.state.items
    const filter = item => {
      return this.getItemId(item) === this.value
    }
    this.item = items?.find(filter) || null
    this.emit('change')
  }

  /**
   * @param {EventType} e
   * @private
   */
  #onClick(e) {
    if(this.props.readOnly) {
      this.focus()
      return
    }
    const target = e.target
    if(target.closest(ClearButton)) {
      this.#clear()
      return
    }
    const option = target.closest(Option)
    if(option) {
      if(option.disabled) {
        this.focus()
        return
      }
      this.#updateValue()
    }
    this.setState(state => ({
      expanded : this.value === undefined || !state.expanded,
    }))
    this.focus()
  }

  /**
   * @param {EventType} e
   * @private
   */
  #onKeyDownCapture(e) {
    if(e.code === 'Enter') {
      e.preventDefault()
    }
  }

  /**
   * @private
   */
  #onPopupCancel = () => {
    this.setState({ expanded : false })
  }

  /**
   * @param {EventType} e
   * @private
   */
  #onInput(e) {
    const target = e.target
    if(target === this) {
      return
    }
    e.stopImmediatePropagation()
    this.query = target.value
    this.emit('input')
    this.setState({
      query : this.query,
      expanded : true,
      stop : false,
      busy : true,
    })
    this.#debounceLoad()
  }

  /**
   * @param {EventType} e
   * @private
   */
  #onChange(e) {
    if(e.target !== this) {
      e.stopImmediatePropagation()
    }
  }

  /**
   * @param {EventType} e
   * @private
   */
  #onScroll(e) {
    const state = this.state
    if(state.stop || state.busy) {
      return
    }
    const target = e.target
    if(!target.closest(ListBox)) {
      return
    }
    const node = target.node
    if(node.scrollTop > node.scrollHeight - node.clientHeight * 2) {
      void this.#load(state.items)
    }
  }

  #onKeyDown(e) {
    if(e.code === 'Enter') {
      this.#onEnter(e)
      return
    }
    if(e.code === 'Space') {
      this.#onSpace(e)
      return
    }
    if(e.code === 'Backspace') {
      this.#onBackspace(e)
      return
    }
    if(e.code === 'ArrowUp') {
      this.#onArrowUp(e)
      return
    }
    if(e.code === 'ArrowDown') {
      this.#onArrowDown(e)
    }
  }

  /**
   * @protected
   */
  #onEnter() {
    if(this.state.busy || this.props.readOnly) {
      return
    }
    if(!this.state.expanded) {
      this.setState({ expanded : true })
      return
    }
    this.#updateValue()
    this.setState({ expanded : false })
  }

  /**
   * @param {EventType} e
   * @protected
   */
  #onSpace(e) {
    if(!this.value) {
      return
    }
    e.preventDefault()
    this.setState(state => ({
      expanded : !state.expanded,
    }))
  }

  /**
   * @param {EventType} e
   * @protected
   */
  #onArrowUp(e) {
    e.preventDefault()
    if(this.props.readOnly) {
      return
    }
    if(!this.state.expanded) {
      this.setState({ expanded : true })
    }
    this._listBox.shiftFocus(-1, e)
    this.focus()
  }

  /**
   * @param {EventType} e
   * @protected
   */
  #onArrowDown(e) {
    e.preventDefault()
    if(this.props.readOnly) {
      return
    }
    if(!this.state.expanded) {
      this.setState({ expanded : true })
    }
    this._listBox.shiftFocus(1, e)
    this.focus()
  }

  /**
   * @protected
   */
  #onBackspace() {
    if(!this.value || this.props.readOnly) {
      return
    }
    this.blur()
    this.#clear()
  }

  /**
   * @param {EventType} e
   * @protected
   */
  #onPointerDown(e) {
    if(e.target.closest(TextBox) !== this._textBox) {
      setTimeout(() => this.focus())
    }
  }

  /**
   * @return {{}[]}
   * @public
   */
  get items() {
    return this.state.items || []
  }
}

export class SuggestBoxLabel extends Label
{
  static class = 'SuggestBoxLabel'
}

export class SuggestBoxControl extends Control
{
  static class = 'SuggestBoxControl'
}

export class SuggestTextBox extends TextBox
{
  static class = 'SuggestTextBox'
}

export class SuggestBoxStatus extends Status
{
  static class = 'SuggestBoxStatus'
}
