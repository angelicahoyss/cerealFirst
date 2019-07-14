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
exports.addSignature = function addSignature(signature, user_id) {
    return db.query(
        "INSERT INTO signatures(signature, user_id) VALUES($1, $2) RETURNING id",
        [signature, user_id]
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

exports.getUser = function getUser(email) {
    return db.query(
        `SELECT users.id AS user_id, users.password, signatures.id AS "sign_id"
        FROM users
        LEFT JOIN signatures ON users.id = signatures.user_id
        WHERE users.email = $1`,
        [email]
    );
};

exports.createUserProfile = function createUserProfile(
    age,
    city,
    url,
    user_id
) {
    return db.query(
        "INSERT INTO user_profiles(age, city, url, user_id) VALUES($1, $2, $3, $4)",
        [age || null, city, url, user_id]
    );
};

exports.getUserProfiles = function getUserProfiles() {
    return db.query(
        `SELECT
        users.first AS first,
        users.last AS last,
        user_profiles.age AS age,
        user_profiles.city AS city,
        user_profiles.url AS url
        FROM users
        LEFT JOIN signatures
        ON signatures.user_id = users.id
        LEFT JOIN user_profiles
        ON signatures.user_id = user_profiles.user_id`
    );
};

exports.getSignersByCity = function getSignersByCity(city) {
    return db.query(
        `SELECT
        users.first AS first,
        users.last AS last,
        user_profiles.age AS age,
        user_profiles.city AS city,
        user_profiles.url AS url
        FROM users
        LEFT JOIN signatures
        ON signatures.user_id = users.id
        LEFT JOIN user_profiles
        ON signatures.user_id = user_profiles.user_id
        WHERE LOWER(city) = LOWER($1)`,
        [city]
    );
};

exports.editProfile = function editProfile(input) {
    return db.query(
        `SELECT first, last, age, email, city, url
        FROM users
        LEFT JOIN user_profiles
        ON user_profiles.user_id = users.id
        WHERE user_id = $1
        `,
        [input]
    );
};

exports.updateUserInfo = function updateUserInfo(
    user_id,
    first,
    last,
    email,
    password
) {
    if (password) {
        return db.query(
            `UPDATE users
            SET first = $2, last = $3, email = $4, password = $5
            WHERE id = $1`,
            [user_id, first, last, email, password]
        );
    } else {
        return db.query(
            `UPDATE users
            SET first = $2, last = $3, email = $4
            WHERE id = $1`,
            [user_id, first, last, email]
        );
    }
};

exports.updateProfileInfo = function updateProfileInfo(
    age,
    city,
    url,
    user_id
) {
    return db.query(
        `INSERT INTO user_profiles (age, city, url, user_id)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id)
    DO UPDATE SET age = $1, city = $2, url = $3
    RETURNING id`,
        [age, city, url, user_id]
    );
};

exports.deleteSignature = function deleteSignature(id) {
    return db.query(`DELETE FROM signatures WHERE user_id = $1`, [id]);
};
