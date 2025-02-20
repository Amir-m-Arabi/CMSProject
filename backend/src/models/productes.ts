import { trim } from "lodash";
import mongoose from "mongoose";


const producteInfo = new mongoose.Schema({
    adminName : {
        type:String,
        trim:true,
        required:true,
        minLength:4
    },
    producteName : {
        type:String,
        minLength:4,
        maxLength:40,
        trim:true,
        required:true
    },
    inventory : {
        type:String,
        default:"Finished",
        trim:true
    },
    productePrice : {
        type:String,
        trim:true,
        required:true
    },
    imageUrl : {
        type:String,
        required:true
    }
})

const producteModel = mongoose.model("Productes" , producteInfo)

export const saveProducteInfo = (values:Record <string , any>) =>{
    new producteModel(values).save().then((producte) => producte.toObject())
}

export const getProducteInfo = (adminName:String) => producteModel.find({adminName})

export const deleteProducteInfo = (adminName:String , producteName:String) => producteModel.findOneAndDelete({adminName , producteName})
export const updateProducteInfo = (adminName:String , info:String) => producteModel.findOneAndUpdate({adminName , info})