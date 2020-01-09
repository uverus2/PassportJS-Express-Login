# Log in system using Passport js and Express 
## Includes local strategy and google strategy

The purpose of the repo is to understand passport js and apply multiple strategies as well as validation. The project also uses fash-connect which allows for message display on redirect. The multiple strategy implementation is a bit messy so any suggestion on how I can prove are more than welcome. 

## How to start it?
- Run the command ``` npm install ```
- To run it you can use ``` npm run dev ``` however it requires [nodemon](https://nodemon.io) which is listed as a dev dependency 
- Normal run ``` npm run prod ``` it uses node app.js

## Additional setup 
- Mongo Database called **users** will need to be created.
- Mongo DB needs to run on localhost:27017.
- Different database can use by changing the database name in config>keys.js.
- Express server will run on 5000 by default however do not change it because it will affect the sign in with google. 
- Any google paths within the routes should be changed as well. 

### References 
Net Ninja Tutorial - [here](https://www.youtube.com/playlist?list=PL4cUxeGkcC9jdm7QX143aMLAqyM-jTZ2x)
Traversy Media Local passport authentication tutorial - [here](https://www.youtube.com/watch?v=6FOq4cUdH8k&t=2020s)
Express Validator - [here](https://www.npmjs.com/package/express-validator)
Password Validator - [here](https://github.com/tarunbatra/password-validator)
Passport with multiple strategies - [here](https://gist.github.com/joshbirk/1732068)
Hidden passport manual - [here](https://github.com/jwalton/passport-api-docs)

## Be responsible with my google credentials in keys.js


