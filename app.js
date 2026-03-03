let assignments = {
    "jugement_ethique": {
        type: "project", 
        outof: 100, 
        text: "Projet de jugement éthique"
    }, 
    "causes_ww1": {
        type: "test", 
        outof: 11, 
        text: "Test sur les cause de la première guerre mondiale"
    }, 
    "chaine_amitie": {
        type: "test", 
        outof: 13, 
        text: "Test sur la chaîne d'amitié"
    }
}

function calculateGrade(projects, tests) {
    let projectsGrade = 0;
    let testsGrade = 0;

    for (let i = 0; i < projects.length; i++) {
        projectsGrade += projects[i];
    }
    projectsGrade /= projects.length;
    projectsGrade *= 0.6;

    for (let i = 0; i < tests.length; i++) {
        testsGrade += tests[i];
    }
    testsGrade /= tests.length;
    testsGrade *= 0.4;

    return testsGrade + projectsGrade;
}

function decimalToPercent(grade) {
    return Math.round(grade * 1000) / 10;
}

function selectTab(tab, tabContent) {
    const openTabs = document.querySelectorAll(".selected_tab");
    openTabs.forEach(element => {
        element.classList.remove("selected_tab")
    });
    document.querySelector("#" + tab).classList.add("selected_tab");
    document.querySelector("#" + tabContent).classList.add("selected_tab");
}

function loadAssignments() {
    Object.keys(assignments).forEach(key => {
        const value = assignments[key];
        const newElement = document.createElement("div");
        newElement.classList.add("assignment");
        newElement.innerHTML = `
            <h3>${value.text}</h3>
            <div class="grade_input">
                <label for="${key}_input">Grade: </label>
                <input type="number" id="${key}_input" placeholder="__">
                <label for="${key}_input">/${value.outof}</label>
            </div>
        `;

        document.querySelector("#calc_projects_section").appendChild(newElement);
    });
}

function calculateGradeWithInputs() {
    let tests = [];
    let projects = [];

    Object.keys(assignments).forEach(key => {
        const value = assignments[key];
        if (document.querySelector(`#${key}_input`) == null) {
            console.log("oh no..")
            alert("You missed one or more inputs!")
        }
        const inputtedValue = document.querySelector(`#${key}_input`).value;
        
        if (value.type == "test") {
            tests.push(inputtedValue / value.outof);
        } else {
            projects.push(inputtedValue / value.outof);
        }
    });

    document.querySelector("#calc_result_text").innerText = `Your current grade in the class is ${decimalToPercent(calculateGrade(projects, tests))}%.`;
}

loadAssignments();