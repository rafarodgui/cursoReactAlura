import React, { Component } from 'react';

export default class BotaoCustomizado extends Component{

    render(){
        return(
            <div className="pure-control-group">
                <label/>
                <button type={this.props.type} className={this.props.className} value={this.props.label}>Manda Bala</button>
            </div>
        );
    }
}