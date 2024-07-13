const inquirer = require("inquirer");
const pool = require("./config/connection");

pool.connect();

const mainMenu = async () => {
  try {
    const { action } = await inquirer.prompt({
      type: "list",
      message: "What would you like to do?",
      name: "action",
      choices: ["View All Departments", "View All Roles", "View All Employees", "Quit"],
    });
    switch (action) {
      case "View All Departments":
        viewDepartments();
        break;
      case "View All Roles":
        viewRoles();
        break;
      case "View All Employees":
        viewEmployees();
        break;
      case "Quit":
        appInUse = false;
        disconnect();
    }
  } catch (error) {
    console.error("Error occurred during prompt:", error);
  }
};

pool.connect((err, client, done) => {
  if (err) {
    console.error("Error connecting to database: ", err.message);
  } else {
    console.log(`Connected to the ${process.env.DB_NAME} database.`);
  }
});

const viewDepartments = async () => {
  try {
    let res = await pool.query(`SELECT * FROM department ORDER BY id;`);
    console.table(res.rows);
    mainMenu();
  } catch (error) {
    console.error("Error executing query", error.message);
    throw error;
  }
};

async function viewRoles() {
  try {
    let res = await pool.query(
      `SELECT role.id, role.title, department.name AS department, role.salary 
      FROM role 
      JOIN department ON role.department_id = department.id 
      ORDER BY role.id;`
    );
    console.table(res.rows);
    mainMenu();
  } catch (error) {
    console.error("Error executing query", error.message);
    throw error;
  }
}

async function viewEmployees() {
  try {
    let res = await pool.query(`
      SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager 
      FROM employee e
      JOIN role ON e.role_id = role.id
      JOIN department ON role.department_id = department.id
      LEFT JOIN employee m ON e.manager_id = m.id;`);
    console.table(res.rows);
    mainMenu();
  } catch (error) {
    console.error("Error executing query", error.message);
    throw error;
  }
}

function disconnect() {
  try {
    pool.end();
    console.log("Disconnected from database.");
    process.exit(0);
  } catch (error) {
    console.error("Error disconnecting from database:", error);
  }
}

mainMenu();
