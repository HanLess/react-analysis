/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  needsStateRestore,
  restoreStateIfNeeded,
} from './ReactControlledComponent';

// Used as a way to call batchedUpdates when we don't have a reference to
// the renderer. Such as when we're dispatching events or if third party
// libraries need to call batchedUpdates. Eventually, this API will go away when
// everything is batched by default. We'll then have a similar API to opt-out of
// scheduled work and instead do synchronous work.

// Defaults
let _batchedUpdatesImpl = function(fn, bookkeeping) {
  return fn(bookkeeping);
};
let _interactiveUpdatesImpl = function(fn, a, b, c) {
  return fn(a, b, c);
};
let _flushInteractiveUpdatesImpl = function() {};

let isBatching = false;
export function batchedUpdates(fn, bookkeeping) {
  if (isBatching) {
    // If we are currently inside another batch, we need to wait until it
    // fully completes before restoring state.
    return fn(bookkeeping);
  }
  isBatching = true;
  try {
    return _batchedUpdatesImpl(fn, bookkeeping);
  } finally {
    // Here we wait until all updates have propagated, which is important
    // when using controlled components within layers:
    // https://github.com/facebook/react/issues/1698
    // Then we restore state of any controlled component.
    isBatching = false;
    const controlledComponentsHavePendingUpdates = needsStateRestore();
    if (controlledComponentsHavePendingUpdates) {
      // If a controlled event was fired, we may need to restore the state of
      // the DOM node back to the controlled value. This is necessary when React
      // bails out of the update without touching the DOM.
      _flushInteractiveUpdatesImpl();
      restoreStateIfNeeded();
    }
  }
}

/**
 * 在执行之前已经走了 setBatchingImplementation（下面这个） 方法
 * _interactiveUpdatesImpl 已经被赋值为 react-reconciler/src/ReactFiberScheduler/interactiveUpdates
 */
export function interactiveUpdates(fn, a, b, c) {
  return _interactiveUpdatesImpl(fn, a, b, c);
}
/**
 * 与上面的一样 _flushInteractiveUpdatesImpl 已经被赋值
 */
export function flushInteractiveUpdates() {
  return _flushInteractiveUpdatesImpl();
}

/**
 * 
 * 这个方法什么时候执行？
 * 
 * 查代码可以发现，这个方法被其他模块引入后立即执行
 */
export function setBatchingImplementation(
  batchedUpdatesImpl,
  interactiveUpdatesImpl,
  flushInteractiveUpdatesImpl,
) {
  _batchedUpdatesImpl = batchedUpdatesImpl;
  _interactiveUpdatesImpl = interactiveUpdatesImpl;
  _flushInteractiveUpdatesImpl = flushInteractiveUpdatesImpl;
}
