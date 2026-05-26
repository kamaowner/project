console.log("THIS FILE IS RUNNING");

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();
const port = 6000;

app.use(cors());
app.use(express.json());

// DB connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'emps'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL');
    }
});


// INSERT DATA INTO TABLE USERS
app.post('/users', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "All fields required" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';

    db.query(query, [username, hashedPassword], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({ message: 'User created successfully' });
    });
});


// UPDATE USER
app.put('/users/:id', async (req, res) => {

  const id = req.params.id;

  const { username, password } = req.body;

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // SQL query
  const sql = `
    UPDATE users
    SET username = ?, password = ?
    WHERE id = ?
  `;

  // run query
  db.query(
    sql,
    [username, hashedPassword, id],
    (err, result) => {

      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }

      res.json({
        message: "User updated successfully"
      });

    }
  );

});

// INSERT DATA AND SELECT INTO LOGIN WITH REQUIRED
app.post('/login', (req, res) => {

    const { username, password } = req.body;

    // check empty fields
    if (!username || !password) {
        return res.status(400).json({
            message: "All fields required"
        });
    }

    // find user
    const query =
        'SELECT * FROM users WHERE username = ?';

    db.query(query, [username], async (err, results) => {

        // database error
        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Server error"
            });
        }

        // user not found
        if (results.length === 0) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        const user = results[0];

        // compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        // wrong password
        if (!isMatch) {
            return res.status(401).json({
                message: "Wrong password"
            });
        }

        // success
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                username: user.username
            }
        });

    });

});
// INSERT DATA IN DEPARTMENT TABLE
app.post('/department', (req, res) => {
    const { departmentName, departmentCode } = req.body;

    if (!departmentName || !departmentCode) {
        return res.status(400).json({ message: "All fields are required" });
    }
   

    
    const query = 'INSERT INTO department (departmentName, departmentCode) VALUES (?, ?)';


    db.query(query, [departmentName, departmentCode], (err, result) => {
        if (err) {
            console.error('Data not inserted:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({ message: "Department created successfully" });
    });
});
// SELECT ALL DATA FROM DEPARTMENT TABLE BY USING GET METHOD
app.get('/department', (req, res) => {
    const query = 'SELECT * FROM department';

    db.query(query, (err, results) => {
        if (err) {
            console.log('Error fetching departments:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});
// RETRIEVE DATA FROM DEPARTMENT TABLE
app.delete('/department/:departmentId', (req, res) => {
    const { departmentId } = req.params;
    const departmentIdNum = Number(departmentId);

    if (!Number.isInteger(departmentIdNum) || departmentIdNum <= 0) {
        return res.status(400).json({ message: 'Valid department id is required' });
    }

    const query = 'DELETE FROM department WHERE departmentId = ?';

    db.query(query, [departmentIdNum], (err, result) => {
        if (err) {
            console.error('Error deleting department:', err);
            return res.status(500).json({ error: err.sqlMessage || err.message || 'Internal server error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Department not found' });
        }

        res.status(200).json({ message: 'Department deleted successfully' });
    });
});
// INSERT DATA FROM EMPLOYEES TABLE
app.post('/employees', (req, res) => {
    const { employeeName, email, phone, departmentId } = req.body;

    if (!employeeName || !email || !phone || !departmentId) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const query = `
        INSERT INTO employees (employeeName, email, phone, departmentId) 
        VALUES (?, ?, ?, ?)
    `;

    db.query(query, [employeeName, email, phone, departmentId], (err, result) => {
        if (err) {
            console.error('Error inserting employee:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        res.status(201).json({
            message: 'Employee created successfully'
        });
    });
});
// INSERT DATA FROM SALARY TABLE BY USING POST
app.post('/salary', (req, res) => {
    const { employeeId, basicSalary, bonus, deduction } = req.body;

    if (!employeeId || !basicSalary || !bonus || !deduction) {
        return res.status(400).json({ message: 'employeeId, basicSalary, bonus and deduction are required' });
    }

    const salaryEmployeeId = Number(employeeId);

    if (!Number.isInteger(salaryEmployeeId) || salaryEmployeeId <= 0) {
        return res.status(400).json({ message: 'Valid employeeId is required' });
    }

    const query = 'INSERT INTO salary (employeeId, basicSalary, bonus, deduction) VALUES (?, ?, ?, ?)';

    db.query(query, [salaryEmployeeId, basicSalary, bonus, deduction], (err, result) => {
        if (err) {
            console.error('Error inserting salary record:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({ message: 'Salary record created successfully', result: result });
    });
});
// SELECT ALL DATA FROM SALARY TABLE AND SHOWS ON THE POSTMAN
app.get('/salary', (req, res) => {
    const query = 'SELECT * FROM salary';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching salary records:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const salaryRecords = results.map((record) => {
            const basicSalary = Number.parseFloat(record.basicSalary) || 0;
            const bonus = Number.parseFloat(record.bonus) || 0;
            const deduction = Number.parseFloat(record.deduction) || 0;
            return {
                ...record,
                totalSalary: basicSalary + bonus - deduction,
            };
        });

        res.status(200).json(salaryRecords);
    });
});
// SELECTING ALL DATA FROM THREE TABLES AND THEN GIVE REPORT FROM THAT TABLES INORDER TO KNOW OVER DETAILS
app.get('/report', (req, res) => {
    const query = `
        SELECT 
            e.employeeId,
            e.employeeName,
            e.email,
            e.phone,
            d.departmentName AS department,
            d.departmentCode,
            (IFNULL(s.basicSalary,0) + 
             IFNULL(s.bonus,0) - 
             IFNULL(s.deduction,0)) AS totalSalary,
            CURDATE() AS reportDate
        FROM employees e
        LEFT JOIN department d 
            ON e.departmentId = d.departmentId
        LEFT JOIN salary s 
            ON e.employeeId = s.employeeId;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("DB ERROR:", err);
            return res.status(500).json({ error: err.message });
        }

        // return data even if empty
        return res.status(200).json(results);
    });
});


// RETRIVING DATA FROM EMPLOYEES TABLE
app.delete('/employees/:employeeId', (req, res) => {
    const { employeeId } = req.params;
    const employeeIdNum = Number(employeeId);

    if (!Number.isInteger(employeeIdNum) || employeeIdNum <= 0) {
        return res.status(400).json({ message: 'Valid employee id is required' });
    }

    const query = 'DELETE FROM employees WHERE employeeId = ?';

    db.query(query, [employeeIdNum], (err, result) => {
        if (err) {
            console.error('Error deleting employee:', err);
            return res.status(500).json({ error: err.sqlMessage || err.message || 'Internal server error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee deleted successfully' });
    });
});
// SELECTING DATA FROM EMPLOYEES TABLE
app.get('/employees', (req, res) => {
    const query = 'SELECT * FROM employees';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching employees:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json(results);
    });
});
// RETRIVING USER FROM TABLE
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM users WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    });
});
// SELECTING DATA FROM USERS TABLE
app.get('/users', (req, res) => {
    const query = 'SELECT * FROM users';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json(results);
    });
});
 
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "All fields required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'UPDATE users SET username = ?, password = ? WHERE id = ?';
    db.query(sql, [username, hashedPassword, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "User updated successfully" });
      
       
});
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})