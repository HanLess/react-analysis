<img src="https://github.com/HanLess/react-analysis/blob/master/img/redux%26react-redux.png" />

### redux

#### combineReducers

将各个reducer模块整合，最后输出，用于 createStore(reducers)

#### applyMiddleware

用于添加中间件，比如使用异步 action 时，log 时

#### bindActionCreators

与 dispatch 作用一样，但有一个便利：在调用更新方法时，传参稍微方便一点，看起来比较整洁，算是语法糖吧

