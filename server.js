// import inquirer from packages
const inquirer = require("inquirer");
// import pool connection
const pool = require("./config/connection");

// connect to the database
pool.connect();

// Create the main menu using inquirer
// provide a list for users to choose from
// prompt is deconstructed to avoid answer.action
// based on their choice, call the respective function by using switch cases
const mainMenu = async () => {
  try {
    const { action } = await inquirer.prompt({
      type: "list",
      message: "What would you like to do?",
      name: "action",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "Quit",
      ],
    });
    switch (action) {
      case "View All Departments":
        await viewDepartments();
        break;
      case "View All Roles":
        await viewRoles();
        break;
      case "View All Employees":
        await viewEmployees();
        break;
      case "Add a Department":
        await addDepartment();
        break;
      case "Add a Role":
        await addRole();
        break;
      case "Add an Employee":
        await addEmployee();
        break;
      case "Quit":
        await disconnect();
        return;
    }
    await mainMenu();
  } catch (error) {
    console.error("Error occurred during prompt:", error);
  }
};

const executeQuery = async (query, params = []) => {
  try {
    const res = await pool.query(query, params);
    return res.rows;
  } catch (error) {
    console.error("Error executing query", error.message);
    throw error;
  }
};

// Create a postgres query
const getDepartments = async () => {
  return await executeQuery(`SELECT * FROM department ORDER BY id;`);
};

// Create a postgres query and print to the console as a table
// use AS to replace column name department.name to department
// retrieve the department name by JOINing the two tables based on the department_id from the role table referencing department id
const getRoles = async () => {
  return await executeQuery(
    `SELECT role.id, role.title, department.name AS department, role.salary 
      FROM role 
      JOIN department ON role.department_id = department.id 
      ORDER BY role.id;`
  );
};

// Create a postgres query and print to the console as a table
// use AS to replace column name department.name to department
// use AS to name column manager, which concatenates the employee manager first and last name
// retrieve the role salary by JOINing the two tables based on the role_id from the employee table referencing role id
// retrieve the department name by JOINing the two tables based on the department_id from the role table referencing department id
// retrieve the managers name by using a LEFT JOIN to return all employees even if they do not have managers
// name employee table as e and m to ensure clarity in referencing tables through postgres queries
const getEmployees = async () => {
  return await executeQuery(
    `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager 
      FROM employee e
      JOIN role ON e.role_id = role.id
      JOIN department ON role.department_id = department.id
      LEFT JOIN employee m ON e.manager_id = m.id;`
  );
};

// print departments to the console as a table & return back to the main menu
const viewDepartments = async () => {
  let departments = await getDepartments();
  console.table(departments);
};

// print roles to the console as a table & return back to the main menu
const viewRoles = async () => {
  let roles = await getRoles();
  console.table(roles);
};

// print employees to the console as a table & return back to the main menu
const viewEmployees = async () => {
  let employees = await getEmployees();
  console.table(employees);
};

// prompt user for department name and inform user that the info is stored into the database
const addDepartment = async () => {
  try {
    const { name } = await inquirer.prompt({
      name: "name",
      type: "input",
      message: "Enter the name of the department:",
    });
    await executeQuery("INSERT INTO department (name) VALUES ($1)", [name]);
    console.log(`Added ${name} to the database`);
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

// retrieve departments and the array will be used to prompt users with choices rather than typing an id
// values are assigned to them to match with postgres table columns
// prompt user for data and inform user that the info is stored into the database
const addRole = async () => {
  try {
    let departments = await getDepartments();
    const departmentSelection = departments.map((department) => ({
      name: department.name,
      value: department.id,
    }));
    const { title, salary, departmentId } = await inquirer.prompt([
      {
        name: "title",
        type: "input",
        message: "Enter the title of the role:",
      },
      {
        name: "salary",
        type: "input",
        message: "Enter the salary of the role:",
      },
      {
        name: "departmentId",
        type: "list",
        message: "Select the department that the role belongs to:",
        choices: departmentSelection,
      },
    ]);
    await executeQuery("INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)",
      [title, salary, departmentId]
    );
    console.log(`Added ${title} to the database`);
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

// retrieve roles and employees, and push no manager into manager array
// these arrays will be used to prompt users with choices rather than typing an id
// values are assigned to them to match with postgres table columns
// prompt user for data and inform user that the info is stored into the database
const addEmployee = async () => {
  try {
    let roles = await getRoles();
    const roleSelection = roles.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    let employees = await getEmployees();
    const managerSelection = employees.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));
    managerSelection.unshift({ name: "No manager", value: null });
    const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
      {
        name: "firstName",
        type: "input",
        message: "Enter the first name of the employee:",
      },
      {
        name: "lastName",
        type: "input",
        message: "Enter the last name of the employee:",
      },
      {
        name: "roleId",
        type: "list",
        message: "Select the role of the employee:",
        choices: roleSelection,
      },
      {
        name: "managerId",
        type: "list",
        message: "Select the manager of the employee:",
        choices: managerSelection,
      },
    ]);
    await executeQuery("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)",
      [firstName, lastName, roleId, managerId]
    );
    console.log(`Added ${firstName} ${lastName} to the database`);
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

// disconnect the database from the application
// and end the server
const disconnect = async () => {
  try {
    await pool.end();
    console.log("Disconnected from database.");
    process.exit();
  } catch (error) {
    console.error("Error disconnecting from database:", error);
  }
};

mainMenu();
