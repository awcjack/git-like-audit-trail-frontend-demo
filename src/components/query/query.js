import axios from "axios"
import React from "react"
import "./query.css"

const backendUrl = "http://localhost:5000"

class Query extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            type: "table",
            data: null
        }
    }

    render() {
        if (this.state.data === null) {
            if (this.state.type === "table") {
                axios.get(`${backendUrl}/query`).then(res => this.setState({data: JSON.stringify(res.data)}))
            }
            if (this.state.type === "commitMap") {
                axios.get(`${backendUrl}/query/commitMap`).then(res => this.setState({data: JSON.stringify(res.data)}))
            }
            if (this.state.type === "currentCommit") {
                axios.get(`${backendUrl}/query/currentCommit`).then(res => this.setState({data: JSON.stringify(res.data)}))
            }
        }
        const tableContent = []
        const datas = JSON.parse(this.state.data) || []
        for (const data of datas) {
            const keys = Object.keys(data)
            keys.sort()
            const _datas = []
            for (const key of keys) {
                _datas.push(<td key={key}>{key}:{data[key]}</td>)
            }
            tableContent.push(<tr>{_datas}</tr>)
        }
        console.log("tableContent", tableContent)

        return (
            <div style={{display: "grid", overflow: "scroll"}}>
                { this.state.type !== "table" &&
                    <button onClick={()=>this.setState({type: "table", data: null})}>test table</button>
                }
                { this.state.type !== "commitMap" &&
                    <button onClick={()=>this.setState({type: "commitMap", data: null})}>commitMap</button>
                }
                { this.state.type !== "currentCommit" &&
                    <button onClick={()=>this.setState({type: "currentCommit", data: null})}>currentCommit</button>
                }
                <table>
                    <tbody>
                        {tableContent}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Query