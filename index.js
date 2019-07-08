const express = require("express");
const app = express();

const db = require("./utils/db");
const bodyParser = require("body-parser");

const hb = require("express-handlebars");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

//step 1 configure cookie session
var cookieSession = require("cookie-session");
app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

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
    //reading data from a cookie
    // req.sesstion;
    // console.log(req.session.id); //req.session is an object
    //putting data into a cookie
    // ****req.sesstion.loggedIn = true; When you want to end the session (i.e, log out the user), you can set req.session to null.***

    //    req.session.sigId = 58; hardcoded
    //---hardest part figure out the id that was just generated when the INSERT is successful

    // console.log(req.body);
    db.addSignature(req.body.first, req.body.last, req.body.signature)
        .then(results => {
            req.session.userId = results.rows[0].id;
            console.log(req.session);
            res.redirect("/petition/signed");
        })
        .catch(err => {
            console.log("err in addSignature: ", err);
        });
});

app.get("/petition/signed", (req, res) => {
    let number;
    db.getNumber()
        .then(results => {
            number = results.rows;
            console.log("result number", number[0]);
            return db.getSignature(req.session.userId).then(results => {
                console.log("signatureresults:", results);
                res.render("signed", {
                    image: results.rows[0].signature,
                    num: number[0].count
                });
            });
        })
        .catch(err => {
            console.log("err in getNumber: ", err);
        });
    // console.log("results from getNumber: ", results.rows);
});

// step 3. pull out id 53 signature - the big url string
//once there is a big signature url in the route, you can render it on screen by
// putting it in an img tag

app.get("/petition/signers", (req, res) => {
    db.getSignatures().then(results => {
        // console.log("results from getSignatures: ", results.rows);
        res.render("signers", {
            signatures: results.rows
        }).catch(err => {
            console.log("err in addSignature: ", err);
        });
        console.log("results from getSignatures: ", results.rows);
    });
});

app.listen(8080, () => console.log("jules!"));
