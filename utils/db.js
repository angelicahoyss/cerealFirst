let spicedPg = require("spiced-pg");
let db;

if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg("postgres:postgres:postgres@localhost:5432/signatures");
}

exports.getSignatures = function getSignatures() {
    return db.query("SELECT * FROM signatures");
};
//$1 syntax is used to prevent a type of attack called SQl injection!
exports.addSignature = function addSignature(first, last, signature) {
    return db.query(
        "INSERT INTO signatures(signature) VALUES($3) RETURNING id",
        [signature]
    );
};
exports.getNumber = function getNumber() {
    return db.query("SELECT COUNT(*) FROM signatures");
};

exports.getSignature = function getSignature(id) {
    return db.query("SELECT signature FROM signatures WHERE id =" + id);
};

exports.addUserInfo = function addUserInfo(first, last, email, password) {
    return db.query(
        "INSERT INTO users(first, last, email, password) VALUES($1, $2, $3, $4) RETURNING id",
        [first, last, email, password]
    );
};

exports.getPassword = function getPassword(email) {
    return db.query("SELECT email, password from users WHERE email=" + email);
};
