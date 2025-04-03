const express = require('express');
const bodyparser = require("body-parser");
const mysql = require("mysql2/promise");
const cors = require("cors");
const app = express();

app.use(bodyparser.json());
app.use(cors());

const port = 8000;

let conn = null

const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'tutorials',
        port: 3306
    })
}
const validateData = (userData) => {
    let errors = []
    if (!userData.firstname) {
        errors.push("กรุณากรอกชื่อจริง")
    }
    if (!userData.lastname) {
        errors.push("กรุณากรอกนามสกุล")
    }
    if (!userData.age) {
        errors.push("กรุณากรอกอายุ")
    }
    if (!userData.gender) {
        errors.push("กรุณากรอกเพศ")
    }
    if (!userData.interests) {
        errors.push("กรุณาเลือกความสนใจ")
    }
    if (!userData.comment) {
        errors.push("กรุณากรอกความคิดเห็น")
    }
    return errors
}
/*
GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
GET /users/:id สำหรับการดึง users รายคนออกมา
PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
*/

//part = GET /users
app.get("/users", async (req, res) => {
    const results = await conn.query('SELECT * FROM users')
    res.json(results[0])
})

// GET users by id
app.get("/users/:id", async (req, res) => {
    try {
        let id = req.params.id
        const results = await conn.query("SELECT * FROM users WHERE id = ?", id)

        if (results[0].length == 0) {
        throw new Error("User not found")
        }
        res.json(results[0][0])
    } catch (error) {
        console.error("error message", error.message)
        let statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: "Something wrong",
            errorMessage: error.message
        })
    }
});

// path = POST /user
app.post("/users", async (req, res) => {
    try {
        let user = req.body;

        const errors = validateData(user)
        if (errors.length > 0) {
            throw {
                message: "กรุณากรอกข้อมูลให้ครบ",
                errors: errors
            }
        }
        const results = await conn.query("INSERT INTO users SET ?", user)
        res.json({
            message: "Insert user complete",
            data: results[0]
        });
    } catch (error) {
        const errorMessage = error.message || "Something wrong"
        const errors = error.errors || []
        console.error("error message", error.message)
        res.status(500).json({
            message: errorMessage,
            errors: errors
        })
    }
});


// path = PUT,PATCH /users/:id
app.put("/users/:id", async (req, res) => {
    try {
        let id = req.params.id
        let updateUser = req.body
        const results = await conn.query("UPDATE users SET ? WHERE id = ?", [updateUser, id])
        res.json({
            message: "Update user complete",
            data: results[0]
        });
    } catch (error) {
        console.log("error message", error.message)
        res.status(500).json({
            message: "Something wrong",
        })
    }
});
/*
app.patch("/user/:id", (req, res) =>{
    let id = req.params.id
    let updateUser = req.body

    // ค้นหาข้อมูล users
    let selectedIndex = users.findIndex(user => user.id == id);

    // update ข้อมูล user
    if (updateUser.firstname) {
        users[selectedIndex].firstname = updateUser.firstname
    };

    if (updateUser.lastname) {
        users[selectedIndex].lastname = updateUser.lastname
    };

    res.json({
        message: "update user complete",
        data: { 
            user: updateUser,
            indexUpdate: selectedIndex
        }
    });
});
*/

// Path DELETE /users/:id
app.delete("/users/:id", async (req, res) => {
    try {
        let id = req.params.id
        const results = await conn.query("DELETE FROM users WHERE id = ?", id)
        res.json({
            message: "Delete user complete",
            data: results[0]
        });
    } catch (error) {
        console.log("error message", error.message)
        res.status(500).json({
            message: "Something wrong",
        })
    }
});

app.listen(port, async (req, res) => {
    await initMySQL()
    console.log("http server run at" + port)
});