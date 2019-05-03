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

## commit 







#### 相关生命周期
<ul>
  <li>getSnapshotBeforeUpdate</li>
    <li>componentDidMount</li>
  <li>componentDidUpdate</li>
    <li>componentWillUnmount</li>
</ul>

