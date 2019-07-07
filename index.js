const express = require("express");
const app = express();

const db = require("./utils/db");
const bodyParser = require("body-parser");

const hb = require("express-handlebars");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(express.static("./public"));

app.use(
    require("body-parser").urlencoded({
        extended: false
    })
);

app.get("/", (req, res) => {
    res.redirect("/petition");
});

app.get("/petition", (req, res) => {
    res.render("petition", {});
});

app.post("/petition", (req, res) => {
    // console.log(req.body);
    db.addSignature(req.body.first, req.body.last, req.body.signature)
        // console.log(req.body)
        .then(() => {
            res.redirect("/petition/signed");
        })
        .catch(err => {
            console.log("err in addSignature: ", err);
        });
});

app.get("/petition/signed", (req, res) => {
    db.getNumber().then(results => {
        res.render("signed", {
            signers: results.rows
        });
        console.log("results from getNumber: ", results.rows);
    });
});

app.get("/petition/signers", (req, res) => {
    db.getSignatures().then(results => {
        // console.log("results from getSignatures: ", results.rows);
        res.render("signers", {
            signatures: results.rows
        });
    });
});

app.listen(8080, () => console.log("jules!"));
