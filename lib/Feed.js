import { RoleFeed } from 'htmlmodule'
import './Feed.css'

const DEFAULT_LIMIT = 20

export class Feed extends RoleFeed
{
  static class = 'Feed'

  static defaultProps = {
    limit : DEFAULT_LIMIT,
  }

  state = {
    items : undefined,
    stop : false,
    busy : false,
  }

  /**
   * @protected
   */
  init() {
    document.addEventListener('scroll', this.#onScroll, true)
    void this.load()
  }

  assign() {
    this.busy = this.state.busy
  }

  /**
   * @protected
   */
  destroy() {
    document.removeEventListener('scroll', this.#onScroll, true)
  }

  /**
   * @param {{}[]} items
   * @return {Promise<void>}
   * @public
   */
  async load(items = []) {
    if(this.state.busy) {
      return
    }
    this.setState({
      busy : true,
      items : items.length ? items : undefined,
    })
    try {
      const limit = this.props.limit
      const result = await this.loadItems(items.length)
      this.setState({
        busy : false,
        items : [...items, ...result],
        stop : result.length < limit,
      })
      this.emit('load')
    }
    catch(error) {
      this.setState({ busy : false })
      throw error
    }
  }

  /**
   * @param {number} offset
   * @return {Promise<any>}
   * @protected
   * @abstract
   */
  async loadItems(offset) {
    const { pathname, limit } = this.props
    if(!pathname) {
      throw Error('pathname is required')
    }
    const url = Object.assign(new URL(location.origin), {
      pathname,
      search : new URLSearchParams({ limit, offset }),
    })
    const res = await fetch(url)
    return res.json()
  }

  /**
   * @private
   */
  #onScroll = () => {
    if(this.state.stop) {
      return
    }
    const rect = this.node.getBoundingClientRect()
    if(rect.bottom < window.innerHeight * 2) {
      void this.load(this.state.items)
    }
  }
}
