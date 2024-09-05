import { HtmlType, ElemType } from 'htmlmodule'
import './App.css'

const TRAILING_SLASH_RE = /(\w+)\/$/

export class App extends HtmlType
{
  static class = 'App'

  state = {
    url : new URL(location),
    data : null,
  }

  init() {
    window.addEventListener('popstate', this.#onPopState)
  }

  destroy() {
    window.removeEventListener('popstate', this.#onPopState)
  }

  async navigate(url, options) {
    const data = options?.data || null
    if(typeof url === 'string') {
      url = new URL(url, location.origin)
    }
    else if(url === location) {
      url = new URL(location)
    }
    else if(!(url instanceof URL)) {
      url = Object.assign(new URL(location), url)
    }
    await new Promise(setTimeout)
    if(options?.replace || url.href === location.href) {
      history.replaceState(data, '', url)
    }
    else history.pushState(data, '', url)
    this.setState({ url, data })
  }

  #onPopState = async e => {
    await new Promise(setTimeout)
    this.setState({
      url : new URL(location),
      data : e.state,
    })
  }

  /**
   * @param {{path:string,render:function}[]} routes
   * @return {*|string|ElemType|*[]|string[]|ElemType[]}
   */
  static router(routes) {
    let pathname, route, match
    pathname = decodeURIComponent(location.pathname)
    pathname = pathname.replace(TRAILING_SLASH_RE, '$1')
    for(route of routes.flat(Infinity)) {
      if(!route) {
        continue
      }
      match = typeof route.path === 'string' ?
        route.path === pathname && [] :
        pathname.match(route.path)
      if(!match) {
        continue
      }
      return ElemType.isPrototypeOf(route.render) ?
        new route.render :
        route.render(...match.slice(1))
    }
  }
}
