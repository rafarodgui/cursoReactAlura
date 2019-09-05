import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import InputCustomizado from './InputCustomizado';
import BotaoCustomizado from './BotaoCustomizado';
import $ from 'jquery';
import TratadorErros from './TratadorErros';

export class LivroAdmin extends Component{

    constructor(){
        super();
        this.state = {titulo: '', preco: '', autorId: ''}
        this.setInput = this.setInput.bind(this)
        this.enviaDadosDoLivro = this.enviaDadosDoLivro.bind(this);
    }

    enviaDadosDoLivro(evento){
        evento.preventDefault();
        
        $.ajax({
            url: "https://cdc-react.herokuapp.com/api/livros",
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({titulo:this.state.titulo, preco:this.state.preco, autorId:this.state.autorId}),
            success: function(livro){
                console.log('Aeeeeeee porra')
                PubSub.publish('livro-cadastrado', livro);
                this.setState({titulo: '', preco: '', autorId: ''});
            }.bind(this),
            error: function(erro){
                if(erro.status === 400){
                    new TratadorErros().validaErro(erro.responseJSON)
                }
            },
            beforeSend: function(){
                PubSub.publish('Limpa-erros', {})
              } 
        });
    }

    setInput(campoInput, evento){

        let campo = {}; 
        campo[campoInput] = evento.target.value
        this.setState(campo);
    }

    render(){
        return(
            <div>
                <div className="pure-form pure-form-aligned">
                    <form className="pure-form pure-form-aligned" onSubmit={this.enviaDadosDoLivro} method="post">
                        <InputCustomizado id="titulo" type="text" name="titulo" value={this.state.titulo} onChange={this.setInput.bind(this, 'titulo')} label="Titulo"/>
                        <InputCustomizado id="preco" type="text"name="preco" value={this.state.preco} onChange={this.setInput.bind(this, 'preco')} label="Preço"/>
                        
                        <div className="pure-control-group">
                        <label htmlFor="autorId">Autor</label>
                            <select value={this.state.autorId} name="autor" id="autorId" onChange={this.setAutorId}>Autor
                                <option>Selecione um autor</option>
                                {
                                    this.props.autores.map((autor)=>{

                                        return <option id={autor.id}>{autor.nome}</option>
                                    })
                                }
                            </select>
                        </div>

                        <BotaoCustomizado type="submit" className="pure-button pure-button-primary"/>
                    </form>
                </div>
            </div>
        );
    }
}

export class TabelaLivro extends Component{

    render(){

        return(
            
        <div>
            <table className="pure-table">
                <thead>
                    <tr>
                    <th>Titulo</th>
                    <th>Preço</th>
                    <th>Autor</th>
                    </tr>
                </thead>
                <tbody>
                {
                    this.props.livro.map(function (livro) {
                    return (
                        <tr key={livro.id}>
                        <td>{livro.titulo}</td>
                        <td>{livro.preco}</td>
                        <td>{livro.autor}</td>
                        </tr>
                    );
                    })
                }
                </tbody>
            </table>
         </div>

        );
    }
}

export default class LivroBox extends Component{

    constructor(){

        super();
        this.state = { livro: [], autores: [] };
    }

    componentDidMount() {

        $.ajax({
            url: 'https://localhost:8080/api/livros',
            dataType: 'json',
            success: function(resposta){
                this.setState({livro : resposta});
            }.bind(this),
            error: function(erro){
                if(erro.status === 500){
                    console.log('Erro 500')
                }
            }
        });

        $.ajax({
            url: 'https://localhost:8080/api/livros',
            dataType: 'json',
            success: function(resposta){
                this.setState({autores : resposta});
            }.bind(this),
            error: function(erro){
                if(erro.status === 500){
                    console.log('Erro 500')
                }
            }
        });

        PubSub.subscribe('livro-cadastrado', function(topico, objeto){
            this.setState({ livro: objeto })
        }.bind(this));
    }

    

    render(){

        return(
            <div>
                <div className="header">
                    <h1>Cadastro de Livros</h1>
                </div>

                <div>
                    <LivroAdmin autores={this.state.autores}/>
                    <TabelaLivro livro={this.state.livro}/>
                </div>
            </div>
        );
    }
}