# react-analysis

<a href="https://zhuanlan.zhihu.com/p/60307571">深入剖析 React Concurrent</a>

<a href="https://juejin.im/post/5c052f95e51d4523d51c8300#heading-0">「译」React Fiber 那些事: 深入解析新的协调算法</a>

#### ExpirationTime

ExpirationTime 代表了渲染任务的优先级，react会根据优先级来执行、插入渲染任务，这么做的优势：

当项目中存在大量长时间渲染与页面交互，react可以大幅度提高页面性能，不至于被长时间的渲染行为阻塞

#### 执行过程

react 运行过程分三步：schedule (计算优先级) --> render (更新 fiber) --> commit (更新 dom 结构)

ReactDom.render 过程中 schedule 是一个初始化的作用，初始化整个树的 expirationTime

#### ReactDOM.render 执行过程

<img src="https://github.com/HanLess/react-analysis/blob/master/img/ReactDom.render%E6%89%A7%E8%A1%8C%E6%B5%81%E7%A8%8B%EF%BC%88%E4%BB%8EscheduleRootUpdate%E5%BC%80%E5%A7%8B%EF%BC%89.png" />

#### react 事件触发，执行回调过程

<img src="https://github.com/HanLess/react-analysis/blob/master/img/react%E4%BA%8B%E4%BB%B6%E7%9A%84%E8%A7%A6%E5%8F%91.png" />
