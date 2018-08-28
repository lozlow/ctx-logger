const asyncHooks = require('async_hooks')

let enabled = false

const contexts = {}
const hooks = asyncHooks.createHook({ init, destroy })

function init (asyncId, type, triggerAsyncId, resource) {
  contexts[asyncId] = {
    trigger: triggerAsyncId,
    context: Object.assign({}, (contexts[triggerAsyncId] || {}).context)
  }
}

function destroy (asyncId) {
  delete contexts[asyncId]
}

// function set (key, val) {
//   contexts[asyncHooks.executionAsyncId()].context[key] = val
// }
//
// function buildContext (asyncId) {
//   let currentId = asyncId
//
//   const ctxs = []
//
//   while (contexts[currentId]) {
//     const currentContext = contexts[currentId]
//     if (Object.keys(currentContext.context).length > 0) {
//       ctxs.unshift(currentContext.context)
//     }
//     currentId = currentContext.trigger
//   }
//
//   return Object.assign({}, ...ctxs)
// }

module.exports = {
  get context () {
    if (!enabled) {
      hooks.enable()
      enabled = true
    }
    const asyncId = asyncHooks.executionAsyncId()
    if (!contexts[asyncId]) {
      contexts[asyncId] = {
        trigger: 0,
        context: {}
      }
    }
    return contexts[asyncId].context
  }
}
