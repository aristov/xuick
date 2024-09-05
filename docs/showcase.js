import './showcase.css'
import { ElemType } from 'htmlmodule'
import { ShowcaseApp } from './ShowcaseApp.js'

ElemType.setDebugMode(true)

const render = app => {
  ShowcaseApp.destroy(app)
  return ShowcaseApp.render({}, document.body)
}

let app = render()

if(module.hot) {
  module.hot.accept(['./ShowcaseApp'], () => app = render(app))
}
