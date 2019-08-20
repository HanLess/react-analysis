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

### 时间片间如何中断与恢复(跳过低优先级，高优先级执行后重新执行低优先级)

Fiber 节点在变更后会形成 update 对象，带有 expirationTime，插入 updateQueue 中，updateQueue 中所有 update 对象均按照变更（插入）顺序排列，若高优先级 update 与低优先级 update 同处一个队列，对于低优先级的 update 会采用 <strong>跳过</strong> 方式处理，来保证 Sync 模式与 Concurrent 模式下，最终变更结果是一致的，如下图所示：

<img src="https://github.com/HanLess/react-analysis/blob/master/img/%E7%AC%94%E8%AE%B01.png" />

当我们优先完成高优先级任务后，还能继续低优先级任务么？不行，高优先级任务的变更可能对低优先级任务产生影响，低优先级任务必须重新来过，之前收集的 effectList 会被重置为 null，updateQueue 会从 current tree 中恢复回来。之前社区曾广泛 讨论，未来 React 中 componentWillMount 可能被调用多次，原因就在这里，低优先级任务的 render 阶段可能被重复执行，而 componentWillMount 包含在 render 阶段中。

#### 注意低优先级的生命周期的重复执行 ！！！
