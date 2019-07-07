let spicedPg = require("spiced-pg");

let db = spicedPg("postgres:postgres:postgres@localhost:5432/signatures");

exports.getSignatures = function getSignatures() {
    return db.query("SELECT * FROM signatures");
};
//$1 syntax is used to prevent a type of attack called SQl injection!
exports.addSignature = function addSignature(first, last, signature) {
    return db.query(
        "INSERT INTO signatures(first, last, signature) VALUES($1, $2, $3)",
        [first, last, signature]
    );
};
exports.getNumber = function getNumber() {
    return db.query("SELECT COUNT(*) FROM signatures");
};
