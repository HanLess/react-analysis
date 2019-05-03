React 在两个主要阶段执行工作：render 和 commit。

## render

#### 作用

React 通过 setUpdate 或 React.render 计划性的更新组件，并确定需要在 UI 中更新的内容。

#### 工作内容

如果是初始渲染，React 会为 render 方法返回的每个元素创建一个新的 Fiber 节点

在后续更新中，现有 React 元素的 Fiber 节点将被重复使用和更新。

<strong>这一阶段是为了得到标记了副作用的 Fiber 节点树</strong>

副作用描述了在下一个commit阶段需要完成的工作。

```
我们需要重点理解的是，第一个 render 阶段的工作是可以异步执行的。

React 可以根据可用时间片来处理一个或多个 Fiber 节点，然后停下来暂存已完成的工作，

并转而去处理某些事件，接着它再从它停止的地方继续执行。

但有时候，它可能需要丢弃完成的工作并再次从顶部开始。

由于在此阶段执行的工作不会导致任何用户可见的更改（如 DOM 更新），因此暂停行为才有了意义。

```

```
与之相反的是，后续 commit 阶段始终是同步的。

这是因为在此阶段执行的工作会导致用户可见的变化，例如 DOM 更新。这就是为什么 React 需要在一次单一过程中完成这些更新。

```

#### 相关生命周期

<ul>
  <li>[UNSAFE_]componentWillMount（弃用）</li>
  <li>[UNSAFE_]componentWillReceiveProps（弃用）</li>
    <li>getDerivedStateFromProps</li>
    <li>shouldComponentUpdate</li>
    <li>[UNSAFE_]componentWillUpdate（弃用）</li>
    <li>render</li>
</ul>

#### 阶段

```
协调算法始终使用 renderRoot 函数从最顶层的 HostRoot 节点开始。

不过，React 会略过已经处理过的 Fiber 节点，直到找到未完成工作的节点。

例如，如果在组件树中的深层组件中调用 setState 方法，则 React 将从顶部开始，

但会快速跳过各个父项，直到它到达调用了 setState 方法的组件。

```

#### 主要工作步骤

workLoop

```
nextUnitOfWork 持有 workInProgress 树中的 Fiber 节点的引用

处理过当前 Fiber 后，变量将持有树中下一个 Fiber 节点的引用或 null。

在这种情况下，React 退出工作循环并准备好提交更改。
```

遍历树、初始化或完成工作主要用到 4 个函数：

<ul>
  <li>performUnitOfWork</li>
    <li>beginWork</li>
    <li>completeUnitOfWork</li>
    <li>completeWork</li>
</ul>

<img src="https://github.com/HanLess/react-analysis/blob/master/img/1677442376e53cda.gif" />

ps : 垂直方向的连线表示同层关系，而折线连接表示父子关系，例如，b1 没有子节点，而 b2 有一个子节点 c1。

工作过程：

```
如果有下一个子节点，它将被赋值给 workLoop 函数中的变量 nextUnitOfWork。

但是，如果没有子节点，React 知道它到达了分支的末尾，因此它可以完成当前节点。

一旦节点完成，它将需要为同层的其他节点执行工作，并在完成后回溯到父节点。
```

## commit 

```
在这个阶段，React 更新 DOM 并调用变更生命周期之前及之后方法的地方。

它有 2 棵树和副作用列表：

第一个树表示当前在屏幕上渲染的状态，称为 finishedWork 或 workInProgress，表示需要映射到屏幕上的状态

第二棵树 -> 备用树会用类似的方法通过 child 和 sibling 指针链接到 current 树。

有一个副作用列表 -- 它是 finishedWork 树的节点子集，通过 nextEffect 指针进行链接；它是 render 阶段的结果，作用是 
确定需要插入、更新或删除的节点，以及哪些组件需要调用其生命周期方法
```

#### 主要函数 commitRoot 

<ul>
  <li>在标记为 Snapshot 副作用的节点上调用 getSnapshotBeforeUpdate 生命周期</li>
    <li>在标记为 Deletion 副作用的节点上调用 componentWillUnmount 生命周期</li>
    <li>执行所有 DOM 插入、更新、删除操作</li>
    <li>将 finishedWork 树设置为 current</li>
    <li>在标记为 Placement 副作用的节点上调用 componentDidMount 生命周期</li>
  <li>在标记为 Update 副作用的节点上调用 componentDidUpdate 生命周期</li>
</ul>



#### 相关生命周期
<ul>
  <li>getSnapshotBeforeUpdate</li>
    <li>componentDidMount</li>
  <li>componentDidUpdate</li>
    <li>componentWillUnmount</li>
</ul>

