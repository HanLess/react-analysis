# react-analysis

ExpirationTime 代表了渲染任务的优先级，react会根据优先级来执行、插入渲染任务，这么做的优势：

当项目中存在大量长时间渲染与页面交互，react可以大幅度提高页面性能，不至于被长时间的渲染行为阻塞
