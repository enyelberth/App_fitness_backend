import express,{ Request,Response } from "express";
// import { CreateNewProducto, getProduct } from "../services/productService";

import { getProducts,CreateNewProducto } from "./productService";

export const GetProducts = async (_req:Request,res:Response)=>{
    const user = await getProducts();
    res.json(user);
};
export const getOneProduct = async(_req:Request,res:Response)=>{
    res.send("Obteniendo un product");
};
export const createNewProduct = async (req:Request,res:Response)=>{
    // const dato = req.body;
    // console.log(req.body.title)
    const dato = req.body;
    // console.log(dato);
    const user = await CreateNewProducto(dato);
    // res.send(dato);
   
    res.send(user);
    console.log("Se registro correctamente a ${user.}");
};
export const updateProduct = ()=>{
    return 'el usuario Asido actializado';
};
export const deleteProduct = ()=>{
    return 'el usuario as sido eliminado';   
};