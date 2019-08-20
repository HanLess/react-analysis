ReactDOM.unstable_createRoot 将创建 concurrentMode 的 fiber 根节点。

通过 ReactDOM.unstable_createRoot 来构建，可以观察 react 特有的优先级架构。

在插入任务的时候，旧任务暂停，新任务（优先级高，可以使用 ReactDOM.flushSync 实现观察）插入，新任务执行完后，旧任务重新执行，直到完成

输入如下

<img src="https://github.com/HanLess/react-analysis/blob/master/img/%E7%AC%94%E8%AE%B01.png" />

## Concurrent 运行机制

### 任务如何按时间片拆分、时间片间如何中断与恢复？

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
