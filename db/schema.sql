-- If the database already exists, drop it
DROP DATABASE IF EXISTS employee_db;

-- Then create the database
CREATE DATABASE employee_db;

-- change into the database that was just created
\c employee_db;

-- Create the department table
-- id is the primary key that the other tables will use as a reference
-- department names all need to be unique and under 30 characters
CREATE TABLE department (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL
);

-- Create the role table
-- id is the primary key that the other tables will use as a reference
-- role titles all need to be unique and under 30 characters
-- department_id is an integer that refers to the department id
-- the department integer is a foreign key because it links to the department table using column id
CREATE TABLE role (
  id SERIAL PRIMARY KEY,
  title VARCHAR(30) UNIQUE NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INTEGER NOT NULL,
  FOREIGN KEY (department_id) REFERENCES department(id)
);

-- Create the employee table
-- id is the primary key that the table will use as a reference
-- first_name and last_name stores employees' name under 30 characters
-- role_id is an integer that refers to the role id
-- manager_id is an integer that refers to employee id (employees who are managers), it is not required as some employees do not need to report to a manager
-- the role_id integer is a foreign key because it links to the role table using column id
-- the manager_id integer is a foreign key because it links to the employee table using column id
CREATE TABLE employee (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER NOT NULL,
  manager_id INTEGER,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);