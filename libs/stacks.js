import { useState } from 'anujs'

// 页面栈
const [stacks, updateStacks] = useState([])

export function list() {
  return stacks
}

export function mark(action) {
  updateStacks((stacks) => {
    stacks.push(action)

    return stacks
  })
}

export function back() {
  updateStacks((stacks) => {
    stacks.pop()()

    return stacks
  })
}
