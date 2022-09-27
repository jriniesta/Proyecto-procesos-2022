describe("El juego...", function() {
  var miJuego;
  var usr1,usr2;

  beforeEach(function() {
    miJuego=new Juego();
        miJuego.agregarUsuario("Pepe");
        miJuego.agregarUsuario("Luis");
        usr1=miJuego.usuarios["Pepe"];
        usr2=miJuego.usuarios["Luis"];
  });

  it("inicialmente", function() {
    let lista=miJuego.obtenerPartidas();
    expect(lista.lenght).toEqual(0);
    expect(usr1.nick).toEqual("Pepe");
    expect(usr2.nick).toEqual("Luis");
  });

});
