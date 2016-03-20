Mensagens = new Mongo.Collection("Mensagens");
 
if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish("msgs", function () {
    return Mensagens.find();
  });
}
if (Meteor.isClient) {
	 // This code only runs on the client
	Template.body.helpers({
    mensagens: function(){
      return Mensagens.find({},{sort: {createdAt: 1}});
    },
	});

	Template.body.events({
		"submit .enviar-mensagem": function(event){
			event.preventDefault(); //previne que carregue o form default

      //passando hora e minuto

      var msg = event.target.msg.value; //pega a mensagem do input

      if(msg==="/apagartudo"){ //VERIFICANDO SE É UM COMANDO INTERNO
        Meteor.call("zeraMensagens");
        Meteor.call("addMsgAdministrador",'Banco zerado com sucesso');
      }else{
        if(msg!=""){
  		    Meteor.call("addMsg",msg);
        }
      }
      event.target.msg.value = '';

      $('#mensagens').scrollTop($('#mensagens').prop('scrollHeight'));

		},
    
    "click .limpar-chat": function(){

      Meteor.call("limparChat");
      console.log('limpou chat');

    }

	});
  
   Meteor.call.onAfterAction(function () {
    // in here, the router has already determined the current route and everything
          alert('carregou');

  });

  Template.msgs.events({
    //espaço para setar eventos deste template
  });

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
  });
	
}
Meteor.methods({
  addMsg: function (msg){
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var date = new Date();
    var hora = date.getHours();
    var minuto = date.getMinutes();

    if(minuto < 10)
      minuto = "0"+minuto;

    var segundos = date.getSeconds();

    if(segundos < 10)
      segundos = "0"+segundos;

    Mensagens.insert({ //insere a mensagem no banco de dados
      text: msg,
      createdAt: hora+":"+minuto+":"+segundos, // current time
      autor: Meteor.userId(),  // _id of logged in user
      username: Meteor.user().username  // username of logged in user
    });

  },
  addMsgAdministrador: function (msg){
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var date = new Date();
    var hora = date.getHours();
    var minuto = date.getMinutes();

    if(minuto < 10)
      minuto = "0"+minuto;

    var segundos = date.getSeconds();

    if(segundos < 10)
      segundos = "0"+segundos;

    Mensagens.insert({ //insere a mensagem no banco de dados
      text: msg,
      createdAt: hora+":"+minuto+":"+segundos, // current time
      autor: Meteor.userId(),  // _id of logged in user
      username: 'Sistema'  // username of logged in user
    });
  },
  zeraMensagens: function(){
    Mensagens.remove({});
  },
  limparChat: function(){
    $('#canvas').html(''); //esvazia a ul
  }
});