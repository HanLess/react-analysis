import React, { Component } from 'react';
import One from './component/One'
import './App.css';
// let o = React.createElement(One)
// console.log(new o.type())
class App extends Component {

  componentDidMount(){
    
  }

  remind = () => {
    console.log("click by react !")
  }

  click_img = () => {
    console.log("click img ")
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div onClick={this.remind} id="test">click here</div>
          <One />
        </header>
      </div>
    );
  }
}

export default App;
