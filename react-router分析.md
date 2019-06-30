react-router 4 与3/2完全不同，彻底贯彻 just component 思想，没有独立的 api，所有功能都基于组件实现，router的相关 api 都在 props 里

这么做的优点是规范，组件之间彻底解耦；缺点是不灵活，所有功能都基于组件，会增加重复劳动（如 vue-router 的导航守卫功能）

此外跟 vue 的区别还在于：vue-router 以插件形式使用，route对象挂载在每个 vue 组件上，
而 react-router 是完全独立的组件（react 官方没有提供插件功能），react-router 与业务组件是完全解耦的，通过 props 来传递信息（通过 Route 组件，把信息挂到业务组件上）
