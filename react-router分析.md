#### 概述

react-router 4 与3/2完全不同，彻底贯彻 just component 思想，没有独立的 api，所有功能都基于组件实现，router的相关 api 都在 props 里

这么做的优点是规范，组件之间彻底解耦；缺点是不灵活，所有功能都基于组件，会增加重复劳动（如 vue-router 的导航守卫功能）

此外跟 vue 的区别还在于：vue-router 以插件形式使用，route对象挂载在每个 vue 组件上，
而 react-router 是完全独立的组件（react 官方没有提供插件功能），react-router 与业务组件是完全解耦的，通过 props 来传递信息（通过 Route 组件，把信息挂到业务组件上）

#### react-router 的路由管理引用了开源的 <a href="https://github.com/ReactTraining/history">history</a> 模块，所有功能都有此模块实现

#### 路由的跳转

```
class Router extends React.Component {
    ...
      
      /*
        在 construstor 中调用 listen 监听了location的变化
      */
      
      if (!props.staticContext) {
      this.unlisten = props.history.listen(location => {
        if (this._isMounted) {
          this.setState({ location });
        } else {
          this._pendingLocation = location;
        }
      });
    }
      
    ...
}
```

```
// Link 组件代码片段

return React.createElement(component, {
  ...rest,
  href,
  navigate() {
    const location = resolveToLocation(to, context.location);
    const method = replace ? history.replace : history.push;

    method(location);
}
```

Link 跳转其实就是实现了 pushState / replaceState ，从而触发 location 的变化

通过源码可以发现，当路由变化的时候，会触发 this.setState({ location })，这本质是一个 setState 改变数据 -> 触发视图变化的逻辑

#### 监听

hash 模式：history.listen 通过 hashchange 事件监听 hash 模式的路由变化

browser（vue 中称为 history）模式：只能通过 popstate 事件来监听路由的前进 / 后退。如果通过 <link> 或者 history 跳转，会阻止 a 标签的默认行为（preventDefault）,用 pushState / replaceState 来实现路由变化，触发视图变化；如果直接用 a 标签，或者 location.href 控制跳转，页面会刷新，然后根据路由信息展示相关组建


#### 总结

vue 与 react 的 router 功能，本质都是数据驱动视图变化，不过二者数据绑定的实现方式不同，所有路由的实现方式也就不同，但方向完全一致

       
<img src="https://github.com/HanLess/react-analysis/blob/master/img/route%E7%BB%93%E6%9E%84.png" />       
       
       
