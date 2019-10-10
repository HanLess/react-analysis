在 vue-router 中，给路由下的组件传参只能通过配置，即在创建 vueRouter 的时候，配置 prop 参数。但这种方式非常鸡肋，无法根据业务场景动态传参。
现在唯一的办法就是通过 vuex。

在 react-router 中，可以通过 <Route /> 组件的 render/children/component 参数，来实现路由下的组件传参，示例如下：

```
class App extends Component{
  render（） {
    <Route render={() => {
        return <One id={id} />
    }} />
  }
}
```

#### 其中 render/children/component 的用法区别

- component 如果是一个函数，则每次在 App 组件中执行 setState，都会导致 One 组件执行 mount 相关钩子，
通过源码可以发现（react-router中Route组件的render方法）

```
return (
  <RouterContext.Provider value={props}>
    {children && !isEmptyChildren(children)
      ? children
      : props.match
        ? component
          ? React.createElement(component, props)
          : render
            ? render(props)
            : null
        : null}
  </RouterContext.Provider>
);
```

每次都会执行一次 React.createElement，如果 component 是匿名函数，则每次都会创建一个新的组件（如果component是一个组件，react会进行记录，不会重复创建）

- render 会重复创建组件，即 One 不会重复执行 mount 相关钩子

- children 则表示无论路由是否匹配，都会渲染这个组件







