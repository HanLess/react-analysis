ReactDOM.unstable_createRoot 将创建 concurrentMode 的 fiber 根节点。

通过 ReactDOM.unstable_createRoot 来构建，可以观察 react 特有的优先级架构。

在插入任务的时候，旧任务暂停，新任务（优先级高，可以使用 ReactDOM.flushSync 实现观察）插入，新任务执行完后，旧任务重新执行，直到完成

输入如下

<img src="https://github.com/HanLess/react-analysis/blob/master/img/%E7%AC%94%E8%AE%B01.png" />

## Concurrent 运行机制

<a href="https://zhuanlan.zhihu.com/p/60307571">Concurrent 运行机制</a>

### 任务如何按时间片拆分

Fiber 树的更新流程分为 render 阶段与 commit 阶段，render 阶段的纯粹意味着可以被拆分，在 Sync 模式下，render 阶段一次性执行完成，而在 Concurrent 模式下，render 阶段可以被拆解，每个时间片内分别运行一部分，直至完成，commit 模式由于带有 DOM 更新，不可能 DOM 变更到一半中断，因此必须一次性执行完成。

```
while (当前还有空闲时间 && 下一个节点不为空) {
  下一个节点 = 子节点 = beginWork(当前节点);
  if (子节点为空) {
    下一个节点 = 兄弟节点 = completeUnitOfWork(当前节点);
  }
  当前节点 = 下一个节点;
}
```

源码

```
function workLoop(isYieldy) {
  if (!isYieldy) {
    // Flush work without yielding
    while (nextUnitOfWork !== null) {
      /**
       * 这里执行深度优先遍历，从 #root 向下循环，直到每一个元素都被遍历到
       * 
       */
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
  } else {
    // Flush asynchronous work until there's a higher priority event
    /**
     * 在 concurrent 模式下，一个任务在这里被分片，fiber 树会按片遍历，每次遍历一部分
     * 
     * 判断继续执行本任务的条件：当前还有空闲时间 && 下一个节点不为空
     * 
     * shouldYield() 为 true 的时候，一个分片任务结束
     * 
     * shouldYield()的关键点是：这个分片任务的截止执行时间
     */
    while (nextUnitOfWork !== null && !shouldYield()) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
  }
}
```

react 的任务在 workLoop 中被分片，分片的依据就是 shouldYield()，而 shouldYield 中主要的判断条件是 frameDeadline，可以把 frameDeadline 理解为一个分片任务的截止时间，通过计算得到

#### 所以总结如下

当一个分片任务的截止时间到了，此分片任务结束，执行下一个分片任务（执行周期是 requestAnimationFrame），所有分片任务执行结束，render 阶段完成


### 时间片间如何中断与恢复(跳过低优先级，高优先级执行后重新执行低优先级)

Fiber 节点在变更后会形成 update 对象，带有 expirationTime，插入 updateQueue 中，updateQueue 中所有 update 对象均按照变更（插入）顺序排列，若高优先级 update 与低优先级 update 同处一个队列，对于低优先级的 update 会采用 <strong>跳过</strong> 方式处理，来保证 Sync 模式与 Concurrent 模式下，最终变更结果是一致的，如下图所示：

<img src="https://github.com/HanLess/react-analysis/blob/master/img/%E8%B7%B3%E8%BF%87%E4%BD%8E%E4%BC%98%E5%85%88%E7%BA%A7%E4%BB%BB%E5%8A%A1.jpg" />

当我们优先完成高优先级任务后，还能继续低优先级任务么？不行，高优先级任务的变更可能对低优先级任务产生影响，低优先级任务必须重新来过，之前收集的 effectList 会被重置为 null，updateQueue 会从 current tree 中恢复回来。之前社区曾广泛 讨论，未来 React 中 componentWillMount 可能被调用多次，原因就在这里，低优先级任务的 render 阶段可能被重复执行，而 componentWillMount 包含在 render 阶段中。

#### 注意低优先级的生命周期的重复执行 ！！！

#### 低优先级任务被打断，存在哪里？

<a href="https://github.com/HanLess/react-analysis/blob/master/%E5%BC%82%E6%AD%A5%E4%BB%BB%E5%8A%A1%E7%9A%84%E6%89%93%E6%96%AD%EF%BC%88effect%E7%9A%84%E5%8F%98%E5%8C%96%EF%BC%89.md">异步任务的打断（effect的变化）</a>





