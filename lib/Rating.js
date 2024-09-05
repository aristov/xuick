import { HtmlDiv } from 'htmlmodule'
import { Inner } from './Inner.js'
import './Rating.css'

const txt = normalize({
  1 : 'rgb(255, 255, 255)',
  4 : 'rgb(255, 255, 255)',
})
const bg = normalize({
  1 : 'rgb(248, 0, 0)',
  4 : 'rgb(255, 173, 49)',
  7 : 'rgb(251, 255, 43)',
  10 : 'rgb(94, 235, 0)',
})

export class Rating extends HtmlDiv
{
  static class = 'Rating'

  render() {
    const value = this.props.value ?? 0
    const txtColor = getRGB(txt, value)
    const bgColor = getRGB(bg, value)
    const style = {}
    if(txtColor) {
      style.color = `rgb(${ txtColor })`
    }
    if(bgColor) {
      style.backgroundColor = `rgb(${ bgColor })`
      style.borderColor = 'transparent'
    }
    this.style = Object.keys(style).length ? style : null
    return new Inner(value < 10 ? value.toFixed(1) : value)
  }
}

function normalize(colors) {
  const result = {}
  for(const [key, value] of Object.entries(colors)) {
    const fn = new Function('rgb', 'return ' + value)
    result[key] = fn((...args) => args)
  }
  return result
}

function getRGB(colors, value) {
  const keys = Object.keys(colors).sort((a, b) => a - b)
  if(value < keys.at(0) || value > keys.at(-1)) {
    return null
  }
  let i, key1, key2, colors1, colors2
  for(i = 0; i < keys.length; i++) {
    key1 = keys[i]
    key2 = keys[i + 1]
    if(value >= key1 && value <= key2) {
      colors1 = colors[key1]
      colors2 = colors[key2]
      break
    }
  }
  const vRange = [key1, key2]
  const rangeR = [colors1[0], colors2[0]]
  const rangeG = [colors1[1], colors2[1]]
  const rangeB = [colors1[2], colors2[2]]
  const r = getColor(rangeR, vRange, value)
  const g = getColor(rangeG, vRange, value)
  const b = getColor(rangeB, vRange, value)
  return [r, g, b]
}

function getColor(cRange, vRange, value) {
  const k = (cRange[1] - cRange[0]) / (vRange[1] - vRange[0])
  return Math.round(cRange[0] + (value - vRange[0]) * k)
}
