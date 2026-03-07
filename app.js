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

const upcomingAssignment = {
    type: "project", 
    outof: 100
};

const gradeBarriers = [86, 73, 50, 1]

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

    const highlight = document.getElementById("active_tab_highlight");
    highlight.style.left = document.querySelector("#" + tab).offsetLeft + "px";
    highlight.style.width = document.querySelector("#" + tab).offsetWidth + "px";
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

    let extraGradeInfo = "";
    const setGrade = decimalToPercent(calculateGrade(projects, tests));
    let potentialElement = "";
    for (let i = 0; i < gradeBarriers.length; i++) {
        if (setGrade >= gradeBarriers[i] - 1 && setGrade < gradeBarriers[i]) {
            extraInfo = `~${gradeBarriers[i]}`;
            potentialElement = `
                <span class="participation_alert">
                    (i)
                    <div class="participation_tooltip">Good participation in class could result in a higher grade.</div>
                </span>
            `;
        }
    }

    document.querySelector("#calc_result_text").innerHTML = `Your current grade in the class is ${setGrade}${extraGradeInfo}%. ${potentialElement}`;

    registerPopups();
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

function repositionTooltip(parentElement) {
    const tooltip = parentElement.querySelector(".participation_tooltip");
    const rect = tooltip.getBoundingClientRect();
    let offset = -50;
    let margin = 20; // in pixels

    if (rect.left < margin) {
        offset += (margin - rect.left) / rect.width * 100;
    }
    if (rect.right > window.innerWidth - margin) {
        offset -= (rect.right - (window.innerWidth - margin)) / rect.width * 100;
    }

    tooltip.style.transform = `translateX(${offset}%)`;
}

function registerPopups() {
    const popups = document.querySelectorAll(".participation_alert");

    popups.forEach(pop => {
        pop.addEventListener("click", (e) => {
            e.stopPropagation();
            pop.classList.toggle("active");

            repositionTooltip(pop);
        });

        pop.addEventListener("mouseenter", () => {
            pop.classList.add("active");

            repositionTooltip(pop);
        });

        pop.addEventListener("mouseleave", () => {
            pop.classList.remove("active");

            pop.querySelector(".participation_tooltip").style.transform = "translateX(-50%)";
        });
    });

    document.addEventListener("click", () => {
        document.querySelectorAll(".participation_alert.active").forEach(p => {
            p.classList.remove("active")
            p.querySelector(".participation_tooltip").style.transform = "translateX(-50%)";
        });
    });
}

loadAssignments();
selectTab('calc_button', 'calc_results');