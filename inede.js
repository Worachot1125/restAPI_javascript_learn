const BASE_URL = "http://localhost:8000"

let mode = "CREATE" // default mode is create
let selectedId = ""

window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get("id")
    console.log("id", id)
    if (id) {
        mode = "EDIT"
        selectedId = id

        // ดึงข้อมมูล user ที่ต้องการแก้ไขออกมา
        try {
            const response = await axios.get(`${BASE_URL}/users/${id}`)
            const user = response.data

            let firstnameDOM = document.querySelector("input[name=firstname]")
            let lastnameDOM = document.querySelector("input[name=lastname]")
            let ageDOM = document.querySelector("input[name=age]")
            let commentDOM = document.querySelector("textarea[name=comment]")

            firstnameDOM.value = user.firstname
            lastnameDOM.value = user.lastname
            ageDOM.value = user.age
            commentDOM.value = user.comment

            let genderDOM = document.querySelectorAll("input[name=gender]")
            let interestsDOMs = document.querySelectorAll("input[name=interests]")

            for (let i = 0; i < genderDOM.length; i++) {
                if (genderDOM[i].value == user.gender) {
                    genderDOM[i].checked = true
                }
            }
            
            for (let i = 0; i < interestsDOMs.length; i++) {
                if(user.interests.includes(interestsDOMs[i].value)) {
                    interestsDOMs[i].checked = true
                }
            }

        } catch (error) {
            console.error("Error fetching user data:", error)
        }
        // นำข้อมูล user ที่โหลดมาใส่กลับเข้าไปใน html
    }
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

const submitData = async () => {
    let firstnameDOM = document.querySelector("input[name=firstname]")
    let lastnameDOM = document.querySelector("input[name=lastname]")
    let ageDOM = document.querySelector("input[name=age]")
    let genderDOM = document.querySelector("input[name=gender]:checked") || {}
    let interestsDOMs = document.querySelectorAll("input[name=interests]:checked") || {}
    let commentDOM = document.querySelector("textarea[name=comment]")
    let messageDOM = document.getElementById("message")

    let interest = "";
    try {
        for (let i = 0; i < interestsDOMs.length; i++) {
            interest += interestsDOMs[i].value
            if (i != interestsDOMs.length - 1) {
                interest += ", ";
            };
        };
        let userData = {
            firstname: firstnameDOM.value,
            lastname: lastnameDOM.value,
            age: ageDOM.value,
            gender: genderDOM.value,
            comment: commentDOM.value,
            interests: interest
        }
        console.log("submit Data", userData);

        const errors = validateData(userData)
        if (errors.length > 0) {
            throw {
                message: "กรุณากรอกข้อมูลให้ครบ",
                errors: errors
            }
        }

        let message = "บันทึกข้อมูลเรียบร้อย"

        if (mode == "CREATE") {
            const response = await axios.post(`${BASE_URL}/users`, userData);
            console.log("response", response.data)
        } else {
            const response = await axios.put(`${BASE_URL}/users/${selectedId}`, userData);
            message = "บันทึกข้อมูลเรียบร้อย"
            console.log("response", response.data)
        }

        messageDOM.innerText = message
        messageDOM.className = "message success"
    } catch (error) {
        console.log("errror message", error.message)
        console.error("error", error.errors);
        if (error.response) {
            console.log(error.response);
            error.message = error.response.data.message
            error.errors = error.response.data.errors
        }

        let htmlData = "<div>"
        htmlData += `<div>${error.message}</div>`
        htmlData += "<ul>"
        for (let i = 0; i < error.errors.length; i++) {
            htmlData += `<li>${error.errors[i]}</li>`
        }
        htmlData += "</ul>"
        htmlData += "</div>"

        messageDOM.innerHTML = htmlData
        messageDOM.className = "message danger"
    }

};