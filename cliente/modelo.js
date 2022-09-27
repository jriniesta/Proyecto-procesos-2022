function Juego(){
    this.partidas={}
    this.usuarios={}

    this.agregarUsuario=function(nick){
        if(!this.usuarios[nick]){
            this.usuarios[nick]=new Usuario(nick,this);
        }
    }
    this.eliminarUsuario=function(jugador){
        delete this.usuario[nick];
    }

    this.crearPartida=function(nick){
        let codigo=Date.now();
        this.partidas[codigo]=new Partida(codigo,nick);
        return codigo;
    }

    this.unirseAPartida=function(codigo,nick){
        if(this.partidas[codigo]){
            this.partidas[codigo].agregarJugador(nick);
        }
        else{
            console.log("La partida no existe");
        }
    }

    this.obtenerPartidas=function(){
        let lista=[];
        for(let key in this.partidas){
            lista.push({"codigo":key,"owner":this.partidas[key].owner})
        }
        return lista;
    }

    this.obtenerPartidasDisponibles=function(){
        // devolver partidas sin completar
    }
}


function Usuario(nick,juego){
    this.nick=nick;
    this.juego=juego;
    this.crearPartida=function(){
        
        return this.juego.crearPartida(this)
    }

    this.unirseAPartida=function(codigo){
        this.juego.unirseAPartida(codigo,this);
        
    }
}

function Partida(codigo,jugador){
    this.codigo=codigo;
    this.owner=jugador;
    this.jugadores=[];
    this.fase="inicial";
    this.agregarJugador=function(usr){
        if(this.jugadores.length<2){
            this.jugadores.push(usr);
        }
        else{
            console.log("Está lleno");
        }
    }
    this.agregarJugador(nick);
}