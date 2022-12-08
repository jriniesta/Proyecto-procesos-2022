function ServidorWS() {
	//enviar peticiones
  
	this.enviarAlRemitente = function (socket, mensaje, datos) {
	  socket.emit(mensaje, datos);
	};
  
	this.enviarATodosEnPartida = function (io, codigo, mensaje, datos) {
	  io.sockets.in(codigo).emit(mensaje, datos);
	};
  
	this.enviarATodos = function (socket, mensaje, datos) {
	  socket.broadcast.emit(mensaje, datos);
	};
  
	//gestionar peticiones
	this.lanzarServidorWS = function (io, juego) {
	  let cli = this;
	  io.on("connection", (socket) => {
		console.log("Usuario conectado");
  
		socket.on("crearPartida", function (nick) {
		  let codigoPartida = juego.crearPartidaNick(nick);
		  if (codigoPartida) {
			socket.join(codigoPartida.toString());
		  }
		  cli.enviarAlRemitente(socket, "partidaCreada", {
			partida: codigoPartida,
		  });
		  let lista = juego.obtenerPartidasDisponibles();
		  cli.enviarATodos(socket, "actualizarListaPartidas", lista);
		});
  
		socket.on("unirAPartida", function (nick, codigo) {
		  let partida = juego.obtenerPartida(codigo);
		  if (!partida) {
			console.log("Partida null en unir partida");
			return;
		  }
  
		  let seHaUnido = juego.unirAPartidaNick(codigo, nick);
		  let jugador = partida.obtenerJugador(nick);
		  if (seHaUnido) {
			socket.join(codigo.toString());
			let lista = juego.obtenerPartidasDisponibles();
			cli.enviarATodos(socket, "actualizarListaPartidas", lista);
		  }
		  cli.enviarAlRemitente(socket, "unidoAPartida", {
			nick: nick,
			codigoPartida: codigo,
			seHaUnido: seHaUnido,
		  });
  
		  if (partida.esDesplegando()) {
			cli.enviarATodosEnPartida(io, codigo.toString(), "aDesplegar", {
			  flota: jugador.flota,
			  codigo: codigo,
			});
		  }
  
		  let lista = juego.obtenerPartidasDisponibles();
		  cli.enviarATodos(socket, "actualizarListaPartidas", lista);
		});
  
		socket.on("eliminarUsuario", function (nick) {
		  let datosEliminacion = juego.eliminarUsuario(nick);
  
		  if (datosEliminacion.juegosFinalizados) {
			for (partidaEliminada of datosEliminacion.juegosFinalizados) {
			  socket.leave(partidaEliminada.codigo);
			  cli.enviarATodosEnPartida(
				io,
				partidaEliminada.codigo.toString(),
				"partidaEliminada",
				{
				  haSidoEliminado: partidaEliminada.datosJuego.eliminado,
				  codigo: partidaEliminada.codigo,
				  usuarioEliminado: nick,
				}
			  );
			}
		  }
  
		  cli.enviarAlRemitente(socket, "usuarioEliminado", {
			haSidoEliminado: datosEliminacion.haSidoEliminado,
			nick: nick,
		  });
  
		  let lista = juego.obtenerPartidasDisponibles();
		  cli.enviarATodos(socket, "actualizarListaPartidas", lista);
		});
  
		socket.on("salirPartida", function (nick, codigo) {
		  let datosJuego = juego.finalizarJuego(nick, codigo);
		  socket.leave(codigo);
		  cli.enviarATodosEnPartida(io, codigo.toString(), "partidaEliminada", {
			haSidoEliminado: datosJuego.eliminado,
			codigo: codigo,
		  });
  
		  let lista = juego.obtenerPartidasDisponibles();
		  cli.enviarATodos(socket, "actualizarListaPartidas", lista);
		});
  
		socket.on(
		  "colocarBarco",
		  function (nick, codigo, barco, x, y, orientacion) {
			let partida = juego.obtenerPartida(codigo);
			if (!partida) {
			  console.log(`No se encontró la partida ${codigo}`);
			  return;
			}
			let jugador = partida.obtenerJugador(nick);
			let haSidoColocado = jugador.colocarBarco(barco, x, y, orientacion);
  
			cli.enviarAlRemitente(socket, "barcoColocado", {
			  haSidoColocado: haSidoColocado,
			  barco: barco,
			  x: x,
			  y: y,
			  orientacion: orientacion,
			});
			// Añadir barco
		  }
		);
  
		socket.on("limpiarTablero", function (nick, codigo) {
		  let partida = juego.obtenerPartida(codigo);
		  if (!partida) {
			console.log(`No se encontró la partida ${codigo}`);
			return;
		  }
		  let jugador = partida.obtenerJugador(nick);
		  let haSidoLimpiado = jugador.limpiarTablero();
  
		  cli.enviarAlRemitente(socket, "tableroLimpiado", {
			haSidoLimpiado: haSidoLimpiado,
		  });
		});
  
		socket.on("barcosDesplegados", function (nick, codigo) {
		  let partida = juego.obtenerPartida(codigo);
		  let jugador = partida.obtenerJugador(nick);
		  let haSidoDesplegado = jugador.barcosDesplegados();
		  let turno = partida.jugadorTurnoActual().usuario.nick;
  
		  cli.enviarAlRemitente(socket, "barcoDesplegadosCallback", {
			haSidoDesplegado: haSidoDesplegado,
		  });
  
		  if (partida.esJugando()) {
			cli.enviarATodosEnPartida(io, codigo.toString(), "aJugar", {
			  codigo: codigo,
			  turno: turno,
			});
		  }
  
		  let lista = juego.obtenerPartidasDisponibles();
		  cli.enviarATodos(socket, "actualizarListaPartidas", lista);
		});
  
		socket.on("disparar", function (nick, codigo, x, y) {
		  let partida = juego.obtenerPartida(codigo);
		  let jugador = partida.obtenerJugador(nick);
		  let datoDisparo = jugador.disparar(x, y);
  
		  // False, no ha disparado, string estado de la celda tras el disparo
		  cli.enviarATodosEnPartida(io, codigo.toString(), "resultadoDisparo", {
			datoDisparo: datoDisparo,
		  });
		});
	  });
	};
  }
  
  module.exports.ServidorWS = ServidorWS;
  