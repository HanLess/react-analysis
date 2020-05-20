#### 更新 state 中的数组性能测试

#### push

- 有 key ， 无 key 性能相同

- 100 条以下：10ms 内完成
- 1000 条：50ms
- 10000 条：500ms
- 20000 条：2000 ms

结论：当向数组中 push 数据时，props.key 无法优化

#### splice，生成随机数组，随机 key 值，随机插入

- 插入 20000 条：有 key 700ms ~ 800ms；无 key：超过 2000ms 

结论：插入数据时，优化效果明显

#### 但在工程中没有人会用大数组存数据，每次更新量不会超过 100 ，此时 key 的优化效果就可以忽略了

## 原因分析

<a href="https://juejin.im/post/5d455914518825262a6bc079#heading-3">详解 Diff 算法以及循环要加 key 值问题</a>

react & vue 进行 diff 的三个方法，通过这三个方法的循环执行，完成整个 diff 的过程

- tree diff：同层对比

- component diff：同组件对比，不同组件则为 dirty component，整个节点删掉重新构建；相同组件则递归这个节点

- element diff：同层列表对比

注意：当有三个相同类型的组件，不是通过循环的方式引用进来（正常不会有人这么做，这里只是特殊讨论一下），在 diff 时走的是 component diff，依次对比三个组件，只有循环出来的三个组件，才会走 element diff，判断是否需要节点复用

#### 就地复用，没有唯一 key 的时候，产生的 bug

react 和 vue 都有 “就地复用” 的概念，且只有在循环列表时才会出现，体现如下：

在循环列表时，即使顺序打乱，也不会重新创建组件列表（列表中的每个节点都是相同类型的，也从另一方变迎合了 component diff，但与 component diff 有很大不同），而是使用老的节点，且老节点的 state/data 被沿用

即使传入子组件的 prop 发生变化，子组件触发了 update 生命周期，state/data 仍然不发生变化！！！！

这就产生了这个经典的系列 bug

#### 删除中间的子组件

```
<template>
  <div id="app">
    <h1 @click="dele()">delete</h1>
    <h1 @click="change()">change</h1>
    <Kid v-for="item in list" />
  </div>
</template>
<script>
  import Kid from './components/Kid.vue'

  export default {
    components : {
      Kid
    },
    data() {
      return {
          list: [1,2,3]
      }
    },
    updated() {
      console.log('update run !')
    },
    methods: {
      change(){
        this.list = [10,2,3]
      },
      dele(){
        this.list.splice(1,1)
      }
    }
  }
</script>
```

删掉第二项，反而第三项消失了。原因如下：

删掉节点二，对于 vue/react 来说，其实是删掉了最后一个节点（节点三），因为 vue 不知道节点的顺序，只知道节点少了一个，当遍历到第二个节点时，发现：

节点类型相同，且没有发生更新（props 没有更新，data 也没有更新），则就地复用之前的第二个节点，则 data 没有变化，还展示了第二个节点内容。实际就删除节点三

#### 插入一个新的子组件  &  改变子组件的顺序（修改传入的 props）

```
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import One from './components/One'


class Kid extends Component<any,any> {

  constructor(props:any){
    super(props)

    this.state = {
      value: this.props.val
    }
  }
  changeValue = (e:any) => {
    this.setState({
      value: e.target.value
    })
  }

  componentDidUpdate(){
    console.log('kid update' ,this.props.val, this.state.value)
  }

  render(){
    return (
      <div>
          {this.props.val}
          <input type="text" value={this.state.value} onChange={(e) => {this.changeValue(e)}} />
          {this.state.value}
      </div>
      
    )
  }
  
}


class App extends Component<any,any> {

  constructor(props:any){
    super(props)
    this.state = {
      list: [1,2,3]
    }
  }

  delete = () => {
    let list = this.state.list
    list.splice(1,1)
    this.setState({
      list
    })
  }

  exchange = () => {
    let list = this.state.list;
    let first = list[0]
    let third = list[2]
    list[0] = third
    list[2] = first
    this.setState({
      list
    })
  }

  insert = () => {
    let list = this.state.list
    list.splice(1,0,4)

    this.setState({
      list
    })
  }

  componentDidUpdate(){
    console.log('update')
  }

  render(){
    return (
      <>
        <div onClick={this.delete}>delete</div>
        <div onClick={this.exchange}>exchange</div>
        <div onClick={this.insert}>insert</div>
        {
          this.state.list.map((val:any,index:number) => {
            return (
              <Kid val={val} />
            )
          })
        }
      </>
    )
  }
}

export default App;

```

现象：在中间插入新的组件，会发现新的组件是被 push 进去的，排在最后面，而交换组件顺序（修改传入的 props）会发现子组件根本没有变化（当然传入的 prop 有变化，但 state/data 这些组件状态没有变）

#### 有 key 无 key 对性能的影响

push 的时候，前面的节点就地复用，所以有无 key 对性能影响不大

插入的时候





