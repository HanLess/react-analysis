import React, { Component } from 'react';
import One from './component/One'
import './App.css';
import {flushSync} from 'react-dom'
// let o = React.createElement(One)
// console.log(new o.type())
class App extends Component {

  componentDidMount(){
    
  }

  constructor (options) {
    super(options)
    this.state = {
      name : "app"
    }
  }

  remind = () => {
    console.log("click by react !")
  }

  click_img = () => {
    console.log("click img ")
  }

  changeName = () => {
    let name = this.state.name
    let start = Date.now()
    flushSync(() => {
        this.setState({
            name : name + 'e'
        },function(){
            let end = Date.now()
        console.log('change name 时长 ：' + (end - start))
        })
    })
}

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 onClick={this.changeName}>app name is {this.state.name}</h1>
          <One />
        </header>
      </div>
    );
  }
}

export default App;
