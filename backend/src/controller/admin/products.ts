import express from 'express'
import dotenv from 'dotenv'
import { PrismaClient } from "@prisma/client"
import { sign } from 'crypto'
const {body , validationResult} = require('express-validator')
import upload from 'helpers/uploads'

const prisma = new PrismaClient()
dotenv.config()

export const Create_Product = [
    body("name").notEmpty().withMessage("Name is required")
    .isLength({min:2 ,max:50}).withMessage("The name must be a maximum of 50 characters!"),

    body("description").optional().notEmpty().withMessage("Description is required"),

    body("price").notEmpty().withMessage("Price is required")
    .isNumeric().withMessage("Price must be a number"),

    body("image").optional().notEmpty().withMessage("Image is required"),

    body("inventory").notEmpty().withMessage("Inventory is required")
    .isNumeric().withMessage("Inventory must be a number"),
]

export async function createProduct(req: express.Request, res: express.Response):Promise<any>{
    const error = validationResult(req)
    if (!error.isEmpty()){
        return res.status(400).json({error : error.array()})
    }
    upload.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Failed to upload image' })
        }

        try{
            if (!req.file) {
                return res.status(400).json({ message: 'Image is required' })
            }

            const { name, description, price, inventory } = req.body
            console.log(`/uploads/${req.file.filename}`)
            const imageUrl = `/uploads/${req.file.filename}`

            const addProduct = await prisma.product.create({
                data: {
                    name,
                    description,
                    price,
                    image: imageUrl,
                    inventory,
                    adminId: Number(req.userId)
                }
            })

            if (!addProduct){
                return res.status(400).json({ message: 'Failed to create product' })
            }

            return res.status(201).json({ message: 'Product created successfully' })

        }catch(err){
            console.log(err)
            return res.status(500).json({ message: 'Image Saving Error' , error:err.message })
        }
    })}

    export async function getAllProducts(req: express.Request, res: express.Response):Promise<any>{
        const error = validationResult(req)
        if (!error.isEmpty()){
            return res.status(400).json({error : error.array()})
        }

        const gettAllProducts = await prisma.product.findMany({
            where : {
                adminId: Number(req.userId)
            }
        })

        if (!gettAllProducts){
            return res.status(400).json({ message: 'Failed to get products' })
        }

        return res.status(200).json({ message: 'Products retrieved successfully' , data:gettAllProducts })
    }

export async function updateProduct(req: express.Request, res: express.Response):Promise<any>{
    const error = validationResult(req)
    if (!error.isEmpty()){
        return res.status(400).json({error : error.array()})
    }

    const { id } = req.params

    const getImageOfProductById = await prisma.product.findUnique({
        where : { id : Number(id)},
        select : {
            image : true
        }
    })

    if (!getImageOfProductById){
        return res.status(400).json({message : ""})
    }

    upload.single('image')(req , res , async (err) => {
        if (err){
            console.log("Eroor:" , err)
            return res.status(400).json({message : "" , error : err.message})
        }

        try {
            if (!req.file){
                return res.status(400).json({message: ""})
            }

            const { name, description, price, inventory } = req.body

            if (!name || !description || !price || inventory!) {
                return res.status(400).json({})
            }

            console.log(`/uploads/${req.file.filename}`)
            const imageUrl = `/uploads/${req.file.filename}`

            const update = await prisma.product.updateMany({
                where: {
                    id : Number(id)
                },
                data : {
                name,
                description,
                image : imageUrl,
                price,
                inventory
                }
            })

            if (!update){
                return res.status(400).json({ message: 'Failed to create product' })
            }

            return res.status(201).json({ message: 'Product created successfully' })

        }catch(error){
            console.log(error)
            return res.status(500).json({message: "" , error : error.message})
        }
    })
}

