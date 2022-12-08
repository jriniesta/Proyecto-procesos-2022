const express = require("express");
const fs = require("fs");
const app = express();

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const modelo = require("./servidor/modelo.js");
const sWS = require("./servidor/servidorWS.js");

const PORT = process.env.PORT || 3000;

let juego = new modelo.Juego();
let servidorWS = new sWS.ServidorWS();
/*
"/"
"/obtenerPartidas"
"/agregarUsuario/:nick"
...
*/

app.use(express.static(__dirname + "/"));

app.get("/", (req, res) => {
  const contenido = fs.readFileSync(__dirname + "/cliente/index.html");
  res.setHeader;
  "Content-type", "text/html";
  res.send(`${contenido}`);
});

app.get("/leerUsuario/:nick", (req, res) => {
  let nick = req.params.nick;
  let usuario = juego.usuarios[nick];
  let output = { nick: usuario ? usuario.nick : -1 };
  res.send(output);
});

app.get("/agregarUsuario/:nick", (req, res) => {
  let nick = req.params.nick;
  let nuevoUsuario = juego.agregarUsuario(nick);
  let output = { nick: nuevoUsuario ? nuevoUsuario.nick : -1 };
  res.send(output);
});

app.get("/crearPartida/:nick", (req, res) => {
  let nick = req.params.nick;
  let codigoPartida = juego.crearPartidaNick(nick);
  res.send({ partida: codigoPartida });
});

app.get("/unirAPartida/:codigo/:nick", (req, res) => {
  let codigo = req.params.codigo;
  let nick = req.params.nick;
  let codigoPartida = juego.unirAPartidaNick(codigo, nick);
  res.send({ seHaUnido: codigoPartida });
});

app.get("/obtenerPartidas", (req, res) => {
  let partidas = juego.obtenerPartidas();
  res.send(partidas);
});

app.get("/obtenerPartidasDisponibles", (req, res) => {
  let partidas = juego.obtenerPartidasDisponibles();
  res.send(partidas);
});

server.listen(PORT, () => {
  console.log(`Express 👂 puerto ${PORT}`);
  console.log(`http://localhost:${PORT}`);
  console.log("Presiona Ctrl+C para salir.");
});

servidorWS.lanzarServidorWS(io, juego);
