子组件使用 @observer 装饰器后，父组件调用 forceUpdate，子组件不更新

原因是 mobx-react 重写了组件的 shouldCompodentUpdate 方法，只有当 mobx 的数据发生变化时，才允许重新渲染组件
