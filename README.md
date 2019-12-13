# react-analysis

<a href="https://zhuanlan.zhihu.com/p/60307571">深入剖析 React Concurrent</a>

<a href="https://juejin.im/post/5c052f95e51d4523d51c8300#heading-0">「译」React Fiber 那些事: 深入解析新的协调算法</a>


#### concurrent

Concurrent 目的在于提升卡顿页面的体验，那么首先让我们结合浏览器运行原理来谈谈页面卡顿的原因，众所周知，JS 是单线程的，浏览器是多线程的，除了 JS 线程以外，还包括 UI 渲染线程、事件线程、定时器触发线程、HTTP 请求线程等等。JS 线程是可以操作 DOM 的，如果在操作 DOM 的同时 UI 线程也在进行渲染的话，就会发生不可预期的展示结果，因此 JS 线程与 UI 渲染线程是互斥的，每当 JS 线程执行时，UI 渲染线程会挂起，UI 更新会被保存在队列中，等待 JS 线程空闲后立即被执行。对于事件线程而言，当一个事件被触发时该线程会把事件添加到队列末尾，等待 JS 线程空闲后处理。因此，长时间的 JS 持续执行，就会造成 UI 渲染线程长时间地挂起，触发的事件也得不到响应，用户层面就会感知到页面卡顿甚至卡死了，Sync 模式下的问题就由此引起。

#### 浏览器内一帧的工作

<img src="https://github.com/HanLess/react-analysis/blob/master/img/%E4%B8%80%E5%B8%A7.png" />

<ul>
  <li>处理用户的交互</li>

  <li>JS 解析执行</li>

  <li>帧开始。窗口尺寸变更，页面滚去等的处理</li>

  <li>rAF(requestAnimationFrame)</li>

  <li>布局</li>

  <li>绘制</li>
</ul>  

#### ExpirationTime

ExpirationTime 代表了渲染任务的优先级，react会根据优先级来执行、插入渲染任务，这么做的优势：

当项目中存在大量长时间渲染与页面交互，react可以大幅度提高页面性能，不至于被长时间的渲染行为阻塞

#### 执行过程

react 运行过程分三步：schedule (计算优先级) --> render (更新 fiber) --> commit (更新 dom 结构)

ReactDom.render 过程中 schedule 是一个初始化的作用，初始化整个树的 expirationTime

- 更新 fiber 树：从 root 向下遍历（scheduleWorkToRoot 方法向上遍历标记，requestWork 更新 fiber 树）
- 更新 VDOM：从上到下遍历

#### ReactDOM.render 执行过程

<img src="https://github.com/HanLess/react-analysis/blob/master/img/ReactDom.render%E6%89%A7%E8%A1%8C%E6%B5%81%E7%A8%8B%EF%BC%88%E4%BB%8EscheduleRootUpdate%E5%BC%80%E5%A7%8B%EF%BC%89.png" />


