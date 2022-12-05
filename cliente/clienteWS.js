function ClienteWS() {
	this.socket = io();
  
	//Enviar Peticiones
	this.crearPartida = function (nick) {
	  this.socket.emit("crearPartida", nick);
	};
  
	this.unirAPartida = function (nick, codigo) {
	  this.socket.emit("unirAPartida", nick, codigo);
	};
  
	this.salirPartida = function (nick, codigo) {
	  this.socket.emit("salirPartida", nick, codigo);
	};
  
	this.eliminarUsuario = function (nick) {
	  this.socket.emit("eliminarUsuario", nick);
	};
  
	this.colocarBarco = function (barco, x, y, orientacion = "horizontal") {
	  this.socket.emit(
		"colocarBarco",
		$.cookie("nick"),
		parseInt($.cookie("codigoP")),
		barco,
		x,
		y,
		orientacion
	  );
	};
  
	this.limpiarTablero = function () {
	  this.socket.emit(
		"limpiarTablero",
		$.cookie("nick"),
		parseInt($.cookie("codigoP"))
	  );
	};
  
	this.barcosDesplegados = function () {
	  this.socket.emit(
		"barcosDesplegados",
		$.cookie("nick"),
		parseInt($.cookie("codigoP"))
	  );
	};
  
	this.disparar = function (x, y) {
	  this.socket.emit(
		"disparar",
		$.cookie("nick"),
		parseInt($.cookie("codigoP")),
		x,
		y
	  );
	};
  
	//colocarBarco
	//barcosDesplegados
	//disparar
  
	//Gestionar Peticiones
	this.servidorWS = function () {
	  let cli = this;
  
	  this.socket.on("partidaCreada", function (data) {
		console.log(data);
		if (data.partida == -1) {
		  console.log(`No se pudo crear un juego`);
		  return;
		}
		cli.codigo = data["partida"];
		$.cookie("codigoP", cli.codigo);
		iu.limpiarListaDePartidas();
  
		console.log(`El usuario ha creado la partida ${cli.codigo}`);
		cli.ultimaPartidaCreada = cli.codigo;
		iu.mostrarListaDePartidas();
		iu.mostrarPartidaUnido(cli.codigo);
	  });
  
	  this.socket.on("usuarioEliminado", function (data) {
		if (!data.haSidoEliminado) {
		  console.log(`El usuario ${data.nick} no existía o no se pudo eliminar`);
		  return;
		}
		console.log(`El usuario ${data.nick} se ha eliminado`);
		$.removeCookie("nick");
		$.removeCookie("codigoP");
		iu.limpiarPantalla();
		iu.mostrarAgregarUsuario();
	  });
  
	  this.socket.on("partidaEliminada", function (data) {
		if (!data.haSidoEliminado) {
		  console.log(
			`La partida ${data.codigo} no pudo ser eliminada cuando se intentó borrar`
		  );
		  return;
		}
  
		if (data.usuarioEliminado === $.cookie("nick")) {
		  if ($.cookie("codigoP")) {
			$.removeCookie("codigoP");
			iu.limpiarPantalla();
			iu.mostrarHome();
		  }
		  return;
		}
		if ($.cookie("codigoP") === data.codigo.toString()) {
		  $.removeCookie("codigoP");
		  iu.limpiarPantalla();
		  iu.mostrarHome();
		}
	  });
  
	  this.socket.on("unidoAPartida", function (datos) {
		let codigo = datos.codigoPartida;
		console.log(datos);
		cli.codigo = codigo;
		let nick = datos.nick;
		if (!datos.seHaUnido) {
		  console.log(`${nick} No se pudo unir al juego ${codigo}`);
		  //iu.mostrarAgregarJugador();
		  return;
		}
		console.log(`El usuario ${nick} se ha unido a la partida ${codigo}`);
		iu.limpiarListaDePartidas();
		iu.mostrarPartidaUnido(codigo);
		$.cookie("nick", nick);
		$.cookie("codigoP", codigo);
	  });
  
	  this.socket.on("aDesplegar", function (datos) {
		iu.limpiarListaDePartidas();
		console.log("ha pasado a fase de despliegue");
		//TODO Mostrar despliegue
		console.log(datos);
		tablero.flota = datos.flota;
		tablero.mostrar(true);
		iu.mostrarModal(
		  "¡A colocar barcos!, elige un barco y colócalo en el tablero"
		);
	  });
  
	  this.socket.on("tableroLimpiado", function (datos) {
		if (datos.haSidoLimpiado) {
		  console.log("ha limpiado el tablero");
		  tablero.limpiarGrid();
		} else {
		  console.log("No se ha podido limpiar el tablero");
		}
	  });
  
	  this.socket.on("aJugar", function (datos) {
		console.log(datos);
		console.log("ha iniciado una partida en la que estaba unido");
		iu.mostrarPartidaUnido(datos["codigo"]);
		iu.mostrarModal(
		  "¡A jugar!, La partida ha comenzado\n" +
			(datos.turno === $.cookie("nick")
			  ? "Es tu turno"
			  : "Es el turno del otro jugador")
		);
	  });
  
	  this.socket.on("actualizarListaPartidas", function (lista) {
		if (!cli.codigo) {
		  console.log("Actualizar lista partidas");
		  iu.mostrarListaDePartidas();
		}
	  });
  
	  this.socket.on("barcoColocado", function (datos) {
		let haSidoColocado = datos.haSidoColocado;
		if (haSidoColocado) {
		  tablero.barcoColocado(datos.barco, datos.x, datos.y, datos.orientacion);
		}
		console.log(datos);
	  });
  
	  this.socket.on("barcoDesplegadosCallback", function (datos) {
		let haSidoDesplegado = datos.haSidoDesplegado;
		console.log(datos);
		if (haSidoDesplegado) {
		  iu.mostrarModal("Sus barcos han sido desplegados");
		} else {
		  iu.mostrarModal("No se han podido desplegar los barcos");
		}
	  });
  
	  this.socket.on("resultadoDisparo", function (datos) {
		console.log(datos);
		const datosDisparo = datos.datoDisparo;
		tablero.updateCell(
		  datosDisparo.x,
		  datosDisparo.y,
		  datosDisparo.estado,
		  datosDisparo.turno === $.cookie("nick")
			? "human-player"
			: "computer-player"
		);
	  });
	};
  }
  