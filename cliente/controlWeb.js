function ControlWeb() {
	this.recuperarSesion = function () {
	  usuario = $.cookie("nick");
	  if (!usuario) {
		this.limpiarPantalla();
		this.mostrarAgregarUsuario();
		return;
	  }
	  rest.agregarUsuarioDesdeCookie(usuario);
	};
  
	this.recuperarSesionCallback = function () {
	  this.mostrarHome();
	  partida = $.cookie("codigoP");
	  if (partida) {
		this.mostrarPartidaUnido(partida);
	  }
	};
	this.mostrarAgregarUsuario = function () {
	  var cadena = '<div id="mAU"><h2>Inicio de Sesión</h2><div class="row" >'; //'<form class="form-row needs-validation"  id="mAU">';
	  cadena = cadena + '<div class="col"><h2>El juego indefinido</h2></div>';
	  cadena = cadena + '<div class="row">';
	  cadena = cadena + '<div class="row">';
	  cadena =
		cadena +
		'<input type="text" class="form-control mb-2 mr-sm-2" id="usr" placeholder="Introduce tu nick (max 6 letras)" required></div>';
	  cadena = cadena + '<div class="col">';
	  cadena =
		cadena +
		'<button id="btnAU" class="btn btn-primary mb-2 mr-sm-2">Iniciar sesión</button>';
	  //cadena=cadena+'<a href="/auth/google" class="btn btn-primary mb-2 mr-sm-2">Accede con Google</a>';
	  cadena = cadena + "</div></div>"; //' </form>';
	  cadena = cadena + '<div id="nota"></div></div>';
  
	  $("#agregarUsuario").append(cadena);
	  //$("#nota").append("<div id='aviso' style='text-align:right'>Inicia sesión con Google para jugar</div>");
  
	  $("#btnAU").on("click", function (e) {
		if ($("#usr").val() === "" || $("#usr").val().length > 6) {
		  e.preventDefault();
		  $("#nota").text("Nick inválido");
		} else {
		  var nick = $("#usr").val();
		  $("#mAU").remove();
		  $("#aviso").remove();
		  rest.agregarUsuario(nick);
		}
	  });
	};
  
	this.mostrarHome = function () {
	  var cli = this;
  
	  $("#mHin").remove();
	  var cadena =
		"<div class = 'row' id='mHin'>" +
		"<div class='col'>" +
		"<h2>Bienvenido " +
		$.cookie("nick") +
		"</h2>" +
		"<div id='partida'>" +
		"</div>" +
		"</div>";
	  $("#mH").append(cadena);
	  this.mostrarCrearPartida();
	  this.mostrarListaDePartidas();
  
	  var cadenaCerrarSesion =
		"<button id='btnLO' class='btn btn-primary mb-2 mr-sm-2'>Cerrar Sesión</button>";
	  $("#logOut").html(cadenaCerrarSesion);
  
	  $("#btnLO").on("click", function (e) {
		cws.eliminarUsuario($.cookie("nick"));
	  });
	};
  
	this.mostrarCrearPartida = function () {
	  //Dibujar un botón que al hacer click llame a crear partida
	  $("mCP").remove();
	  var cadena =
		"<div class='row' id='mCP'>" +
		"<div class='col'>" +
		"<button id='btnAP' class='btn btn-primary mb-2 mr-sm-2'>Crear Partida</button>" +
		"</div>" +
		"</div>";
	  $("#crearPartida").html(cadena);
  
	  $("#btnAP").on("click", function (e) {
		cws.crearPartida($.cookie("nick"));
	  });
	};
  
	this.mostrarPartidaUnido = (codigo) => {
	  if (!codigo || codigo === "null") return;
  
	  $("#mCP").remove();
	  $("#cP").remove();
	  $("#partida").html("");
  
	  let cadenaCodigo = "<div id='codigo'></div>";
	  let cadenaBoton = "<div id='SP'></div>";
	  $("#partida").append(cadenaCodigo);
	  $("#partida").append(cadenaBoton);
  
	  this.mostrarCodigo(codigo);
	  this.mostrarBotonSalirPartida(codigo);
	};
  
	this.mostrarCodigo = function (codigo) {
	  if (codigo) {
		var cadena =
		  "<div id='cP'><p> Código de la partida: " + codigo + "</p></div>";
		$("#codigo").append(cadena);
	  }
	};
  
	this.mostrarBotonSalirPartida = function (codigo) {
	  var cadena =
		"<button  id='btnSP' class='btn btn-warning btn-labeled mb-2 mr-sm-2'>Salir Partida</button> ";
  
	  $("#SP").append(cadena);
  
	  $("#btnSP").on("click", function (e) {
		cws.salirPartida($.cookie("nick"), codigo);
		//Salir partida
		console.log("Salir partida");
	  });
	};
  
	this.limpiarListaDePartidas = function () {
	  $("#mLP").remove();
	};
  
	this.mostrarListaDePartidas = function () {
	  this.limpiarListaDePartidas();
	  var cadena =
		"<div class='col' id='mLP'>" +
		"<button  id='btnRP' class='btn btn-info btn-labeled mb-2 mr-sm-2'><span class='btn-label'><i class='fa fa-refresh'></i></span> Refrescar</button> " +
		"<div class='row'>" +
		"<ul class='list-group' id='LP'></ul></div>" +
		"</div>";
  
	  $("#listaPartidas").append(cadena);
  
	  $("#btnRP").on("click", function (e) {
		// $("#mCP").remove();
		$("#LP").html("");
		rest.obtenerPartidasDisponibles();
	  });
  
	  rest.obtenerPartidasDisponibles();
	};
  
	this.mostrarListaDePartidasCallback = function (partidas) {
	  $(".linea-partida").remove();
  
	  for (partida of partidas) {
		var cadena =
		  "<li class='linea-partida list-group-item'><span>" +
		  "Código: " +
		  partida.codigo +
		  "</span>  " +
		  "<span>" +
		  "Propietario:" +
		  partida.owner +
		  "</span>" +
		  "<button id='btnUP' data-value='" +
		  partida.codigo +
		  "'" +
		  " class='btn btn-secondary mb-2 mr-sm-2 m-2'>Unir a Partida</button>" +
		  "</li>";
		$("#LP").append(cadena);
  
		$("#btnUP").on("click", function (e) {
		  var codigo = $(this).data("value");
		  cws.unirAPartida($.cookie("nick"), codigo);
		});
	  }
	};
  
	this.mostrarModal = function (msg) {
	  $("#mM").remove();
	  var cadena = "<p id='mM'>" + msg + "</p>";
	  $("#contenidoModal").html(cadena);
	  $("#miModal").modal("show");
	};
  
	this.limpiarPantalla = function () {
	  $("#mCP").remove();
	  $("#cP").remove();
	  $("#mLP").remove();
	  $("#btnLO").remove();
	  $("#btnAP").remove();
	  $("#mHin").remove();
	  $("#mAU").remove();
	  $("#LP").html("");
	};
  }
  