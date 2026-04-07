function back() {
    window.location.href = "../index.html"
}

// const projects = [
//     {
//         id:1,
//         name: "placeholder 1",
//         description: "wadhawjwjadhjkawhjdhkawjhdkjhwashduiwhaduaw",
//         img: "../src/Img_1.jpg"
//     },
//     {
//         id:2,
//         name: "placeholder 2",
//         description: "awdawudhauiwhduiawhuidhuawduiawiudhjiawjdioawiodjhioawhdioawh",
//         img: "../src/Img_2.jpg"
//     },
// ];
let projectsList = []

const projects = localStorage.getItem(`projects`);
if (projects){
     projectsList = JSON.parse(projects);
 } else {
    console.log("No data")
 }

console.log(localStorage.length)

const projectsContainer = document.getElementById("containerArea")


projectsList.map(renderProject).forEach(card=> projectsContainer.appendChild(card))


function renderProject(project, index) {
    const card = document.createElement("div")
    card.className = "card"
    card.id = "card"
    card.innerHTML = `
        <img class="card-img-top" src="${project.img}" alt="${project.img}">
        <div class="card-body">
        <h5 class="card-title">${project.name}</h5>
            <div class="introContainer">
            <p class="card-text">${project.description}</p>
                </div>
                    <button onclick="deleteProject(${index})" >Delete</button>
                    <button onclick="projectDetail(${index})">Detail</button>
                    <h6>tag:${project.tag}</h6>
                    <div class="detail" id="detail${index}">
                        <div class="detailContainer">
                        <img class="imgDetail" src="${project.img}" alt="${project.img}">
                        <h2>${project.name}</h2>
                        <p>${project.description}</p>
                        <button onclick="closeDetail(${index})">Close</button>
                    </div>
                </div>
            </div>`;
        return card}


console.log([projectsList])

let base64String = "";

        function imageUploaded() {
            let file = document.querySelector(
                'input[type=file]')['files'][0];

            let reader = new FileReader();

            reader.onload = function () {
                base64String = reader.result

                imageBase64Stringsep = base64String;

                console.log(base64String);
            }
            reader.readAsDataURL(file);
        }
    
const form = document.getElementById("myProjectForm")

form.addEventListener("submit", function(event){
    event.preventDefault();

    const name = document.getElementById("projectName").value;
    const description = document.getElementById("projectDescription").value;
    const tag = document.getElementById("projectTag").value;

    const newProject ={
        id: projectsList.length +1,
        tag: tag,
        name: name,
        description: description,
        img: base64String
    }
    if (tag== "none") {
        alert("No tag has been selected")
    } else {
        projectsList.push(newProject)
        localStorage.setItem(`projects`, JSON.stringify(projectsList));
        console.log(newProject)
        console.log(projectsList)
        document.getElementById("containerArea").innerHTML = ""
        projectsList.map(renderProject).forEach(card=> projectsContainer.appendChild(card))
    }
})

function deleteProject(index) {
    projectsList.splice(index, 1);
    localStorage.setItem(`projects`, JSON.stringify(projectsList));
    document.getElementById("containerArea").innerHTML = ""

    projectsList.map(renderProject).forEach(card=> projectsContainer.appendChild(card))

}

function projectDetail(index) {
    const pressed = document.getElementById(`detail${index}`)
    pressed.classList.add("open")
}

function closeDetail(index) {
    const pressed = document.getElementById(`detail${index}`)
    pressed.classList.remove("open")
}

function clearAll() {
    localStorage.clear();
    projectsList = []
    document.getElementById("containerArea").innerHTML = ""
}

function filterProjects() {
    let filterProjects = []
    const desiredTag = document.getElementById("filterTag").value;
    if (desiredTag== "none") {
        document.getElementById("containerArea").innerHTML = ""
        projectsList.map(renderProject).forEach(card=> projectsContainer.appendChild(card))
    } else {
        filterProjects = projectsList.filter(val => val.tag.includes(desiredTag))
        document.getElementById("containerArea").innerHTML = ""
        filterProjects.map(renderProject).forEach(card=> projectsContainer.appendChild(card))
        console.log(filterProjects)
    }
}
