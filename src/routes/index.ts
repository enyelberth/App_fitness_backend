import express from "express";
const Producto = require("./product.routes");

const rutas = express.Router();

rutas.get('/ping',(_req, res)=>{
    console.log('Probando Ping');
    res.send('PINh11111111');
});
rutas.get('/productos',Producto);


module.exports =rutas;
