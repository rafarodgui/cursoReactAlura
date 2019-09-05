import React, { Component } from 'react';

export default class Home extends Component{

    render(){

        return(
            <div>
                <div className="header">
                    <h1>Bem vindo ao sistema</h1>
                </div>
                <div id="content" className="content">
                </div> 
            </div>
        );
    }
}