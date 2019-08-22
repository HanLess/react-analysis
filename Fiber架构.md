## 前言

引入 fiber 架构的目的是实现合作式调度（Cooperative Scheduling）

#### 把渲染更新过程拆分成多个子任务，每次只做一小部分，做完看是否还有剩余时间，如果有继续下一个任务；如果没有，挂起当前任务，将时间控制权交给主线程，等主线程不忙的时候在继续执行

合作式调度会遇到几个问题：

- 如何拆分成子任务？

- 一个子任务多大合适？

- 怎么判断是否还有剩余时间？

- 有剩余时间怎么去调度应该执行哪一个任务？

- 没有剩余时间之前的任务怎么办？

#### fiber 架构解决了上面的几个问题

## Fiber 是什么

要解决上面的几个问题，需要把任务分成单元，fiber 就代表 <strong>一个工作单元</strong>

但仅仅分成单元也无法实现任务的中断，因为一个函数都是一个栈帧，不执行到栈帧为空，函数运行不会停止，所以我们需要自己实现一个栈帧，Fiber 也可以理解为一个我们自己创建的 <strong>虚拟栈帧</strong>

所以 Fiber 是一种数据结构(栈帧)，也可以说是一种解决可中断的调用任务的一种解决方案，它的特性就是时间分片(time slicing)和暂停(supense)。


## Fiber 如何工作

根据流程图 <a href="https://github.com/HanLess/react-analysis/blob/master/img/ReactDom.render%E6%89%A7%E8%A1%8C%E6%B5%81%E7%A8%8B%EF%BC%88%E4%BB%8EscheduleRootUpdate%E5%BC%80%E5%A7%8B%EF%BC%89.png">react 渲染流程图</a> 可以总结如下流程：

- ReactDOM.render() 和 setState 的时候开始创建更新。

- 将创建的更新加入任务队列，等待调度。

- 使用 requestAnimationFrame 配合 frameDeadLine 实现任务分片。

- 从根节点开始遍历 Fiber Node，并且构建 WokeInProgress Tree。

- 生成 effectList。

- 根据 EffectList 更新 DOM。

总结流程如下：

- 第一部分从 ReactDOM.render() 方法开始，到 enqueueUpdate 为止，把接收的 React Element 转换为 Fiber 节点，并为其设置优先级，创建 Update，加入到更新队列，这部分主要是做一些初始数据的准备。我把这个阶段称为 schedule 阶段。

- 第二部分从 scheduleWork 开始，到 renderRoot 截止，这里把整个 fiber 树创建完成（在 workLoop 中实现任务分片），并构造 WorkInProgress Tree 得出 Change。创建 WorkInProgress Tree 的过程也是一个 Diff 的过程，Diff 完成之后会生成一个 Effect List，这个 Effect List 就是最终 Commit 阶段用来处理副作用的阶段。我把这个阶段称为 render 阶段。

- 第三部分从 completeRoot 开始，到最后 dom 更新。称为 commit 阶段。


## diff 阶段

 diff 算法是从 reconcileChildren 开始的，react 16 后的 diff 算法与之前不同，太复杂不想看
 
 






