插入优先级更高的任务是 react 的一个特点，以下是执行流程，因为源码过于复杂，所以通过 阅读源码 + 观察打点输出 的方式得到以下内容

```
第一次 setState（被打断）更新内容：Array(20000)；初始状态：Array(200)

第二次 setState（flushSync，高优先级）更新内容：onee；初始状态：Array（one）
```

<img src="https://github.com/HanLess/react-analysis/blob/master/img/%E4%BB%BB%E5%8A%A1%E8%A2%AB%E6%89%93%E6%96%AD%E6%97%B6effect%E7%9A%84%E5%8F%98%E5%8C%96%E7%8E%B0%E8%B1%A1.png" />

#### 结论

插入 任务二 后，任务一 的更新内容被存在 lastEffect 中（Array(20000) ）;当插入任务的 renderRoot 阶段完成（fiber 更新完成），
工作树（workInProgress）的 firstEffect 保存了已完成的 任务二 的更新内容（onee），且 nextEffect 指向 lastEffect ；
lastEffect 分别保存了 任务一 的更新内容（ Array(20000) ）和初始状态（ Array(200) ）

#### 修改 effect 的方法是 completeUnitOfWork

#### 综述

全局任务树通过 lastEffect 来保存被打断的任务，通过 nextEffect 链接各个节点的执行任务

#### 代码

```
changeName = () => {
    let name = this.state.name
    let start = Date.now()
    ReactDOM.flushSync(() => {
        this.setState({
            name : name + 'e'
        },function(){
            let end = Date.now()
        console.log('change name 时长 ：' + (end - start))
        })
    })
}

initItems = (num) => {
    let len = num
    let arr = []
    for (let i = 0; i < len; i ++) {
        let obj = {}
        obj['key'] = parseInt(Math.random() * len)
        arr.push(obj)
    }
    return arr
}

changeItem = () => {
    let len = this.state.items.length == 200 ? 20000 : 200
    var arr = this.initItems(len);
    let start = Date.now()
    this.setState({
        items : arr
    },function(){
        let end = Date.now()
        console.log('change 时长 ：' + (end - start))
    })
    setTimeout(() => {
      this.changeName()
    }, 200);
}



var root = ReactDOM.unstable_createRoot(document.getElementById('root'));
root.render(<App />)
```
