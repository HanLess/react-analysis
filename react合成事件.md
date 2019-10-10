### React合成事件理解

如果DOM上绑定了过多的事件处理函数，整个页面响应以及内存占用可能都会受到影响。React为了避免这类DOM事件滥用，同时屏蔽底层不同浏览器之间的事件系统差异，实现了一个中间层——SyntheticEvent。

1、当用户在为onClick添加函数时，React并没有将Click事件绑定在DOM上面。

2、而是在document处监听所有支持的事件，当事件发生并冒泡至document处时，React将事件内容封装交给中间层SyntheticEvent（负责所有事件合成）

3、所以当事件触发的时候，对使用统一的分发函数dispatchEvent将指定函数执行。

作者：shengqz
链接：https://www.jianshu.com/p/8d8f9aa4b033
来源：简书

#### react 事件触发，执行回调过程

<img src="https://github.com/HanLess/react-analysis/blob/master/img/react%E4%BA%8B%E4%BB%B6%E7%9A%84%E8%A7%A6%E5%8F%91.png" />
