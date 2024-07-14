# Employee Manager
A command-line application to manage a company's employee database

## Description

This project was constructed in order to build a command-line application from scratch to manage a company's employee database, using Node.js, Inquirer, and PostgreSQL. Through this project, I learnt about:

- Postgres and Databases
- Data Types and Tables
- Primary and Foreign Keys
- CRUD, Schemas and Joins 
- Parameterised Queries and Aggregation functions

The image below shows the application in Terminal.
![image](https://github.com/user-attachments/assets/1115bc68-0647-4ac4-870d-d86fb03c64a5)



## Installation

Fill in a dotenv file (refer to `.env.EXAMPLE`), run `npm i` in the terminal to install necessary packages to use the application then run `psql -U postgres` and log in. Create the database by using the script `\i  db/schema.sql;` in postgres and if you would like to seed in some data to test the program also run `\i db/seeds.sql;` in postgres.

## Usage

Run `node server.js` in the terminal to start the application.  
Here is a [video](https://drive.google.com/file/d/1li0nz7KnYEqCCIpZx76jxu3AeGXLc2aK/view?usp=drive_link) showing a walkthrough of the application.

## Credits

Thank you to:

- The Coding Bootcamp at the University of Sydney for providing a project and starter code for students to develop their understanding of SQL
- Instructor Frank Fu and teacher assistant Sean Butcher for providing the foundational knowledge required to attempt the project

## License

Please refer to the LICENSE in the repo.
