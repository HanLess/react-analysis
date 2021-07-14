#### 数据更新原理

react-redux的核心机制是通知订阅模式，核心 Subscription 类，它的作用主要是 订阅父级 的更新和 通知子 级的更新，起到一个承上启下的作用，具体如下：

```
<Provider store={store}>          // 祖 Subscription
  <Component1> // 它订阅的Provider    // 父 Subscription
  	<Component2/> // 它订阅的Component1   // 子 Subscription
  <Component1/>
</Provider>
// 当store有更新，Provider 通知 Component1，Component1 通知 Component2
```

通知到订阅相关属性的组件后，forceUpdate


<img src="https://github.com/HanLess/react-analysis/blob/master/img/redux%26react-redux.png" />

## reducer

要求 reducer 是一个纯函数，不能修改原来的 state，只能返回一个新的 state，所以在设计 state 结构的时候，一定要扁平化，切忌多层结构

否则更新一个叶子节点时，就要更新最外层的父节点。

dispatch 核心逻辑

```
currentState = currentReducer(currentState, action)
```

currentReducer 就是 createStore 传入的 reducer，currentState 就是 state

## redux

#### combineReducers

将各个reducer模块整合，最后输出，用于 createStore(reducers)

核心逻辑：

```
for (let i = 0; i < finalReducerKeys.length; i++) {
  const key = finalReducerKeys[i]
  const reducer = finalReducers[key]
  const previousStateForKey = state[key]
  const nextStateForKey = reducer(previousStateForKey, action)
  ...
  nextState[key] = nextStateForKey
}
```

本质与普通的 reducer一样，但是在每次 dispatch 的时候，会遍历一遍 reducerKeys，然后更新对应的 reducerKeys 的 state，简单粗暴。

#### applyMiddleware

用于添加中间件，比如使用异步 action 时，log 时

#### bindActionCreators

与 dispatch 作用一样，但有一个便利：在调用更新方法时，传参稍微方便一点，看起来比较整洁，算是语法糖吧

## redux 与 vuex 的区别

#### redux

脱胎于 flux，与 flux 思想完全一致，加了一些 api。

redux 核心内容是 dispatch，可以认为是 dispatch 定义了 state

```
从源码中可以发现，createStore 中调用了 dispatch 来初始化 state

state 存在 createStore 中（闭包），不对外暴露
```

redux 中没有显示地定义 state，个人认为不好，可能会导致数据结构不清晰，全靠自觉

#### vuex

vuex 中会维护一个全局 store 对象，对象中存了所有内容，包括 state，mutation，action 等；修改也是直接修改 state 属性

vuex （非严格模式下）并不是严格的数据单向流动，直接更改 state 也是可以生效的，且可以正常使用，所谓的单向数据流动全靠自觉


