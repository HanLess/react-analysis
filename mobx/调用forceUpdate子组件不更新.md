子组件使用 @observer 装饰器后，父组件调用 forceUpdate，子组件不更新

原因是 mobx 拦截了 props ，只有当 mobx 的数据发生变化时，才允许重新渲染组件，而父组件更新，props 变化，但是 mobx 的数据没有更新，组件则不会重新渲染
