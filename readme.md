back:
/express, db/
front:
/front-end JS, CSS, img, templates/

part 1 petition project: 3 handlebars project: /petition.
2 input fields and 1 canvas filed

steps to completing part 1:
required express-handlebars templates:

-   petition template with <canvas> element that the user can actually sign
    -   mouse down to sign mouse up toDataURL to generate url and then we'll put it in input field
    -   front end JS that will live in the public folder alongside css, images, etc.
-   thank you template that will thank the user for signing the petition, and will include
    a link to the next page - should also render the number of people who have signed the petition
-   signers template that should render the first and last names of everyone who
    has signed the petition
-   and you'll need 1 layout

SQL stuff

-   We'll need a database and a table for this project.
-   Create a table called "signatures" that has the following columns: id, first, last,
    signature (the signature's data type should be TEXT), timestamp
    -   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

DB queries

-   INSERT when the user signs the petition(so provides first, last and signature)
-   SELECT to get number of signers
-   SELECT to get the first and last names of everyone who has signed

Server Routes

-   GET /petition
    -renders petition template
-   POST/petition
    -   that will run whenever the user signs the petition
-   GET / thanks (or/signed - you can call it whatever)
    -   renders "thank you" template
-   GET / signers
    -   renders the signers template. will need the first and last names of everyone whose signed petition

PART TWO

/petition/signed route can know which signature was just made by this user
cookie header will send the cookie (key value pair)
cookies are tiny - they can only store about 400 bytes. (4kb)
take the url of the signature and store it in a cookie - easiest way but the link is really big so we can't use it.
We can take the id as a reference to the signature of the table in a cookie
npm package cookie-session will allow us to put stuff into a cookie
cookie session will automatically make 2 cookies

first cookie is base64 encoded:
atob('')
JSON.parse(atob(''))
second is encrypted version of a first cookie:
only cookie session will know how to get information from this
if the server receives a request where both cookies are the same, then request will be processed.
properties in a cookie: csrfSecret, userId, First, Last, SigId.

mysalt is a string added to the cookie for security (comes from a cookie session)
