import express from "express";
import { Request, Response } from 'express';

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }))

app.set("view engine", "ejs");

const Document = require("./models/document")
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/fastebin")

app.get("/", (req: Request, res: Response) => {

    const code = `Welcome to FasteBin!

    Use the commands on the top right corner
    to create a new file to share with others.`
    res.render("code-display", {code, lineNumber: code.split("\n").length, language: "plaintext"})
})

app.get("/new", (req: Request, res: Response) => {
    res.render("new");
})

app.post("/save", async (req: Request, res: Response) => {
    const value = req.body.value;

    try {
        
        const document = await Document.create({value});
        res.redirect(`/${document.id}`);

    } catch (error) {
        //If there is an error the value submitted will be displayed again
        res.render("new", { value })
    }
})

app.get("/:id", async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        const document = await Document.findById(id);
        res.render("code-display", {code: document.value, lineNumber: document.value.split("\n").length, id});
        
    } catch (error) {
        res.redirect("/");
    }
})

app.get("/:id/duplicate", async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        const document = await Document.findById(id);
        res.render("new", {value: document.value, lineNumber: document.value.split("\n").length});
        
    } catch (error) {
        res.redirect(`/${id}`);
    }
})

app.listen(3000, () => console.log("app started"));