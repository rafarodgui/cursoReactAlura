import React, { Component } from 'react';
import InputCustomizado from './InputCustomizado';
import BotaoCustomizado from './BotaoCustomizado';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros.js'

class FormularioAutor extends Component{

  constructor() {
    super();
    this.state = {nome: "", email: "", senha: ""};
    this.enviaForm = this.enviaForm.bind(this);
    this.setInput = this.setInput.bind(this);
  }

  enviaForm(evento){
    evento.preventDefault();    
    $.ajax({
      url:'https://cdc-react.herokuapp.com/api/autores',
      contentType:'application/json',
      dataType:'json',
      type:'post',
      data: JSON.stringify({nome:this.state.nome,email:this.state.email,senha:this.state.senha}),
      success: function(novaListagem){

        console.log('autor adicionado com sucesso!');
        PubSub.publish('evento-disparado', novaListagem);
        this.setState({nome: '', email: '', senha: ''})
      }.bind(this),
               
      error: function(resposta){  
        if(resposta.status === 400){
          new TratadorErros().validaErro(resposta.responseJSON);
        } 
    
      } ,
      beforeSend: function(){
        PubSub.publish('Limpa-erros', {})
      }     
    });
  }
      setInput(campoInput, evento) {
        let campo = {};
        campo[campoInput] = evento.target.value
        this.setState(campo);
      }
    
    render(){

        return(
 
          <div>
            <div className="pure-form pure-form-aligned">
              <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                
                <InputCustomizado type="text" id="nome" name="nome" value={this.state.nome} onChange={this.setInput.bind(this, 'nome')} label="Nome"/>
                <InputCustomizado type="email" id="email" name="email" value={this.state.email} onChange={this.setInput.bind(this, 'email')} label="Email"/>
                <InputCustomizado type="password" id="senha" name="senha" value={this.state.senha} onChange={this.setInput.bind(this, 'senha')} label="Senha"/>
                
                <BotaoCustomizado type="submit" className="pure-button pure-button-primary" />
                
              </form>
            </div>   
          </div>
        );
    }
}

class TabelaAutores extends Component{

  render(){
    return(

      <div>
        <table className="pure-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>email</th>
            </tr>
          </thead>
        <tbody>
          {
            this.props.lista.map(function (autor) {
              return (
                <tr key={autor.id}>
                  <td>{autor.nome}</td>
                  <td>{autor.email}</td>
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

export default class AutorBox extends Component{

  constructor() {
    super();
    this.state = { lista: [] };
  }
 
  componentDidMount() {
    console.log("didMount");
    $.ajax({
      url: "https://localhost:8080/api/autores"/*"https://cdc-react.herokuapp.com/api/autores"*/,
      dataType: 'json',
      success: function (resposta) {
        console.log("chegou a resposta");
        this.setState({ lista: resposta });
      }.bind(this)
    });

    PubSub.subscribe('evento-disparado', function(topico, novaLista){
      this.setState({lista:novaLista})
    }.bind(this));
  }

  render(){

    return(

      <div>
        <div className="header">
          <h1>Cadastro de autores</h1>
        </div>

        <div>
          <FormularioAutor/>
          <TabelaAutores lista={this.state.lista} />
        </div>
      </div>
    );
  }
}