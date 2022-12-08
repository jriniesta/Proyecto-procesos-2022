function Tablero() {
  this.placingOnGrid = false;
  this.nombreBarco = undefined;
  this.flota;
 
  this.ini = function () {
      
      var humanCells = document.querySelector('.human-player').childNodes;
      for (var k = 0; k < humanCells.length; k++) {
          humanCells[k].self = this;
          humanCells[k].addEventListener('click', this.placementListener, false);
      }
      var playerRoster = document.querySelector('.fleet-roster').querySelectorAll('li');

      for (var i = 0; i < playerRoster.length; i++) {
          playerRoster[i].self = this;
          playerRoster[i].addEventListener('click', this.rosterListener, false);
      }

      var computerCells = document.querySelector('.computer-player').childNodes;
      for (var j = 0; j < computerCells.length; j++) {
          computerCells[j].self = this;
          computerCells[j].addEventListener('click', this.shootListener, false);
      }
  }
  this.rosterListener = function (e) {
      var self = e.target.self;
      var roster = document.querySelectorAll('.fleet-roster li');

      for (var i = 0; i < roster.length; i++) {
          var classes = roster[i].getAttribute('class') || '';
          classes = classes.replace('placing', '');
          roster[i].setAttribute('class', classes);
      }

      self.nombreBarco = e.target.getAttribute('id');
      document.getElementById(self.nombreBarco).setAttribute('class', 'placing');
      //Game.placeShipDirection = parseInt(document.getElementById('rotate-button').getAttribute('data-direction'), 10);
      self.placingOnGrid = true;
  };
  // Creates click event listeners on the human player's grid to handle
  this.placementListener = function (e) {
      var self = e.target.self;
      if (self.placingOnGrid) {
          // Extract coordinates from event listener
          var x = parseInt(e.target.getAttribute('data-x'), 10);
          var y = parseInt(e.target.getAttribute('data-y'), 10);
          //console.log("Barco: " + self.nombreBarco + " x: " + x + " y: " + y);
          // Don't screw up the direction if the user tries to place again.
          //var successful = 
          self.colocarBarco(self.nombreBarco, x, y);
          //if (successful) {
          //     // Done placing this ship

          //self.endPlacing(Game.placeShipType);
          //self.placingOnGrid = false;

          /*if (self.areAllShipsPlaced()) {
              var el = document.getElementById('rotate-button');
              el.addEventListener(transitionEndEventName(), (function () {
                  el.setAttribute('class', 'hidden');
                  if (gameTutorial.showTutorial) {
                      document.getElementById('start-game').setAttribute('class', 'highlight');
                  } else {
                      document.getElementById('start-game').removeAttribute('class');
                  }
              }), false);
              el.setAttribute('class', 'invisible');
          } */
          //}
      }
  };

  this.endPlacing = function (shipType) {
      document.getElementById(shipType).setAttribute('class', 'placed');

      // Wipe out the variable when you're done with it
      //Game.placeShipDirection = null;
      this.nombreBarco = '';
      //Game.placeShipCoords = [];
  };
  this.colocarBarco = function (nombre, x, y) {
      //console.log("Barco: " + nombre + " x: " + x + " y: " + y);
      cws.colocarBarco(nombre, x, y);
      cws.barcosDesplegados();
      //return true;
  }

  this.disparo = function (x, y) {
      cws.disparar(x, y);
  }
  this.puedesDisparar = function (estado, x, y, targetPlayer) {

      if (estado == 'agua') {
          this.updateCell(x, y, 'agua', targetPlayer);
      } else if (estado == 'tocado') {
          this.updateCell(x, y, 'tocado', targetPlayer);

      } else {
          this.updateCell(x, y, 'hundido', targetPlayer);
      }
      this.placingOnGrid = false;
  };

  this.shootListener = function (e) {
      var self = e.target.self;
      // Extract coordinates from event listener
      var x = parseInt(e.target.getAttribute('data-x'), 10);
      var y = parseInt(e.target.getAttribute('data-y'), 10);


      self.disparo(x, y);
  };
  this.mostrarTablero = function () {

  }
  this.puedesColocarBarco = function (barco, x, y, desplegados) {

      for (i = 0; i < barco.tam; i++) {
          this.updateCell(x + i, y, 'ship', 'human-player');
      }
      this.placingOnGrid = false;
      this.endPlacing(barco.nombre);



  }
  // Updates the cell's CSS class based on the type passed in
  this.updateCell = function (x, y, type, targetPlayer) {
      var player = targetPlayer;
      var classes = ['grid-cell', 'grid-cell-' + x + '-' + y, 'grid-' + type];
      document.querySelector('.' + player + ' .grid-cell-' + x + '-' + y).setAttribute('class', classes.join(' '));
  };
  this.crearGrid = function () {
      var gridDiv = document.querySelectorAll('.grid');
      for (var grid = 0; grid < gridDiv.length; grid++) {
          //gridDiv[grid].removeChild(gridDiv[grid].querySelector('.no-js')); // Removes the no-js warning
          for (var i = 0; i < 10; i++) {
              for (var j = 0; j < 10; j++) {
                  var el = document.createElement('div');
                  el.setAttribute('data-x', j);
                  el.setAttribute('data-y', i);
                  el.setAttribute('class', 'grid-cell grid-cell-' + j + '-' + i);
                  gridDiv[grid].appendChild(el);
              }
          }
      }
  }
  this.mostrarTablero = function(flag){
      let tab = document.getElementById("tablero");
      if (flag) {
          tab.style.display = "block";
      } else {
          tab.style.display = "none";
      }
  };
  //Constructor
  this.crearGrid();
  this.ini();


}
