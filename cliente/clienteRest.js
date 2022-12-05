function ClienteRest() {
	var ultimaPartidaCreada;
  
	this.agregarUsuario = function (nick) {
	  var cli = this;
	  $.getJSON("/agregarUsuario/" + nick, function (data) {
		console.log(data);
		if (data.nick == -1) {
		  console.log(`El usuario ${nick} ya está en uso`);
		  iu.mostrarAgregarUsuario();
		  iu.mostrarModal("El nick ya está en uso");
		  //iu.mostrarAgregarJugador();
		  return;
		}
		console.log(`El usuario ${nick} se ha registrado`);
		$.cookie("nick", nick);
		iu.mostrarHome();
		//   ws.nick = data.nick;
		//iu.mostrarHome(data);
	  });
	};
  
	this.agregarUsuarioDesdeCookie = function (nick) {
	  var cli = this;
	  $.getJSON("/leerUsuario/" + nick, function (data) {
		if (data.nick == -1) {
		  iu.limpiarPantalla();
		  iu.mostrarAgregarUsuario();
		  return;
		}
		iu.recuperarSesionCallback();
	  });
	};
  
	this.crearPartida = function (nick) {
	  var cli = this;
	  $.getJSON("/crearPartida/" + nick, function (data) {
		console.log(data);
		if (data.partida == -1) {
		  console.log(`No se pudo crear un juego`);
		  //iu.mostrarModal("El nick ya está en uso");
		  //iu.mostrarAgregarJugador();
		  return;
		}
		console.log(`El usuario ${nick} ha creado la partida ${data.partida}`);
		cli.ultimaPartidaCreada = data.partida;
		iu.mostrarListaDePartidas();
		iu.mostrarPartidaUnido(data.partida);
		$.cookie("nick", nick);
		$.cookie("codigoP", data.partida);
		//iu.mostrarHome(data);
	  });
	};
  
	this.unirAPartida = function (nick, codigo) {
	  var cli = this;
	  $.getJSON(`/unirAPartida/${codigo}/${nick}`, function (data) {
		console.log(data);
		if (!data.seHaUnido) {
		  console.log(`${nick} No se pudo unir al juego ${codigo}`);
		  //iu.mostrarAgregarJugador();
		  return;
		}
		console.log(`El usuario ${nick} se ha unido a la partida ${codigo}`);
		iu.mostrarPartidaUnido(data.partida);
		$.cookie("nick", nick);
		$.cookie("codigoP", codigo);
		//iu.mostrar                  Home(data);
	  });
	};
  
	this.obtenerPartidas = function () {
	  var cli = this;
	  $.getJSON("/obtenerPartidas", function (data) {
		console.log(data);
	  });
	};
  
	this.obtenerPartidasDisponibles = function () {
	  if ($.cookie("nick") == undefined) {
		return;
	  }
  
	  var cli = this;
	  $.getJSON("/obtenerPartidasDisponibles", function (data) {
		console.log(data);
		iu.mostrarListaDePartidasCallback(data);
	  });
	};
  
	this.crearPartidaCon = function (nick1, nick2) {
	  //Jquery debería ser síncrono para que esto funcione
	  jQuery.ajaxSetup({ async: false });
	  this.agregarUsuario(nick1);
	  this.agregarUsuario(nick2);
	  this.crearPartida(nick1);
	  this.unirAPartida(nick2, this.ultimaPartidaCreada);
	  jQuery.ajaxSetup({ async: true });
	};
  }
  