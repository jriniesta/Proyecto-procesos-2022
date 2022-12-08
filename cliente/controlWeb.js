function ControlWeb() {

    this.mostrarAgregarUsuario = function () {
        $("#mAU").remove();
        $("#mH").remove();
        $("#mCP").remove();
        $("#mLPD").remove();
        var cadena = '<div class="row" id="mAU">';
        cadena = cadena + '<div class="card bg-light" style="width:500px; margin: auto auto">';
        cadena = cadena + '<div class="card-body">';
        cadena = cadena + '<h2>Inicio de sesión</h2>';
        cadena = cadena + '<input type="text" class="form-control mb-2 mr-sm-2" id="usr" placeholder="Introduce tu nick (max 6 letras)" required>';
        cadena = cadena + '<button id="btnAU" class="btn btn-primary mb-2 mr-sm-2">Entrar</button>';
        cadena = cadena + '<div id="nota"></div>';
        cadena = cadena + '</div></div>'


        $("#agregarUsuario").append(cadena);  

        $("#btnAU").on("click", function (e) {
            if ($('#usr').val() === '' || $('#usr').val().length > 6) {
                e.preventDefault();
                $('#nota').append('Nick inválido');
            }
            else {
                var nick = $('#usr').val();
                $("#mAU").remove();
                rest.agregarUsuario(nick);

            }
        });
    }
    this.mostrarComprobarCookie = function () {
        $('#mCC').remove();
        
        if ($.cookie("nick")) {
            rest.nick = $.cookie("nick");
            rest.comprobarUsuario(); 
        }
        else {
            this.mostrarAgregarUsuario();     
        }
    }

    this.mostrarHome = function () {
        $('#mH').remove();
        var cadena = '<div class="row" id="mH">';
        cadena = cadena + '<div class="col">';
        cadena = cadena + '<div class="card bg-light" style=" margin: auto auto" id="card-bienvenido">';
        cadena = cadena + '<div class="card-body">';
        cadena = cadena + '<h1>Bienvenid@ ';
        rest.nick = $.cookie("nick"); 
        cadena = cadena + rest.nick;
        cadena = cadena + "!" + '</h1>';
        cadena = cadena + '<div id="codigo"></div>';
        cadena = cadena + '<button id="btnCC" class="btn btn-primary mb-2 mr-sm-2" style="margin-left:15px">Salir</button>';
        cadena = cadena + '</div></div>';
        cadena = cadena + '</div></div>';
        
        $("#agregarUsuario").append(cadena);
       
        this.mostrarCrearPartida();
        rest.obtenerListaPartidasDisponibles();

        $("#btnCC").on("click", function (e) {
            $("#mCP").remove();
            $("#mLPD").remove();
            $('#mH').remove();
            cws.salirUsuario();
            $.removeCookie("nick");
            iu.mostrarComprobarCookie();
        });

    }
    this.mostrarCrearPartida = function () {
        $("#mCP").remove()
        var cadena = '<div class="row" id="mCP">';
        cadena = cadena + '<div class="col">'
        cadena = cadena + '<div class="card bg-light" style=" margin: auto auto" id="card-bienvenido">';
        cadena = cadena + '<div class="card-body">';
        cadena = cadena + '<button id="btnCP" class="btn btn-primary">Crear partida</button>';
        cadena = cadena + '</div></div>';
        cadena = cadena + '</div></div>';

        $("#crearPartida").append(cadena);
        $("#btnCP").on("click", function (e) {
            $("#mCP").remove();
            $("#mLPD").remove();
            cws.crearPartida();
        });
    }
    this.mostrarCodigo = function (codigo) {
        let cadena = "Codigo de la partida: " + codigo;
        $("#codigo").append(cadena);

    }
    this.finPartida = function () {
        $("#codigo").remove();
        this.mostrarHome();  
    }
   

    this.mostrarAbandonarPartida = function (codigo) {
        $("#mAP").remove()
        var cadena = '<div class="row" id="mCP">';
        cadena = cadena + '<div class="col-12">'
        cadena = cadena + '<div class="card bg-light" style=" margin: auto auto" id="card-bienvenido">';
        cadena = cadena + '<div class="card-body">';
        cadena = cadena + '<button id="btnAP" class="btn btn-primary">Abandonar partida</button>';
        cadena = cadena + '</div></div>';
        cadena = cadena + '</div></div>';

        $("#abandonarPartida").append(cadena);
        $("#btnAP").on("click", function (e) {
            $("#mAP").remove();
            $("#mLPD").remove();
            $("#mH").remove();
            $("#codigo").remove();
            cws.abandonarPartida(codigo);
        });

    }

    this.mostrarListaDePartidas = function (lista) {
        $("#mLP").remove();
        var cadena = '<div class="row" id="mLP">';
        cadena = cadena + '<div class="col-8">';
        cadena = cadena + '<h2>Partidas</h2>';
        cadena = cadena + '<ul class="list-group">';


        for (i = 0; i < lista.length; i++) {
            cadena = cadena + '<li class="list-group-item">' + lista[i].codigo + ' Propietario: ' + lista[i].owner + '</li>';

        }
        cadena = cadena + "</ul>";
        cadena = cadena + '</div>';
        cadena = cadena + '</div>';
        $('#listaPartidas').append(cadena);
    }

    this.mostrarListaDePartidasDisponibles=function(lista){
		$('#mLPD').remove();
		let cadena="<div class='row' id='mLPD'>";
		cadena=cadena+"<div class='col'>";
        cadena = cadena + '<div class="card bg-light" style=" margin: auto auto" id="card-bienvenido">';
        cadena = cadena + '<div class="card-body">';
		cadena=cadena+"<h2>Lista de partidas disponibles</h2>";
		cadena=cadena+'<ul class="list-group">';
		for(i=0;i<lista.length;i++){
		    cadena = cadena+'<li class="list-group-item"><a href="#" value="'+lista[i].codigo+'"> Nick propietario: '+lista[i].owner+'</a></li>';
        }
		cadena=cadena+"</ul>";
		cadena=cadena+"</div></div>"
        cadena=cadena+"</div></div>"
		$('#listaPartidasDisp').append(cadena);

		$(".list-group a").click(function(){
	        codigo=$(this).attr("value");
   	
	        if (codigo){
	            $('#mLPD').remove();
	            $('#mCP').remove();
                cws.unirseAPartida(codigo);
	        }
	    });		
	}

    this.mostrarModal = function (msg) {
        $('#mM').remove();
        var cadena = "<p id='mM'>" + msg + "</p>";
        $('#contenidoModal').append(cadena);
        $('#miModal').modal("show");
       
    }


}
  