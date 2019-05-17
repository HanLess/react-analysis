import React, {Component } from 'react'
import {unstable_scheduleCallback, flushSync} from 'scheduler';

class One extends Component{
    constructor (option) {
        super(option);
        this.state = {
            name : 'one',
            age : 0
        };
    }

    changeName = () => {
        // unstable_scheduleCallback(() => {
        //     let age = this.state.age + 1
        //     this.setState({
        //         age : age
        //     })
        // })

        // let now = this.state.name + 'e'
        // this.setState({
        //     name : now
        // })

        // let age = this.state.age + 1
        // this.setState({
        //     age : age
        // })
        let len = 10000000
        let start = Date.now();
        for (let i = 0; i < len; i++) {
            let name = i;
            this.setState({
                name : name
            })
        }
        let end = Date.now();
        console.log("执行时间 = " + (end - start))
    }

    changeAge = () => {
        let age = this.state.age + 1;
        flushSync(() => {
            this.setState({
                age : age
            })
        })
    }

    render () {
        return (
            <div>
                <h1>the name is {this.state.name}</h1>
                <h1 onClick={this.changeAge}>age is {this.state.age}</h1>
                <p onClick={this.changeName}>change name</p>
            </div>
        )
    }
}

export default One;