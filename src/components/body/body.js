import React from 'react'
import "./body.css"
import Login from "../login/login"
import Query from "../query/query"
import Manipulate from "../manipulate/manipulate"
import AuditTrail from "../audit-trail/auditTrail"

class MainBody extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userId: ''
        }
        this.handler = this.props.handler
    }

    render() {
        let content
        console.log("props.page in body", this.props.page)
        if (this.props.page === "login") {
            content = <Login handler={this.handler} />
        } else if (this.props.page === "query") {
            content = <Query/>
        } else if (this.props.page === "manipulate") {
            content = <Manipulate/>
        } else if (this.props.page === "audit_trail") {
            content = <AuditTrail/>
        }
        return (
            <div className="main">
                {content}
            </div>
        )
    }
}

export default MainBody