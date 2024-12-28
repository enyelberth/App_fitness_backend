import express,{ Request,Response } from "express";
// import { CreateNewProducto, getProduct } from "../services/productService";

import {ProductService} from "./productService";

const producto = new ProductService()
export const GetProducts = async (_req:Request,res:Response)=>{
    const user = await producto.getProducts();
    res.json(user);
};
export const getOneProduct = async(_req:Request,res:Response)=>{
    res.send("Obteniendo un product");
};
export const CreateNewProduct = async (req:Request,res:Response)=>{
        
        
        const dato = req.body;
        console.log("Asdad")
        console.log(req.body.title)
        // const dato = req.body;
        console.log(dato);
        const user = await producto.createNewProduct(dato);
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