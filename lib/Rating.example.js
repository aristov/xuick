import { Example } from './Example.js'
import { Rating } from './Rating.js'

export default () => new Example({
  classList : 'flex',
  children : [
    new Rating({ value : 0 }),
    new Rating({ value : 1 }),
    new Rating({ value : 2 }),
    new Rating({ value : 3 }),
    new Rating({ value : 4 }),
    new Rating({ value : 5 }),
    new Rating({ value : 6 }),
    new Rating({ value : 7 }),
    new Rating({ value : 8 }),
    new Rating({ value : 9 }),
    new Rating({ value : 9.8 }),
    new Rating({ value : 9.9 }),
    new Rating({ value : 10 }),
  ],
})
