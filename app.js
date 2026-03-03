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

let upcomingAssignment = {
    type: "project", 
    outof: 100
};

function calculateGrade(projects, tests) {
    let projectsGrade = 0;
    let testsGrade = 0;

    for (let i = 0; i < projects.length; i++) {
        projectsGrade += projects[i] * 0.6;
    }
    projectsGrade /= projects.length;

    for (let i = 0; i < tests.length; i++) {
        testsGrade += tests[i] * 0.4;
    }
    testsGrade /= tests.length;

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
        const calcElement = document.createElement("div");
        calcElement.classList.add("assignment");
        calcElement.innerHTML = `
            <h3>${value.text}</h3>
            <div class="grade_input">
                <label for="${key}_input">Grade: </label>
                <input type="number" id="${key}_input" placeholder="__" onclick="this.select();">
                <label for="${key}_input">/${value.outof}</label>
            </div>
        `;

        document.querySelector("#calc_projects_section").appendChild(calcElement);
    });
}

function calculateGradeWithInputs() {
    let tests = [];
    let projects = [];

    Object.keys(assignments).forEach(key => {
        const value = assignments[key];
        if (document.querySelector(`#${key}_input`) == null) {
            console.log("oh no..")
            return;
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

function calculateRequirementWithInputs() {
    let tests = [];
    let projects = [];
    let testAmount = 0;
    let projectAmount = 0;
    let weightedTests = 0;
    let weightedProjects = 0;

    const wantedGrade = document.querySelector(`#wanted_grade_input`).value / upcomingAssignment.outof;

    Object.keys(assignments).forEach(key => {
        const value = assignments[key];
        if (document.querySelector(`#${key}_input`) == null) {
            console.log("oh no..")
            return;
        }
        const inputtedValue = document.querySelector(`#${key}_input`).value;
        
        if (value.type == "test") {
            tests.push((inputtedValue / value.outof) * 0.4);
            weightedTests += (inputtedValue / value.outof) * 0.4;
            testAmount++;
        } else {
            projects.push((inputtedValue / value.outof) * 0.6);
            weightedProjects += (inputtedValue / value.outof) * 0.6;
            projectAmount++;
        }
    });

    weightedTests /= testAmount;
    weightedProjects /= projectAmount;

    /*
    90, 90 tests
    70, x projects
    want 80 avg

    weightedTests + ((0.7 + ... + x) / totalProj) * 0.6 = wantedGrade

    (weightedProjects + .6x) / totalProj = wantedGrade - weightedTests

    weightedProjects + .6x = (wantedGrade - weightedTests) * totalProj

    .6x = ((wantedGrade - weightedTests) * totalProj) - weightedProjects

    x = (((wantedGrade - weightedTests) * totalProj) - weightedProjects) / 0.6

    */
    let needed = 0;
    if (upcomingAssignment.type == "project") {
        let neededWeight = wantedGrade - weightedTests;
        needed = ((neededWeight * (projectAmount + 1)) - weightedProjects) / 0.6;
    } else {
        let neededWeight = wantedGrade - weightedProjects;
        needed = ((neededWeight * (testAmount + 1)) - weightedTests) / 0.6;
    }
    document.querySelector("#req_result_text").innerText = `To get your desired grade, you need at least ${decimalToPercent(needed)}% in the upcoming assignment.`;
}

loadAssignments();