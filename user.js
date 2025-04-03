const BASE_URL = "http://localhost:8000"

window.onload = async () => {
    await loadData()
}

const loadData = async () => {
    console.log("User script loaded");
    // Load user ทั้งหมดออกมาจาก API
    const response = await axios.get(`${BASE_URL}/users`);

    console.log(response.data)

    const userDOM = document.getElementById("user")

    let htmlData = "<div>"
    // นำ user ที่โหลดมาใส่กลับเข้าไปใน html
    for (let i = 0; i < response.data.length; i++) {
        let user = response.data[i]
        htmlData += `<div>
        ${user.id}) ${user.firstname}  ${user.lastname}
        <a href="index.html?id=${user.id}"><button>Edit</button></a>
        <button class="delete" data-id="${user.id}">Delete</button>
        </div>`
    }
    htmlData += "</div>"
    userDOM.innerHTML = htmlData

    // button class="delete" จะมี data-id เป็น id ของ user ที่ต้องการลบ
    const deleteDOMs = document.getElementsByClassName("delete")

    for (let i = 0; i < deleteDOMs.length; i++) {
        deleteDOMs[i].addEventListener("click", async(even) => {
            // ดึง id ของ user ที่ต้องการลบออกมา
            const id = even.target.dataset.id
            try{
                await axios.delete(`${BASE_URL}/users/${id}`)
                loadData() // recursive function = เรียนฟังก์ชันตัวเอง
                // loadData() จะทำการโหลด user ใหม่ทั้งหมดออกมา
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        })
    }

}