const { app } = require("./index");
const supertest = require("supertest");
const cookieSession = require("cookie-session"); //cookie session mock, not the NPM module cookie-session!

test("GET /home returns an h1 as reposnse", () => {
    return supertest(app)
        .get("/home")
        .then(res => {
            expect(res.statusCode).toBe(200);
            // expect(res.text).toBe("<h1>welcome to my website!<h1>");
            expect(res.text).toContain("welcome");
            // console.log("res:", res);
        });
});

test("POST /product redirects to /home", () => {
    return (
        supertest(app)
            .post("/product")
            //handling user input in a test
            // .send(
            //     "first=testFirstName&last=testLastName&email=test@test.com&password=myTest"
            // )
            .then(res => {
                expect(res.statusCode).toBe(302);
                // expect(res.text).toContain("Found");
                expect(res.headers.location).toBe("/home");
                // console.log("res: ", res);
            })
    );
});

test("POST /product sets req.session.wouldLikeToBuy to true", () => {
    //step 1 create cookie
    let cookie = {};
    //step 2 tell cookie session mock that the cookie var is our cookie,
    //and any time a user writes data to a cookie, it should be placed
    //in the "cookie variable"
    cookieSession.mockSessionOnce(cookie);
    return supertest(app)
        .post("/product")
        .then(res => {
            console.log("cookie: ", cookie);
            expect(cookie.wouldLikeToBuy).toBe(true);
            expect(res.statusCode).toBe(302);
        });
});
//text, headers, statuscode
