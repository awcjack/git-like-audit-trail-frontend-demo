import React from 'react';
import './app.css'
import Header from "../header/header"
import MainBody from "../body/body"

class App extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
          userId: '',
          page: "login",
      }
      this.handler = this.handler.bind(this)
  }

  handler(keys, values) {
    const currentState = this.state
    console.log("keys", keys)
    for (let i = 0; i < keys.length; i++) {
      currentState[keys[i]] = values[i]
    }
    console.log("currentState", currentState)
    this.setState(currentState)
  }

  render() {
    console.log("page", this.state.page)
    const userId = localStorage.getItem('userId');
    if (this.state.userId && !userId) {
      localStorage.setItem('userId', this.state.userId)
    } else if (!this.state.userId && userId !== "null" && userId !== null) {
      console.log("userIdtest", typeof userId)
      this.setState({userId})
    }
    console.log("userId", this.state.userId)
    return (
      <div>
        <Header handler={this.handler} userId={this.state.userId}/>
        <MainBody handler={this.handler} page={this.state.page}/>
      </div>
    )
  }
}

export default App;
