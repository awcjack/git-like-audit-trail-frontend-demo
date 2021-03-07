import React from 'react'
import "./header.css"

class Header extends React.Component {
    constructor(props) {
        super(props)
        this.handler = this.props.handler
    }

    logout() {
        localStorage.removeItem('userId')
        this.handler(["userId", "page"], [null, "login"])
    }

    render() {
        let login
        if (this.props.userId) {
            login = <button onClick={()=>this.logout()}>Logout</button>
        } else {
            login = <button onClick={()=>this.handler(["page"], ["login"])}>Login</button>
        }
        return (
            <div>
                <header className="header">
                    <nav className="nav">
                        <button onClick={()=>this.handler(["page"], ["query"])}>Query</button>
                        <button onClick={()=>this.handler(["page"], ["manipulate"])}>Manipulate</button>
                        <button onClick={()=>this.handler(["page"], ["audit_trail"])}>Audit trail</button>
                        {login}
                    </nav>
                </header>
            </div>
        )
    }
}

export default Header