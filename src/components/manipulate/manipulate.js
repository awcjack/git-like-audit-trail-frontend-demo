import React from "react"
import axios from "axios"
import "./manipulate.css"

const backendUrl = "http://localhost:5000"

class Manipulate extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            type: "insert",
            id: null,
            data: null
        }
    }

    run() {
        const type = this.state.type
        if (type === "insert") {
            axios.get(`${backendUrl}/add/${this.state.id || 0}/${this.state.data || ""}`).then(res => this.setState({id: null, data: null, complete: true}))
        }
        if (type === "update") {
            axios.get(`${backendUrl}/update/${this.state.id || 0}/${this.state.data || ""}`).then(res => this.setState({id: null, data: null, complete: true}))
        }
        if (type === "delete") {
            axios.get(`${backendUrl}/delete/${this.state.id || 0}`).then(res => this.setState({id: null, data: null, complete: true}))
        }
    }

    render() {
        return (
            <div>
                { this.state.type !== "insert" &&
                    <button onClick={()=>this.setState({type: "insert", data: null, complete: null})}>Insert</button>
                }
                { this.state.type !== "update" &&
                    <button onClick={()=>this.setState({type: "update", data: null, complete: null})}>Update</button>
                }
                { this.state.type !== "delete" &&
                    <button onClick={()=>this.setState({type: "delete", data: null, complete: null})}>Delete</button>
                }

                <div className="flexItem">ID: <input type="text" onChange={(event)=>this.setState({id: event.target.value, complete: null})}></input></div>
                { this.state.type !== "delete" &&
                    <div className="flexItem">Data: <input type="text" onChange={(event)=>this.setState({data: event.target.value, complete: null})}></input></div>
                }
                <button onClick={()=>this.run()} className="flexItem">{this.state.type}</button>
                { this.state.complete && 
                    <span>Completed</span>
                }
            </div>
        )
    }
}

export default Manipulate