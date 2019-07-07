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
