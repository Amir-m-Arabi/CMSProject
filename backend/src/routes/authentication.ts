import express from 'express';
import { SignIn, LogIn, status } from '../controller/authentication';
import { tokenValidationMiddleware } from '../middleware/tokenValidation';
import { signIn, logIn , resetPassword , sendToEmail } from '../controller/authentication';

export default (router : express.Router) => {
    router.get("/status" , tokenValidationMiddleware , status)
    router.post("/signIn" , SignIn,  signIn)
    router.post("/logIn", LogIn , logIn)
    router.get("/resetPassword" , sendToEmail)
    router.put("/resetPassword" , tokenValidationMiddleware , resetPassword)
}