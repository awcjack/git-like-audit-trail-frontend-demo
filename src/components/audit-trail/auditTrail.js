import React from "react"
import axios from "axios"
import _ from "lodash"
import "./auditTrail.css"
import Tree from 'react-tree-graph';

const backendUrl = "http://localhost:5000"
let lastLevelArray = []
let rootLevelArray = []

class AuditTrail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null
        }
    }

    depth(obj) {
        var level = 1
        if (typeof obj === "object" && obj.length) {
            //array
            for (let i = 0; i < obj.length; i++) {
                const depth = this.depth(obj[i]) + 1
                level = Math.max(depth, level)
            }
        } else if (typeof obj === "object") {
            //object
            const keys = Object.keys(obj)
            for (let i = 0; i < keys.length; i++) {
                if (keys[i] === "info" || keys[i] === "nodeProps") {
                    continue
                }
                const depth = this.depth(obj[keys[i]]) + 1
                level = Math.max(depth, level)
            }
        }
        return level
    }

    reload() {
        this.setState({ data: null })
    }

    path(c, name, v, currentPath = "") {
        for(var i in c){
          if(i === name && c[i] === v){
            break
          } else if(typeof c[i] == "object"){
            return this.path(c[i], name, v, (currentPath !== "" ? currentPath + "." + i : i))
          }
        }
    
        return currentPath
    }

    async loadMoreBefore() {
        const data = this.state.data
        rootLevelArray = _.uniqBy(rootLevelArray, (o) => o.commitHash)
        console.log("rootLevelArray", rootLevelArray)
        // all root must be same level -> only use one to query & match the last level node in result
        const result = await axios({
            method: "post",
            url: `${backendUrl}/d3/loadMore`,
            data: {
                commitHash: rootLevelArray[0].commitHash,
                color: rootLevelArray[0].color.substring(1),
                before: 10
            }
        })
        for (let i = 0; i < rootLevelArray.length; i++) {
            const path = this.path(result, "name", rootLevelArray[i].commitHash)
            _.set(result, path, data[i])
        }
        console.log("result", result.data)
        rootLevelArray = []
        this.setState({data: result.data})
    }

    async loadMore() {
        const data = this.state.data
        lastLevelArray = _.uniqBy(lastLevelArray, (o) => o.commitHash)
        console.log("lastLevelArray", lastLevelArray)
        for (const lastLevel of lastLevelArray) {
            const result = await axios({
                method: "post",
                url: `${backendUrl}/d3/loadMore`,
                data: {
                    commitHash: lastLevel.commitHash,
                    color: lastLevel.color.substring(1),
                    after: 10
                }
            })
            if (result.data.length !== 0) {
                const path = this.path(data, "name", lastLevel.commitHash)
                console.log("path", path)
                result.data[0].nodeProps = _.get(data, `${path}.nodeProps`)
                console.log("result.data[0].nodeProps", result.data[0].nodeProps)
                if (path) {
                    _.set(data, path, result.data[0])
                }
            }
        }
        lastLevelArray = []
        console.log("data", data)
        this.setState({data})
    }

    getChildren(node) {
        if (node.lastLevel) {
            lastLevelArray.push({
                commitHash: node.name,
                color: node.nodeProps.style.r !== 10 ? node.nodeProps.style.stroke : node.nodeProps.style.fill
            })
        }
        return node.children
    }

    async revert() {
        const nodeKey = this.state.selected
        const revert = window.confirm(`Do you want to revert this commit ${nodeKey}?`)
        if (revert) {
            const result = await axios.get(`${backendUrl}/revert/${nodeKey}`)
            if (result.statusText === "OK") {
                axios.get(`${backendUrl}/query/d3`).then(res => this.setState({ data: res.data }))
            }
        }
        let element = document.getElementById(`${this.state.selected}`)
        if (element) {
            element.style.stroke = element.style.color
            element.style.strokeWidth = "1.5px"
            delete element.style.color
        }
        this.setState({selected: null})
    }

    async checkout() {
        const nodeKey = this.state.selected
        const revert = window.confirm(`Do you want to checkout to this commit ${nodeKey}?`)
        if (revert) {
            const result = await axios.get(`${backendUrl}/checkout/${nodeKey}`)
            console.log("resu;t", result.data)
            if (result.statusText === "OK") {
                axios.get(`${backendUrl}/query/d3`).then(res => this.setState({ data: res.data }))
            }
        }
        let element = document.getElementById(`${this.state.selected}`)
        if (element) {
            element.style.stroke = element.style.color
            element.style.strokeWidth = "1.5px"
            delete element.style.color
        }
        this.setState({selected: null})
    }

    async cherryPick() {
        const nodeKey = this.state.selected
        const revert = window.confirm(`Do you want to cherryPick this commit ${nodeKey}?`)
        if (revert) {
            const result = await axios.get(`${backendUrl}/cherrypick/${nodeKey}`)
            if (result.statusText === "OK") {
                axios.get(`${backendUrl}/query/d3`).then(res => this.setState({ data: res.data }))
            }
        }
        let element = document.getElementById(`${this.state.selected}`)
        if (element) {
            element.style.stroke = element.style.color
            element.style.strokeWidth = "1.5px"
            delete element.style.color
        }
        this.setState({selected: null})
    }

    render() {
        if (this.state.data === null) {
            lastLevelArray = []
            rootLevelArray = []
            axios.get(`${backendUrl}/query/d3`).then(res => this.setState({ data: res.data }))
        }
        const datas = []
        async function onClick(event, nodeKey) {
            let element = document.getElementById(`${this.state.selected}`)
            if (element) {
                element.style.stroke = element.style.color
                element.style.strokeWidth = "1.5px"
                delete element.style.color
            }
            event.target.style.color = event.target.style.stroke
            event.target.style.stroke = "red"
            event.target.style.strokeWidth = "3px"
            this.setState({selected: nodeKey})
        }
        if (this.state.data) {
            const _data = this.state.data ?? []
            const depth = this.depth(this.state.data)
            for (let i = 0; i < _data.length; i++) {
                const data = _data[i]
                rootLevelArray.push({
                    commitHash: data.name,
                    color: data.nodeProps.style.r !== 10 ? data.nodeProps.style.stroke : data.nodeProps.style.fill
                })
                datas.push(
                    <Tree
                        data={data}
                        height={500}
                        width={Math.sqrt((depth - 1) / 2) * 500}
                        margins={{
                            bottom: 0, 
                            left : 0, 
                            right : 500, 
                            top : 100
                        }}
                        getChildren={this.getChildren}
                        labelProp="info"
                        keyProp="name"
                        nodeProps={{
                            r: 10
                        }}
                        textProps={{
                            dx: 15,
                            dy: -150
                        }}
                        gProps={{
                            onClick: onClick.bind(this),
                        }}
                        svgProps={{
                            className: 'tree',
                        }}/>)
            }
            console.log("rootLevelArray", rootLevelArray)
            rootLevelArray = _.uniqBy(rootLevelArray, (o) => o.commitHash)
            return (
                <div style={{display: "grid", overflow: "scroll"}}>
                    <button className="button" onClick={this.loadMore.bind(this)}>load Next</button>
                    <button className="button" onClick={this.loadMoreBefore.bind(this)}>load Before</button>
                    <button className="button" onClick={this.revert.bind(this)} disabled={this.state.selected === null || this.state.selected === undefined}>Revert</button>
                    <button className="button" onClick={this.cherryPick.bind(this)} disabled={this.state.selected === null || this.state.selected === undefined}>cherryPick</button>
                    <button className="button" onClick={this.checkout.bind(this)} disabled={this.state.selected === null || this.state.selected === undefined}>Checkout</button>
                    {datas}
                </div>
            )
        }
        
        return (<div>
            <button onClick={this.reload}>Reload</button>
        </div>)
    }
}

export default AuditTrail