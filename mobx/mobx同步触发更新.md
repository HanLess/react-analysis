初次使用 mobx 与 mobx-react，在异步回调中多次更改了 mobx 监听对象的值，导致 react 多次渲染

#### 推测如下

(1) mobx 监听的原理是 proxy，当属性改变，触发 setter 监听器

(2) 在监听器中主动触发 react 中的 forceUpdate，实现组件重新渲染

(3) 有两种情况 react 不走合成事件流：异步、原生事件

(4) 中招，在异步中多次 setState，导致组件多次渲染

(5) mobx 应该学习一下 vue，实现一个异步更新的逻辑，先收集更新，后集中触发一次 setState，即可解决问题

注：以上为推测，待阅读源码后完善
