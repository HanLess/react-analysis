一、hooks 实现原理 - 初次渲染的时候调用 hooks，顺序执行，形成一个有状态的单向队列，后面每次渲染，按顺序从这个队列中取出相应的状态

二、由于函数式组件没有 this，所以异步读取 state 状态，可能会出现闭包陷阱，简单来说就是：在异步中获取的 state 是初始值，即便 state 状态更新了（无论在异步还是同步中），读取到的
state 不会变化，因为 hooks 通过对象数组实现，对象中存储 state 状态，虽然存储对象更新了，但由于闭包，异步中引用的是旧的值，所以在异步中读取此 state，看起像没有更新，而在外部已经渲染了

闭包陷阱模型简化

```
<!DOCTYPE html>
<html>
    <body>
        <div id="test">click</div>
        <div id="test1">click 1</div>
        <script>
            
            const store = {
                state: 0,
                dispatch: (num) => {
                    store.state = store.state + num
                }
            }

            function useState () {
                return [ store.state, store.dispatch ]
            }

            function component () {
                let [ count, setCount ] = useState()
                
                document.getElementById('test').onclick = function() {
                    setCount(100)
                }

                document.getElementById('test1').onclick = function() {
                    setInterval(() => {
                        console.log('---------',count)
                    }, 500)
                }


                console.log(count,store.state)
            }

            setInterval(() => {
                component()
            }, 500)

        </script>
    </body>
</html>

```
