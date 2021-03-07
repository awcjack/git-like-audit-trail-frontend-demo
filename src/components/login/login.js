import React from 'react'
import "./login.css"

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userId: ""
        }
        this.handler = this.props.handler
    }

    doLogin() {
        const userId = this.state.userId
        this.handler(["userId", "page"], [userId, "query"])
    }

    render() {
        return (
            <div className="mainContent flexBox">
                <h1 className="flexItem">Login</h1>
                <span className="flexItem">(no register/password required for demo)</span>
                <div className="flexItem">UserID: <input type="text" onChange={(event)=>this.setState({userId: event.target.value})}></input></div>
                <button onClick={()=>this.doLogin()} className="flexItem">Login</button>
            </div>
        )
    }
}

export default Login