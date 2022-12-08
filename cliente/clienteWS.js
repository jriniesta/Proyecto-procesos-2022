function ClienteWS() {

    this.socket = io();
    this.socket;
    this.codigo;

    this.conectar = function () {
        this.socket = io();
        this.servidorWS();
    }
    this.crearPartida = function () {
        this.socket.emit("crearPartida", rest.nick);
    }
    this.unirseAPartida = function (codigo) {
        this.socket.emit("unirseAPartida", rest.nick, codigo);
    }
    this.abandonarPartida = function (codigo) {
        this.socket.emit("abandonarPartida", rest.nick, codigo);
    }
    this.colocarBarco = function (nombre, x, y) {
        this.socket.emit("colocarBarco", rest.nick, nombre, x, y);
    }

    this.barcosDesplegados = function () {
        this.socket.emit("barcosDesplegados", rest.nick);
    }
    this.disparar = function (x, y) {
        this.socket.emit("disparar", rest.nick, x, y);
    }
    this.salirUsuario = function () {
        this.socket.emit("salir", rest.nick);
    }

    //gestion de peticiones
    this.servidorWS = function () {
        let cli = this;
        this.socket.on("partidaCreada", function (data) {
            if (data.codigo != -1) {
                console.log("El usuario " + rest.nick + " crea la partida de codigo: " + data.codigo);
                iu.mostrarCodigo(data.codigo);
                iu.mostrarAbandonarPartida(data.codigo);
                cli.codigo = data.codigo;
            }
            else {
                console.log("No se ha podido crear la partida.");
                iu.mostrarModal("No se ha podido crear la partida.");
                iu.mostrarCrearPartida();
                rest.comprobarUsuario();
            }
        });
        this.socket.on("unidoAPartida", function (data) {
            console.log(data);
            if (data.codigo != -1) {
                console.log("El usuario " + rest.nick + " se ha unido a la partida de codigo: " + data.codigo);
                iu.mostrarCodigo(data.codigo);
                iu.mostrarAbandonarPartida(data.codigo);
                cli.codigo = data.codigo;
            }
            else {
                console.log("No se ha podido unir a la partida.");
            }
        });

        this.socket.on("actualizarListaPartidasDisp", function (lista) {
            if (!cli.codigo) {
                iu.mostrarListaDePartidasDisponibles(lista);
            }
        });

        this.socket.on("aDesplegar", function (res) {
            tablero.flota = res.flota; 
            tablero.mostrarTablero(true);
            console.log("Comienza a desplegar la flota en el tablero.");
            iu.mostrarModal("Comienza a desplegar la flota en el tablero.");
        });
        this.socket.on("userAbandona", function (res) {
            iu.mostrarHome();
            tablero.mostrarTablero(false);
            console.log("El Usuario " + res.nick + " ha abandonado la partida " + res.codigo);
            iu.mostrarModal("El Usuario " + res.nick + " ha abandonado la partida ");
        });
        this.socket.on("barcoColocado", function (res) {
            //Pintar gris cuando colocamos
            if (res.colocado) {
                let barco = tablero.flota[res.barco];
                tablero.puedesColocarBarco(barco, res.x, res.y, res.desplegados);
                console.log("El Barco " + res.barco + " es colocado en la posición (" + res.x + "," + res.y + ")");
                iu.mostrarModal("El Barco " + res.barco + " es colocado en la posición (" + res.x + "," + res.y + ")");
            }


        });
        this.socket.on("barcoYaColocado", function (res) {
            console.log("Ya existe un barco en la posición (" + res.posicion+")");
            iu.mostrarModal("Ya existe un barco en la posición (" + res.posicion+")");
        });

        this.socket.on("noColocar", function () {
            console.log("Entra en una partida antes de colocar un barco.");
            iu.mostrarModal("Entra en una partida antes de colocar un barco.");
        });
        this.socket.on("noDispare", function () {
            console.log("Entra en una partida antes de disparar.");
            iu.mostrarModal("Entra en una partida antes de disparar.");
        });
        this.socket.on("aJugar", function (res) {
            iu.mostrarModal("¡A Jugar!. Empieza: " + res.turno);
            console.log("¡A Jugar!. Empieza: " + res.turno);
        });

        this.socket.on("noTodosDesplegados", function () {
            iu.mostrarModal("Aun no se han desplegado todos los barcos.");
            console.log("Aun no se han desplegado todos los barcos.")
        });
        this.socket.on("esperandoRival", function () {
            console.log("Esperando al rival");
            iu.mostrarModal("Esperando al rival");
        })
        this.socket.on("disparo", function (res) {
            if (res.turno == rest.nick) {
                tablero.puedesDisparar(res.estado, res.x, res.y, 'computer-player');
            }
            else {
                tablero.puedesDisparar(res.estado, res.x, res.y, 'human-player');
            }
            let estado = undefined;
            switch (res.estado) {
                case "agua":
                    estado = "AGUA"
                    res.turno = res.atacado;
                    break;
                case "tocado":
                    estado = "TOCADO"
                    break;
                case "hundido":
                    estado = "HUNDIDO"
                    break;
            }
            console.log("Disparo de " + res.atacante + ": " + estado);
            iu.mostrarModal("Disparo de " + res.atacante + ": " + estado + "<br/>Turno de: " + res.turno);
        });

        this.socket.on("noEsTuTurno", function (res) {
            console.log("Aun estamos en el turno de " + res.turno);
            iu.mostrarModal("Aun estamos en el turno de " + res.turno);
        });

        this.socket.on("salir", function (res) {
            tablero.mostrarTablero(false);
            if (res.nick == rest.nick) {
                console.log("Has salido del juego");
                iu.mostrarModal("Has salido del juego");
            } else {
                iu.mostrarHome();
                console.log("El usuario " + res.nick + " ha salido del juego.");
                iu.mostrarModal("El usuario " + res.nick + " ha salido del juego.");
            }
        });

        this.socket.on("finPartida", function (res) {
            tablero.mostrarTablero(false);
            console.log("Fin de la partida.");
            console.log("Ha ganado: ", +res.turno);
            iu.mostrarModal("Fin de la partida. Ha ganado: " + res.turno);
            iu.finPartida();
        });

    }
}
