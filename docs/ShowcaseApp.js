import { App } from '../lib/App.js'
import examples from '../examples.js'

export class ShowcaseApp extends App
{
  static class = 'App'

  render() {
    return Object.values(examples).map(item => item.default())
  }
}
