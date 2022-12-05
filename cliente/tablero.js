function Tablero(size) {
  this.size = size;
  this.nombreBarco;
  this.orientacion = "Horizontal";
  this.placingOnGrid = false;
  this.flota = [];

  this.anadirCallbacksBarcos = function () {
    var playerRoster = document
      .querySelector(".fleet-roster")
      .querySelectorAll("li");
    for (var i = 0; i < playerRoster.length; i++) {
      playerRoster[i].self = this;
      playerRoster[i].addEventListener("click", this.rosterListener, false);
    }
    var computerCells = document.querySelector(".computer-player").childNodes;
    for (var j = 0; j < computerCells.length; j++) {
      computerCells[j].self = this;
      computerCells[j].addEventListener("click", this.shootListener, false);
    }
  };

  this.mostrar = function (si) {
    let listaBarcos = document.getElementById("lista-barcos");
    let html = "";

    let id = 0;
    for (const barco of this.flota) {
      html += `<li id=${id}>b${barco.tamano}</li>`;
      id++;
    }

    listaBarcos.innerHTML = html;
    this.anadirCallbacksBarcos();

    let x = document.getElementById("tablero");
    if (si) {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  };
  this.ini = function () {
    const botonLimpiarTablero = document.querySelector("#limpiarTablero");
    botonLimpiarTablero.self = this;
    botonLimpiarTablero.addEventListener("click", this.limpiarTablero, false);

    const botonCambiarOrientacion = document.querySelector(
      "#cambiarOrientacion"
    );
    botonCambiarOrientacion.self = this;
    botonCambiarOrientacion.addEventListener(
      "click",
      this.orientacionListener,
      false
    );

    const botondesplegarBarcos = document.querySelector("#desplegarBarcos");
    botondesplegarBarcos.self = this;
    botondesplegarBarcos.addEventListener(
      "click",
      this.desplegarListener,
      false
    );

    var humanCells = document.querySelector(".human-player").childNodes;
    for (var k = 0; k < humanCells.length; k++) {
      humanCells[k].self = this;
      humanCells[k].addEventListener("click", this.placementListener, false);
      //humanCells[k].addEventListener('mouseover', this.placementMouseover, false);
      //humanCells[k].addEventListener('mouseout', this.placementMouseout, false);
    }
    this.anadirCallbacksBarcos();
  };

  this.orientacionListener = function (e) {
    self = e.target.self;
    self.cambiarOrientacion();
    $("#cambiarOrientacion").text("Orientación: " + self.orientacion);
  };

  this.cambiarOrientacion = () => {
    if (this.orientacion == "Horizontal") {
      this.orientacion = "Vertical";
    } else {
      this.orientacion = "Horizontal";
    }
  };

  this.limpiarTablero = () => {
    cws.limpiarTablero();
  };

  this.desplegarListener = () => {
    cws.barcosDesplegados();
  };

  this.placementListener = function (e) {
    self = e.target.self;
    if (self.placingOnGrid) {
      // Extract coordinates from event listener
      var x = parseInt(e.target.getAttribute("data-x"), 10);
      var y = parseInt(e.target.getAttribute("data-y"), 10);

      // Don't screw up the direction if the user tries to place again.
      self.colocarBarco(x, y, self.nombreBarco, self.orientacion);
    }
  };
  this.endPlacing = function (shipType) {
    const shipPlace = document.getElementById(shipType);
    shipPlace.setAttribute("class", "placed");
    shipPlace.placingOnGrid = false;
  };

  this.resumeReplacement = function () {
    const shipsPlace = document
      .querySelector(".fleet-roster")
      .querySelectorAll("li");

    for (var i = 0; i < shipsPlace.length; i++) {
      var shipPlace = shipsPlace[i];
      shipPlace.setAttribute("class", "");
      shipPlace.placingOnGrid = true;
    }
  };

  this.rosterListener = function (e) {
    var self = e.target.self;
    var cli = this;
    // Remove all classes of 'placing' from the fleet roster first
    var roster = document.querySelectorAll(".fleet-roster li");
    for (var i = 0; i < roster.length; i++) {
      var classes = roster[i].getAttribute("class") || "";
      classes = classes.replace("placing", "");
      roster[i].setAttribute("class", classes);
    }

    // Set the class of the target ship to 'placing'
    self.nombreBarco = e.target.getAttribute("id");
    document.getElementById(self.nombreBarco).setAttribute("class", "placing");
    //Game.placeShipDirection = parseInt(document.getElementById('rotate-button').getAttribute('data-direction'), 10);
    self.placingOnGrid = true;
  };
  this.colocarBarco = function (x, y, nombre, orientacion) {
    //comprobar límites
    console.log("Colocando barco: " + x + "-" + y + " " + nombre);
    idBarco = parseInt(nombre);
    cws.colocarBarco(idBarco, x, y, orientacion);

    return true;
  };

  this.barcoColocado = function (barco, x, y, orientacion) {
    if (orientacion.toLowerCase() === "horizontal") {
      for (var i = 0; i < this.flota[barco].tamano; i++) {
        console.log("x: " + (x + i) + " y:" + y);
        this.updateCell(x + i, y, "ship", "human-player");
      }
    } else if (orientacion.toLowerCase() === "vertical") {
      for (var j = 0; j < this.flota[barco].tamano; j++) {
        console.log("x: " + x + " y:" + (y + j));
        this.updateCell(x, y + j, "ship", "human-player");
      }
    }

    self.endPlacing(barco);
  };

  this.shootListener = function (e) {
    var x = parseInt(e.target.getAttribute("data-x"), 10);
    var y = parseInt(e.target.getAttribute("data-y"), 10);
    console.log("disparo x: " + x + " y: " + y);
    cws.disparar(x, y);
  };
  this.updateCell = function (x, y, type, target) {
    var player = target; //'human-player';
    // if (targetPlayer === CONST.HUMAN_PLAYER) {
    // 	player = 'human-player';
    // } else if (targetPlayer === CONST.COMPUTER_PLAYER) {
    // 	player = 'computer-player';
    // } else {
    // 	// Should never be called
    // 	console.log("There was an error trying to find the correct player's grid");
    // }

    // switch (type) {
    // 	case CONST.CSS_TYPE_EMPTY:
    // 		this.cells[x][y] = CONST.TYPE_EMPTY;
    // 		break;
    // 	case CONST.CSS_TYPE_SHIP:
    // 		this.cells[x][y] = CONST.TYPE_SHIP;
    // 		break;
    // 	case CONST.CSS_TYPE_MISS:
    // 		this.cells[x][y] = CONST.TYPE_MISS;
    // 		break;
    // 	case CONST.CSS_TYPE_HIT:
    // 		this.cells[x][y] = CONST.TYPE_HIT;
    // 		break;
    // 	case CONST.CSS_TYPE_SUNK:
    // 		this.cells[x][y] = CONST.TYPE_SUNK;
    // 		break;
    // 	default:
    // 		this.cells[x][y] = CONST.TYPE_EMPTY;
    // 		break;
    // }
    var classes = ["grid-cell", "grid-cell-" + x + "-" + y, "grid-" + type];
    document
      .querySelector("." + player + " .grid-cell-" + x + "-" + y)
      .setAttribute("class", classes.join(" "));
  };
  this.createGrid = function () {
    var gridDiv = document.querySelectorAll(".grid");

    for (var grid = 0; grid < gridDiv.length; grid++) {
      //gridDiv[grid].removeChild(gridDiv[grid].querySelector('.no-js')); // Removes the no-js warning
      let myNode = gridDiv[grid];
      while (myNode.lastElementChild) {
        myNode.removeChild(myNode.lastElementChild);
      }
      for (var i = 0; i < this.size; i++) {
        for (var j = 0; j < this.size; j++) {
          var el = document.createElement("div");
          el.setAttribute("data-x", j);
          el.setAttribute("data-y", i);
          el.setAttribute("class", "grid-cell grid-cell-" + j + "-" + i);
          gridDiv[grid].appendChild(el);
        }
      }
    }
    this.ini();
  };

  this.limpiarGrid = function () {
    this.createGrid();
    this.resumeReplacement();
  };
  this.createGrid();
  this.mostrar(false);


}
