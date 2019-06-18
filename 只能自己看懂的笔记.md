通过 ReactDOM.unstable_createRoot 来构建，可以观察 react 特有的优先级架构。

在插入任务的时候，旧任务暂停，新任务（优先级高，可以使用 ReactDOM.flushSync 实现观察）插入，新任务执行完后，旧任务重新执行，直到完成

输入如下

<img src="https://github.com/HanLess/react-analysis/blob/master/img/%E7%AC%94%E8%AE%B01.png" />
