const express = require("express");
const app = (exports.app = express());

const db = require("./utils/db");
var bcrypt = require("./utils/bc");
const bodyParser = require("body-parser");
const csurf = require("csurf");
const helmet = require("helmet");

const hb = require("express-handlebars");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");
app.use(helmet());
app.use(express.static("./public"));

var cookieSession = require("cookie-session");
app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

app.use(
    require("body-parser").urlencoded({
        extended: false
    })
);

app.use(csurf());
//X-Frame-Options header to disallow framing of the page by unauthorized parties.
app.use(function(req, res, next) {
    res.setHeader("x-frame-options", "deny");
    res.locals.csrfToken = req.csrfToken();
    next();
});

// app.use((req, res, next) => {
//     if (!req.session.user_id && req.url != "/register" && req.url != "/login") {
//         res.redirect("/register");
//     } else {
//         next();
//     }
// });

// function requireLoggedOut(req, res, next) {
//     if (req.session.user_id) {
//         return res.redirect("/petition");
//     }
//     next();
// }
// function requireSignature(req, res, next) {
//     if (!req.session.signatureId) {
//         return res.redirect("/petition");
//     }
//     next();
// }
// function requireNoSignature(req, res, next) {
//     if (req.session.signatureId) {
//         return res.redirect("/petition/signed");
//     }
//     next();
// }

app.get("/", (req, res) => {
    res.redirect("/register");
});

app.get("/register", (req, res) => {
    //requireLoggedOut
    if (req.session.user_id) {
        res.redirect("/petition");
    } else {
        res.render("register", {
            title: "cereal first"
        });
    }
});

app.post("/register", (req, res) => {
    //requireLoggedOut
    bcrypt.hashPassword(req.body.password).then(hash => {
        // console.log(hash);
        return db
            .addUserInfo(req.body.first, req.body.last, req.body.email, hash)
            .then(results => {
                req.session.user_id = results.rows[0].id;
                // console.log("req.body:", req.body);
                // console.log("results", results);
                res.redirect("/profile");
            })
            .catch(err => {
                console.log("err in addUserInfo: ", err);
            });
    });
});

app.get("/profile", (req, res) => {
    res.render("profile", {});
});

app.post("/profile", (req, res) => {
    return db
        .createUserProfile(
            req.body.age,
            req.body.city,
            req.body.url,
            req.session.user_id
        )
        .then(() => {
            res.redirect("/petition");
        })
        .catch(err => {
            console.log("err in createUserProfile: ", err);
        });
});

app.get("/login", (req, res) => {
    // requireLoggedOut;
    if (!req.session.user_id) {
        res.render("login", {
            title: "cereal first"
        });
    } else {
        res.redirect("/petition");
    }
});

app.post("/login", (req, res) => {
    db.getUser(req.body.email).then(results => {
        console.log("/login:", results);
        if (!results.rows[0]) {
            return res.render("login", {
                title: "cereal first"
            });
        }
        return bcrypt
            .checkPassword(req.body.password, results.rows[0].password)
            .then(match => {
                if (match === true) {
                    console.log("hash pass:", results.rows[0].password);
                    req.session.user_id = results.rows[0].user_id;
                    req.session.sign_id = results.rows[0].sign_id;
                }
                if (req.session.sign_id) {
                    console.log(req.session.sign_id);
                    res.redirect("/petition/signed");
                } else {
                    res.redirect("/petition");
                }
            })
            .catch(err => {
                console.log("post /login error ", err);
            });
    });
});

app.get("/petition", (req, res) => {
    //requireNoSignature
    if (req.session.sign_id) {
        res.redirect("/petition/signed");
    } else {
        res.render("petition", {});
    }
});

app.post("/petition", (req, res) => {
    if (req.body.signature === "") {
        res.render("petition", {
            message: true
        });
    } else {
        db.addSignature(req.body.signature, req.session.user_id)
            .then(results => {
                req.session.sign_id = results.rows[0].id;
                res.redirect("/petition/signed");
            })
            .catch(err => {
                console.log("err in addSignature: ", err);
            });
    }
    //requireNoSignature
    //reading data from a cookie
    // req.sesstion;
    // console.log(req.session.id); //req.session is an object
    //putting data into a cookie
    // ****req.sesstion.loggedIn = true; When you want to end the session (i.e, log out the user), you can set req.session to null.***

    //    req.session.sigId = 58; hardcoded
    //---hardest part figure out the id that was just generated when the INSERT is successful

    // console.log(req.body);
});

app.get("/petition/signed", (req, res) => {
    let number;
    if (!req.session.sign_id) {
        res.redirect("/petition");
    } else {
        db.getNumber()
            .then(results => {
                number = results.rows;
                console.log("result number", number[0]);
                return db.getSignature(req.session.sign_id).then(results => {
                    console.log("signatureresults:", results);
                    res.render("signed", {
                        title: "cereal first",
                        image: results.rows[0].signature,
                        num: number[0].count
                    });
                });
            })
            .catch(err => {
                console.log("err in getNumber: ", err);
            });
    }
});
// step 3. pull out id 53 signature - the big url string
//once there is a big signature url in the route, you can render it on screen by
// putting it in an img tag

app.get("/petition/signers", (req, res) => {
    //requireSignature
    db.getUserProfiles()
        .then(results => {
            // console.log("results from getSignatures: ", results.rows);
            res.render("signers", {
                title: "cereal first",
                signers: results.rows
            });
        })
        .catch(err => {
            console.log("err in getUserProfiles: ", err);
        });
    // });
});

app.get("/petition/signers/:city", (req, res) => {
    // console.log(req.params);
    db.getSignersByCity(req.params.city)
        .then(results => {
            res.render("signers", {
                title: "cereal first",
                signers: results.rows
            });
        })
        .catch(err => {
            console.log("err in getSignersByCity:", err);
        });
});

app.get("/profile/edit", (req, res) => {
    db.editProfile(req.session.user_id)
        .then(results => {
            res.render("edit", {
                title: "cereal first",
                profile: results.rows[0]
            });
        })
        .catch(err => {
            console.log("err in editProfile:", err);
        });
});

app.post("/profile/edit", (req, res) => {
    let url;
    if (!req.body.url.startsWith("http")) {
        url = "http://" + req.body.url;
    } else {
        url = req.body.url;
        console.log("homepage:", url);
    }
    let changes;
    console.log("req.body:", req.body);
    if (req.body.password != "") {
        changes = [
            bcrypt
                .hashPassword(req.body.password)
                .then(hash =>
                    db.updateUserInfo(
                        req.session.user_id,
                        req.body.first,
                        req.body.last,
                        req.body.email,
                        hash
                    )
                ),
            db.updateProfileInfo(
                req.body.age,
                req.body.city,
                url,
                req.session.user_id
            )
        ];
    } else {
        changes = [
            db.updateUserInfo(
                req.session.user_id,
                req.body.first,
                req.body.last,
                req.body.email
            ),
            db.updateProfileInfo(
                req.body.age,
                req.body.city,
                url,
                req.session.user_id
            )
        ];
    }

    Promise.all(changes)
        .then(() => {
            res.redirect("/petition");
        })
        .catch(err => {
            console.log("err in edit profile:", err);
        });
});

app.post("/sigdelete", (req, res) => {
    db.deleteSignature(req.session.user_id)
        .then(() => {
            delete req.session.sign_id;
            res.redirect("/petition");
        })
        .catch(err => {
            console.log("sigdelete:", err);
        });
});

app.get("/petition/logout", function(req, res) {
    req.session = null;
    res.redirect("/login");
});

// ------ demo routes
app.get("/home", (req, res) => {
    res.send("<h1>welcome to my website!<h1>");
});

app.get("/product", (req, res) => {
    res.send(`<html>
<h1>buy my product</h1>
<form method= 'POST'>
    <button>yes</button>
    </form>
    </html>`);
});

app.post("/product", (req, res) => {
    req.session.wouldLikeToBuy = true;
    res.redirect("/home");
});

// ------ end demo routes
if (require.main == module) {
    app.listen(process.env.PORT || 8080, () => console.log("listening"));
}
