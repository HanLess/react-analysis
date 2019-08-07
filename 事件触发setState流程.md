#### 直接传递对象的setstate会被合并成一次
#### 使用函数传递state不会被合并

#### 为什么 setState 会被合并

在源码中搜 ‘点位 6’，可以发现如下

```
try {
  // 这里会执行事件的回调，比如回调中会有 setState ，会触发执行 requestWork
  return fn(a, b, c);
} finally {
  isBatchingInteractiveUpdates = previousIsBatchingInteractiveUpdates;
  isBatchingUpdates = previousIsBatchingUpdates;
  if (!isBatchingUpdates && !isRendering) {
    console.log("点位 6 ------------------------------------------")
    performSyncWork();
  }
}
```

try 流程一直走下去会执行事件回调（两个 setState），但是会走到如下 requestWork 逻辑

```
if (isBatchingUpdates) {
  // Flush work at the end of the batch.
  if (isUnbatchingUpdates) {
    // ...unless we're inside unbatchedUpdates, in which case we should
    // flush it now.
    nextFlushedRoot = root;
    nextFlushedExpirationTime = Sync;
    performWorkOnRoot(root, Sync, false);
  }
  return;
}
```

由 <a href="https://github.com/HanLess/react-analysis/blob/master/react%E5%90%88%E6%88%90%E4%BA%8B%E4%BB%B6.md">合成事件</a> 走到这里的逻辑，isBatchingUpdates 为 true，但 isUnbatchingUpdates 为 false，即 setState 流程终止，那 setState 做了什么？查看 enqueueSetState 源码如下

```
const fiber = getInstance(inst);
const currentTime = requestCurrentTime();
const expirationTime = computeExpirationForFiber(currentTime, fiber);

const update = createUpdate(expirationTime);
update.payload = payload;
if (callback !== undefined && callback !== null) {
  if (__DEV__) {
    warnOnInvalidCallback(callback, 'setState');
  }
  update.callback = callback;
}
// 这三个方法与 render 中的起点 scheduleRootUpdate 一样
flushPassiveEffects();
enqueueUpdate(fiber, update);
scheduleWork(fiber, expirationTime,payload);
```

可见通过 enqueueUpdate 收集了 update，也就是说，两次 setState 的任务就是收集 update

然后走到 finally 逻辑

```
if (!isBatchingUpdates && !isRendering) {
  console.log("点位 6 ------------------------------------------")
  performSyncWork();
}
```

执行 performSyncWork 方法，沿着 react 渲染逻辑往下走，最终更新视图


#### setState 执行

<img src="https://github.com/HanLess/react-analysis/blob/master/img/setState%E6%89%A7%E8%A1%8C%E6%B5%81%E7%A8%8B.png" />

