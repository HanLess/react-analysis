<a href="https://zhuanlan.zhihu.com/p/60307571">深入剖析 React Concurrent</a>

#### React 内部是这样划分的：

<ul>
  <li>Sync 具有最高优先级</li>
  <li>异步方面，优先级分为 InteractiveExpiration 与 AsyncExpiration，同等时刻触发的 InteractiveExpiration 的优先级大于 AsyncExpiration</li>
  <li>InteractiveExpiration 一般指在 InteractiveEvent 中触发的更新，例如：blur, click, focus，keyDown, mouseDown 等等</li>
</ul>

React 对外暴露了 unstable_scheduleCallback 与 flushSync 两个 API，通过它们包裹的 setState 将具有不同的优先级，给开发者手动控制的能力。

```
import {unstable_scheduleCallback} from 'scheduler';

unstable_scheduleCallback(() => {
  // 异步低优先级任务，AsyncExpiration
  this.setState();
});
flushSync(() => {
  // 同步任务，最高优先级
  this.setState();
});
onClick={() => {
  // 异步高优先级任务，InteractiveExpiration
  this.setState();
}}
```
