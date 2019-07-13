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

PART THREE

registration and log in

registration

-   new template with <form>and 4 input fields
-   server side - hash the password and INSERT first, last, email and hashed password into the new users table
-   when the user successfully registered(pass is hashed), look at the users table we'll see bcrypted passwords
-   put userID in cookie and the value of the userId cookie should be the id that was generated by postgres when we did the INSERT

logIn

-   new template with <form> and 2 input fields
-   server side - we need to get the user"s hashed password from database, and then compare that has with the password we got from the input field
-   if they match store userId in a cookie
-   redirect to petition page ?

petition page modify

-   remove input fields for first and last (bc we're getting the user's first and last name from the registration/login pages)
-   greet user by name!

logout

-   delete everything in users cookie
-   req.session to NULL
-   logout can happen on GET or POST request

only logged in users should have permissions to view certain pages. not logged in should only see the login page.

if the user hasn't signed the petition yet, the user should not be able to see the thank-you page.

//things to add - clear canvas, signature mandatory, if statements handlebars for the login//

PART FOUR

Joins //join two tables
SELECT \* FROM signers /signatures/
(FULL OUTER) JOIN songs /users/ --- full outer is to join even cols that don't match
ON singers.id = songs.singer_id //signatures.id = users.user_id (newID)//

--- SELECT singers.name AS signer_name, songs.name AS song
FROM singers
JOIN songs
ON signers.id = songs.singer_id;

---

we can also join multiple tables together
SELECT singers.id, singers.name AS singer, songs.name AS song, albums.name AS album
FROM signers
LEFT JOIN songs
ON singers.id = songs.singer_id
JOIN albums
ON singers.id = albums.singer_id;

--if we only want certain data
WHERE singers.id = 2;

STEPS

1. kill first and last name from signatures table. they should live in users table. replace with user_id
2. new table for the user table
   DROP TABLE IF EXISTS user_profiles CASCADE;
   CREATE TABLE user_profiles (
   id SERIAL PRIMARY KEY,
   age INT,
   city VARCHAR(100),
   url VARCHAR(300),
   user_id INT REFERENCES users(id)
   )
   -- referential integrity

3. Need a new GET route and POST route for the extra information page. Everything should be optional.

var str = 'hello';
str.startsWith('hell'); --- true
**\***does the users url starts with http or https - execute
**\***if it doesn't - add at the beginning of a string

4. Work on the signers pages
   problem is data now lives in 3 tables
   solution -->JOINS!
   (tip: start with signatures table).
   {{#signers}}
   {{#if url}}
   <a href={{url}}>{{first}}{{last}}</a>
   {{else}}
   {{first}}{{last}}
   {{/if}}
   {{/signers}}
5. New get route for cities: petition/signers/cities (think params)
   cities to lowercase in SQL. query that converts a string in lowercase
   this goes in SQL query
   WHERE city - $1
--becomes
WHERE LOWER(city) = LOWER($1)

///PART FIVE///

edit userProfile
req.body.password == "" - they didn't change password - no query

userProfiles table query: update or insert? UPSERT
delete query
-to allow user to delete signature

<form action="/sig/delete" method="POST">
<input type= "hidden name="_csrf" value="{{csrfToken}}">
<input type = "hidden name="user" value="{{userId}}">
<button>delete<button>
</form>
