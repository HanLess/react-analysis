import React, {Component } from 'react'
import {unstable_scheduleCallback} from 'scheduler';
import {flushSync} from 'react-dom'

class One extends Component{
    constructor (option) {
        super(option);
        this.state = {
            name : 'one',
            age : 0,
            items : []
        };
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

    componentDidMount() {
        let arr = this.initItems(200)
        let start = Date.now()
        this.setState({
            items : arr
        },function(){
            let end = Date.now()
            console.log("init 时长 ：" + (end - start))
        })
    }

    changeItem = () => {
        let len = this.state.items.length == 200 ? 20000 : 200
        var arr = this.initItems(len);
        let start = Date.now()
        unstable_scheduleCallback(() => {
            this.setState({
                items : arr
            },function(){
                let end = Date.now()
                console.log('change 时长 ：' + (end - start))
            })
        })
    }

    changeItemAgain = () => {
        let len = this.state.items.length == 200 ? 30000 : 200
        var arr = this.initItems(len);
        let start = Date.now()
        for(let i = 0;i < len;i ++){
            let now = this.state.items;
            now[i] = arr[i];
            this.setState({
                items : now
            })
        }
    }

    changeName = () => {
        let name = this.state.name
        let start = Date.now()
        // flushSync(() => {
            this.setState({
                name : name + 'e'
            },function(){
                let end = Date.now()
            console.log('change name 时长 ：' + (end - start))
            })
        // })
    }

    render () {
        return (
            <div>
                <h1 onClick={this.changeName}>one name is {this.state.name}</h1>
                <p onClick={this.changeItem}>change item</p>
                <p onClick={this.changeItemAgain}>change item again</p>
                {
                    this.state.items.map((val,index) => {
                        return (<div><div>{val['key']}</div></div>)
                    })
                }
            </div>
        )
    }
}

export default One;