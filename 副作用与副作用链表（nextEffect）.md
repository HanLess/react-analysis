来源：<a href="https://juejin.im/post/5c052f95e51d4523d51c8300#heading-4">「译」React Fiber 那些事: 深入解析新的协调算法</a>

### 关于 react 中副作用的定义可以参考官网 effect hook 部分

### 副作用链表

#### 目的

```
React 处理更新的素对非常迅速，为了达到这种水平的性能，它采用了一些有趣的技术。

其中之一是构建具有副作用的 Fiber 节点的线性列表，从而能够快速遍历。

遍历线性列表比树快得多，并且没有必要在没有副作用的节点上花费时间。
```

#### 作用

```
此列表的目标是标记具有 DOM 更新或其他相关副作用的节点。

此列表是 finishedWork 树的子集，

并使用 nextEffect 属性而不是 current 和 workInProgress 树中使用的 child 属性进行链接。
```

#### 实现细节

```
Dan Abramov 为副作用列表提供了一个类比。

他喜欢将它想象成一棵圣诞树，「圣诞灯」将所有有效节点捆绑在一起。

为了使这个可视化，让我们想象如下的 Fiber 节点树，其中标亮的节点有一些要做的工作。

例如:

我们的更新导致 c2 被插入到 DOM 中，d2 和 c1 被用于更改属性，

而 b2 被用于触发生命周期方法。副作用列表会将它们链接在一起，以便 React 稍后可以跳过其他节点
```

<img src="https://github.com/HanLess/react-analysis/blob/master/img/1677442376f89dbb.jpg" />

```
可以看到具有副作用的节点是如何链接在一起的。

当遍历节点时，React 使用 firstEffect 指针来确定列表的开始位置。

所以上面的图表可以表示为这样的线性列表：
```

<img src="https://github.com/HanLess/react-analysis/blob/master/img/1677442376f5ec51.jpg" />

```
如您所见，React 按照从子到父的顺序应用副作用。
```

ps : 这里 a1 节点也参与了 effect ，是因为所有的更新都从 root 节点开始，但实际 firstEffect 是 d2

