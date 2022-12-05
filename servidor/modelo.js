function Juego() {
	this.partidas = {};
	this.usuarios = {};
  
	this.agregarUsuario = function (nick) {
	  if (this.usuarios[nick]) {
		console.log(`El usuario ${nick} ya existe`);
		return null;
	  }
	  this.usuarios[nick] = new Usuario(nick, this);
	  console.log(`Nuevo usuario en el sistema: ${nick}`);
	  return this.usuarios[nick];
	};
	this.eliminarUsuario = function (nick) {
	  let juegosFinalizados = this.finalizarJuegosDe(nick);
  
	  if (juegosFinalizados.some((j) => !j.datosJuego.eliminado)) {
		console.log(
		  `No se puede eliminar el usuario ${nick} porque tiene partidas en curso`
		);
		return false;
	  }
  
	  let existiaUsuario = this.usuarios[nick] != null;
	  let eliminacionExitosa = delete this.usuarios[nick];
	  let haSidoEliminado = eliminacionExitosa && existiaUsuario;
	  console.log(
		haSidoEliminado
		  ? `Eliminado al usuario ${nick}`
		  : `no se pudo eliminar a ${nick}`
	  );
	  return {
		haSidoEliminado: haSidoEliminado,
		juegosFinalizados: juegosFinalizados,
	  };
	};
  
	this.finalizarJuegosDe = function (nick) {
	  let salida = [];
	  for (let codigoPartida in this.partidas) {
		let datoJuego = this.finalizarJuego(nick, codigoPartida);
		if (datoJuego.estabaEnPartida) {
		  salida.push({
			codigo: codigoPartida,
			datosJuego: datoJuego,
		  });
		}
	  }
	  return salida;
	};
  
	this.finalizarJuego = function (nick, codigo) {
	  let partida = this.obtenerPartida(codigo);
	  let estabaEnPartida = false;
	  let eliminado;
	  let usuariosExpulsados = [];
  
	  if (!partida) return false;
	  if (partida.esOwnerDe(nick)) {
		estabaEnPartida = true;
		usuariosExpulsados.push(partida.obtenerJugadoresNoPropietaros());
		eliminado = this.eliminarPartida(codigo);
	  } else if (partida.esJugadoPor(nick)) {
		estabaEnPartida = true;
		if (partida.fase == "inicial") {
		  // Es imposible con 2 jugadores, pero lo tengo en cuenta aún así
		  eliminado = partida.eliminarJugador(nick);
		} else {
		  usuariosExpulsados.push(partida.obtenerJugadoresNoPropietaros());
		  eliminado = this.eliminarPartida(codigo);
		}
	  }
	  return {
		eliminado: eliminado,
		estabaEnPartida: estabaEnPartida,
		usuariosExpulsados: usuariosExpulsados,
	  };
	};
  
	this.eliminarPartida = function (codigo) {
	  let existiaUsuario = this.partidas[codigo] != null;
	  let eliminacionExitosa = delete this.partidas[codigo];
	  let haSidoEliminado = eliminacionExitosa && existiaUsuario;
	  console.log(
		haSidoEliminado
		  ? `Eliminado el juego ${codigo}`
		  : `no se pudo eliminar el juego ${codigo}`
	  );
	  return haSidoEliminado;
	};
  
	this.crearPartidaUsuario = function (usuario) {
	  //Obtener uid
	  //Crear partida
	  //Asignar propietario a nick
	  //Devolver partida
	  let codigo = Date.now();
	  this.partidas[codigo] = new Partida(codigo, usuario);
	  return codigo;
	};
  
	this.crearPartidaNick = function (nick) {
	  let usuario = this.usuarios[nick];
	  if (!usuario) {
		return -1;
	  }
  
	  let codigoPartida = usuario.crearPartida();
	  return codigoPartida;
	};
  
	this.obtenerPartida = function (codigo) {
	  return this.partidas[codigo];
	};
  
	this.unirAPartida = function (codigo, usuario) {
	  const partida = this.partidas[codigo];
	  if (!partida) {
		console.log("La partida no existe");
		return false;
	  }
	  return partida.agregarJugador(usuario);
	};
  
	this.unirAPartidaNick = function (codigo, nick) {
	  let usuario = this.usuarios[nick];
	  if (!usuario) {
		return false;
	  }
  
	  let codigoPartida = usuario.unirseAPartida(codigo);
	  return codigoPartida;
	};
  
	this.obtenerPartidas = function () {
	  let lista = [];
	  for (let key in this.partidas) {
		lista.push({
		  codigo: key,
		  owner: this.partidas[key].owner.nick,
		  fase: this.partidas[key].fase,
		});
	  }
	  return lista;
	};
  
	this.obtenerPartidasDisponibles = function () {
	  let filterLista = [];
	  let lista = this.obtenerPartidas();
	  for (let i = 0; i < lista.length; i++) {
		let partidaJson = lista[i];
		let partida = this.partidas[partidaJson.codigo];
		if (partida.estaDisponible()) {
		  filterLista.push(partidaJson);
		}
	  }
	  return filterLista;
	};
  }
  
  function Usuario(nick, juego) {
	this.nick = nick;
	this.juego = juego;
  
	this.crearPartida = function () {
	  return this.juego.crearPartidaUsuario(this);
	};
  
	this.unirseAPartida = function (codigo) {
	  return this.juego.unirAPartida(codigo, this);
	};
  }
  
  function Jugador(usuario, partida) {
	this.usuario = usuario;
	this.partida = partida;
	this.tablero;
	this.flota;
	this.despliegueListo = false;
  
	this.nick = () => usuario.nick;
	this.colocarBarco = (indiceBarco, x, y, orientacion = "horizontal") => {
	  this.despliegueListo = false;
	  if (this.partida.fase != "desplegando") return false;
	  if (indiceBarco < 0 || indiceBarco >= this.flota.length) return false;
	  if (
		orientacion.toLowerCase() != "horizontal" &&
		orientacion.toLowerCase() != "vertical"
	  )
		return false;
	  let barco = this.flota[indiceBarco];
  
	  let haSidoColocado = this.tablero.colocarBarco(barco, x, y, orientacion);
	  if (haSidoColocado) {
		barco.desplegado = true;
		barco.orientacion = orientacion;
	  }
	  this.partida.comprobarFase();
	  return haSidoColocado;
	};
  
	this.limpiarTablero = () => {
	  if (this.partida.fase != "desplegando") return false;
	  this.tablero.limpiarTablero();
	  return true;
	};
  
	this.barcosDesplegados = () => {
	  if (this.estaDesplegado()) {
		this.despliegueListo = true;
		this.partida.comprobarFase();
		return true;
	  }
	  return false;
	};
  
	this.estaDesplegado = () => {
	  for (const barco of this.flota) {
		if (!barco.desplegado) {
		  return false;
		}
	  }
	  return true;
	};
  
	this.barcosSinHundir = () => {
	  let contador = 0;
  
	  for (const barco of this.flota) {
		if (!barco.hundido()) {
		  contador++;
		}
	  }
	  return contador;
	};
  
	this.todosBarcosHundidos = () => this.barcosSinHundir() == 0;
  
	this.disparar = (x, y) => {
	  return this.partida.disparar(this.nick(), x, y);
	};
  }
  
  function Partida(codigo, usuario) {
	const faseInicial = "inicial";
	const faseDesplegando = "desplegando";
	const faseJugando = "jugando";
	const faseFinal = "final";
  
	const flotaPorDefecto = [
	  new Barco(1),
	  new Barco(1),
	  new Barco(2),
	  new Barco(3),
	  new Barco(4),
	];
  
	this.flota = flotaPorDefecto;
	this.codigo;
	this.fase = faseInicial;
	this.owner = usuario;
	this.turno = 0;
	this.ganador;
  
	this.crearJugador = (usuario) => {
	  let jugador = new Jugador(usuario, this);
	  // Actualizar luego para tener todos los flota
  
	  let tablero = new Tablero();
	  //Cambiar tamaño si hace falta
	  tablero.crearTablero(10);
  
	  jugador.flota = this.flota;
	  jugador.tablero = tablero;
  
	  return jugador;
	};
  
	this.jugadores = [this.crearJugador(usuario)];
	const maxJugadores = 2;
  
	this.agregarJugador = function (usuario) {
	  if (!this.hayHueco()) {
		console.log("Partida llena");
		return false;
	  }
	  jugador = this.crearJugador(usuario);
  
	  this.jugadores.push(jugador);
	  console.log(
		`El usuario ${usuario.nick} se ha unido a la partida ${codigo}`
	  );
  
	  this.comprobarFase();
	  return true;
	};
  
	this.obtenerJugador = function (nick) {
	  let idx = this.jugadores.findIndex((p) => p.nick() == nick);
	  if (idx != -1) {
		return this.jugadores[idx];
	  }
	};
  
	this.obtenerJugadoresNoPropietaros = function (nick) {
	  return this.jugadores.filter((p) => p.nick() != nick);
	};
  
	this.eliminarJugador = function (nick) {
	  let idx = this.jugadores.findIndex((p) => p.nick() == nick);
	  if (idx != -1) {
		this.jugadores.splice(idx, 1);
		console.log(`El jugador "${nick}" abandona la partida ${this.codigo}`);
		this.fase = faseInicial;
		this.turno = 0;
		return true;
	  }
	  console.log(`El jugador "${nick}" no está en la partida ${this.codigo}`);
	  return false;
	};
  
	this.cambiarFlota = function (flota) {
	  this.flota = flota;
	  for (jugador of this.jugadores) {
		jugador.flota = flota;
	  }
	};
  
	this.estaDisponible = function () {
	  return this.jugadores.length < maxJugadores;
	};
  
	this.quienHaGanado = () => {
	  for (const jugador of this.jugadores) {
		if (jugador.estaDesplegado() && jugador.todosBarcosHundidos()) {
		  return this.jugadorRivalDe(jugador.nick);
		}
	  }
	};
  
	this.estaDesplegado = () => {
	  return this.jugadores.every((jugador) => jugador.despliegueListo);
	};
  
	this.hayHueco = () => this.jugadores.length < maxJugadores;
  
	this.comprobarFase = function () {
	  const ganador = this.quienHaGanado();
	  if (ganador) {
		this.ganador = ganador;
		this.fase = faseFinal;
	  } else if (this.estaDesplegado()) {
		this.fase = faseJugando;
	  } else if (!this.hayHueco()) {
		this.fase = faseDesplegando;
	  }
	};
  
	this.esInicial = () => this.fase === faseInicial;
	this.esDesplegando = () => this.fase === faseDesplegando;
	this.esJugando = () => this.fase === faseJugando;
	this.esFinal = () => this.fase === faseFinal;
  
	this.esOwnerDe = function (nick) {
	  return this.owner.nick === nick;
	};
  
	this.esJugadoPor = function (nick) {
	  return this.jugadores.some((j) => j.nick === nick);
	};
  
	this.otroTurno = () => (this.turno + 1) % this.jugadores.length;
  
	this.cambiarTurno = () => {
	  this.turno = this.otroTurno();
	};
  
	this.jugadorRivalDe = (nick) => this.jugadores.find((j) => j.nick != nick);
  
	this.jugadorTurnoActual = () => this.jugadores[this.turno];
	this.jugadorSinTurnoActual = () => this.jugadores[this.otroTurno()];
  
	this.disparar = (nick, x, y) => {
	  if (!this.esJugando())
		return {
		  haDisparado: false,
		  estado: "No está en fase jugando",
		  turno: null,
		};
  
	  const jugadorTurno = this.jugadorTurnoActual();
  
	  if (jugadorTurno.nick() != nick) {
		console.log("No es el turno de", nick);
		return {
		  haDisparado: false,
		  estado: "Fuera de turno",
		  turno: this.jugadorTurnoActual().nick(),
		};
	  }
  
	  const jugadorRecibeAtaque = this.jugadorSinTurnoActual();
	  const tableroAtacado = jugadorRecibeAtaque.tablero;
  
	  let estadoDisparo = tableroAtacado.recibirDisparo(x, y);
  
	  this.comprobarFase();
	  let haDisparado = false;
  
	  if (estadoDisparo.cambiarTurno) {
		this.cambiarTurno();
		haDisparado = true;
	  }
  
	  return {
		haDisparado: haDisparado,
		x: x,
		y: y,
		estado: estadoDisparo.estado,
		turno: this.jugadorTurnoActual().nick(),
	  };
	};
  }
  
  function Barco(tamano) {
	this.tamano = tamano;
	this.vida = tamano;
	this.desplegado = false;
  
	this.nombre = () => "b" + this.tamano;
	this.hundido = () => this.vida == 0;
  }
  
  function CeldaBarco(barco) {
	this.barco = barco;
	this.golpeado = false;
	this.estado = "intacto";
  
	this.recibirDisparo = () => {
	  if (this.golpeado)
		return {
		  estado:
			this.barco.vida > 0
			  ? "Esta celda del barco ya fue golpeada"
			  : "Este barco ya fue hundido",
		  cambiarTurno: false,
		};
	  this.barco.vida -= 1;
	  this.golpeado = true;
	  return {
		estado: this.estado(),
		cambiarTurno: true,
	  };
	};
  
	this.estado = () => {
	  if (!this.golpeado) return "intacto";
	  if (barco.vida > 0) return "tocado";
	  return "hundido";
	};
  
	this.estadoNoGolpeado = () => {
	  return this.estado;
	};
  
	this.estadoGolpeado = () => {
	  return this.estado;
	};
  
	this.sePuedeSobrescribir = () => false;
  
	this.contieneAlBarco = (barco) => barco === this.barco;
  }
  
  function Agua() {
	this.recibirDisparo = () => {
	  return { estado: this.estado(), cambiarTurno: true };
	};
  
	this.estado = () => "agua";
  
	this.sePuedeSobrescribir = () => true;
  
	this.contieneAlBarco = (barco) => false;
  }
  
  function Celda(x, y) {
	this.x = x;
	this.y = y;
  
	this.contiene = new Agua();
  
	this.recibirDisparo = () => {
	  return this.contiene.recibirDisparo();
	};
  
	this.estado = () => {
	  return this.contiene.estado();
	};
  
	this.sePuedeSobrescribir = () => {
	  return this.contiene.sePuedeSobrescribir();
	};
  
	this.contieneAlBarco = (barco) => {
	  return this.contiene.contieneAlBarco(barco);
	};
  }
  
  function Tablero() {
	this.celdas;
  
	this.crearTablero = function (tam) {
	  this.celdas = new Array(tam);
	  for (x = 0; x < tam; x++) {
		this.celdas[x] = new Array(tam);
		for (y = 0; y < tam; y++) {
		  this.celdas[x][y] = new Celda(x, y);
		}
	  }
	};
  
	this.limpiarTablero = function () {
	  this.crearTablero(10);
	};
  
	this.obtenerCelda = (x, y) => {
	  if (
		x < 0 ||
		y < 0 ||
		x >= this.celdas[0].length ||
		y >= this.celdas.length
	  ) {
		return false;
	  }
  
	  return this.celdas[x][y];
	};
  
	this.recibirDisparo = (x, y) => {
	  let celda = this.obtenerCelda(x, y);
	  let estadoCelda = celda.recibirDisparo();
	  return estadoCelda;
	};
  
	this.colocarBarco = (barco, x, y, orientacion = "horizontal") => {
	  orientacion = orientacion.toLowerCase();
	  if (orientacion != "horizontal" && orientacion != "vertical") return false;
  
	  const sePuedeColocar = this.sePuedeColocarBarco(barco, x, y, orientacion);
	  if (!sePuedeColocar) {
		return false;
	  }
  
	  this.limpiarBarcoDelTablero(barco);
  
	  let seHaColocado = this.colocarBarcoForzado(barco, x, y, orientacion);
	  return seHaColocado;
	};
  
	this.sePuedeColocarBarco = (barco, x, y, orientacion = "horizontal") => {
	  for (let offset = 0; offset < barco.tamano; offset++) {
		let celda;
		if (orientacion === "horizontal") {
		  celda = this.obtenerCelda(x + offset, y);
		} else {
		  celda = this.obtenerCelda(x, y + offset);
		}
  
		if (!celda || !celda.sePuedeSobrescribir()) {
		  return false;
		}
	  }
	  return true;
	};
  
	this.limpiarBarcoDelTablero = (barco) => {
	  for (let i = 0; i < this.celdas.length; i++) {
		const fila = this.celdas[i];
		for (let j = 0; j < fila.length; j++) {
		  const celda = fila[j];
		  if (celda.contieneAlBarco(barco)) {
			celda.contiene = new Agua();
		  }
		}
	  }
	};
  
	this.colocarBarcoForzado = (barco, x, y, orientacion = "horizontal") => {
	  for (let offset = 0; offset < barco.tamano; offset++) {
		let celda;
		if (orientacion === "horizontal") {
		  celda = this.obtenerCelda(x + offset, y);
		} else {
		  celda = this.obtenerCelda(x, y + offset);
		}
  
		celda.contiene = new CeldaBarco(barco);
	  }
	  return true;
	};
  }
  
  module.exports.Juego = Juego;
  module.exports.Barco = Barco;
  