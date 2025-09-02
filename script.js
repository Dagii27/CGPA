// Data for courses and credit hours
const programCourses = {
    freshman: [
        { name: "Communicative English Language Skills I (FLEN. 1011)", creditHours: 6 },
        { name: "General Physics (Phys. 1011)", creditHours: 6 },
        { name: "General Psychology (Psyc. 1011)", creditHours: 6 },
        { name: "Mathematics for Natural Sciences (Math. 1011)", creditHours: 6 },
        { name: "Critical Thinking (LoCT. 1011)", creditHours: 3 },
        { name: "Geography of Ethiopia and the Horn (GeES. 1011)", creditHours: 3 }
    ],
    preEngineering: [
        { name: "Communicative English Language Skills II (FLEN. 1012)", creditHours: 5 },
        { name: "Social Anthropology (Anth. 1012)", creditHours: 5 },
        { name: "Applied Mathematics I (Math. 1041)", creditHours: 5 },
        { name: "Enterprenuership (Mgmt. 1012)", creditHours: 4 },
        { name: "Introduction to Emerging Technologies (EmTe. 1012)", creditHours: 5 },
        { name: "Moral and Civic Education (MCiE. 1012)", creditHours: 4 },
        { name: "Computer Programing (ECEg 2052)", creditHours: 5 }
    ]
};

// --- Tab Switching Logic ---
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`${tabName}-section`).classList.add('active');
    event.currentTarget.classList.add('active');
}

// --- GPA Calculator Logic ---
function generateProgramCourses() {
    const program = document.getElementById('programSelect').value;
    const courseInputsDiv = document.getElementById('courseInputs');
    const gpaResultDiv = document.getElementById('gpaResult');
    
    courseInputsDiv.innerHTML = '';
    gpaResultDiv.innerHTML = '';
    gpaResultDiv.classList.remove('show');

    if (!program) return;

    const courses = programCourses[program];
    let html = '';
    courses.forEach((course, index) => {
        html += `
            <div class="course-item">
                <div class="course-header">${course.name} (${course.creditHours} Cr)</div>
                <select id="grade-${index}" class="grade-select" required>
                    <option value="">Select Grade</option>
                    <option value="4.0">A</option>
                    <option value="3.75">A-</option>
                    <option value="3.5">B+</option>
                    <option value="3.0">B</option>
                    <option value="2.75">B-</option>
                    <option value="2.5">C+</option>
                    <option value="2.0">C</option>
                    <option value="1.75">C-</option>
                    <option value="1.0">D</option>
                    <option value="0">F</option>
                </select>
            </div>
        `;
    });

    html += `<button onclick="calculateGPA()" class="action-btn">Calculate GPA</button>`;
    courseInputsDiv.innerHTML = html;
}

function calculateGPA() {
    const program = document.getElementById('programSelect').value;
    if (!program) return;

    const courses = programCourses[program];
    const resultDiv = document.getElementById('gpaResult');
    let totalPoints = 0;
    let totalCredits = 0;
    let allInputsValid = true;
    const courseDetails = [];

    courses.forEach((course, index) => {
        const gradeSelect = document.getElementById(`grade-${index}`);
        if (!gradeSelect.value) {
            allInputsValid = false;
            gradeSelect.style.borderColor = 'red';
        } else {
            gradeSelect.style.borderColor = '#ccc';
            const gradeValue = parseFloat(gradeSelect.value);
            const qualityPoints = gradeValue * course.creditHours;
            totalPoints += qualityPoints;
            totalCredits += course.creditHours;
            courseDetails.push({
                name: course.name,
                grade: gradeSelect.options[gradeSelect.selectedIndex].text,
                creditHours: course.creditHours,
                qualityPoints: qualityPoints.toFixed(2)
            });
        }
    });

    if (!allInputsValid) {
        alert('Please select a grade for all courses.');
        return;
    }

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    displayGpaResult(gpa, totalCredits, totalPoints, courseDetails, resultDiv);
}

function displayGpaResult(gpa, totalCredits, totalPoints, courseDetails, resultDiv) {
    let perfClass = 'satisfactory', perfMessage = 'Satisfactory Progress.';
    if (gpa >= 3.85) { perfClass = 'outstanding'; perfMessage = 'Outstanding Performance!'; }
    else if (gpa >= 3.5) { perfClass = 'excellent'; perfMessage = 'Excellent Achievement!'; }
    else if (gpa >= 3.0) { perfClass = 'very-good'; perfMessage = 'Very Good Performance!'; }
    else if (gpa < 2.0) { perfClass = 'warning'; perfMessage = 'Academic Warning.'; }

    let tableRows = courseDetails.map(c => `
        <tr>
            <td>${c.name}</td>
            <td>${c.grade}</td>
            <td>${c.creditHours}</td>
            <td>${c.qualityPoints}</td>
        </tr>
    `).join('');

    resultDiv.innerHTML = `
        <div class="gpa-summary ${perfClass}">
            Your GPA is: ${gpa.toFixed(2)}
            <div class="status-message">${perfMessage}</div>
        </div>
        <div class="course-table">
            <table>
                <thead><tr><th>Course</th><th>Grade</th><th>Cr. Hours</th><th>Quality Pts.</th></tr></thead>
                <tbody>${tableRows}</tbody>
                <tfoot><tr><td colspan="2"><strong>Total</strong></td><td><strong>${totalCredits}</strong></td><td><strong>${totalPoints.toFixed(2)}</strong></td></tr></tfoot>
            </table>
        </div>
    `;
    resultDiv.className = 'result show';
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

// --- CGPA Calculator Logic ---
function calculateCGPA() {
    const freshmanInput = document.querySelector('.semester-card.freshman .semester-gpa');
    const preEngInput = document.querySelector('.semester-card.pre-engineering .semester-gpa');
    const resultDiv = document.getElementById('cgpaResult');

    const freshmanGPA = parseFloat(freshmanInput.value);
    const preEngGPA = parseFloat(preEngInput.value);

    if (isNaN(freshmanGPA) || isNaN(preEngGPA) || freshmanGPA < 0 || freshmanGPA > 4 || preEngGPA < 0 || preEngGPA > 4) {
        alert('Please enter valid GPA values (0.00 to 4.00) for both semesters.');
        return;
    }

    const freshmanCredits = 30;
    const preEngCredits = 33;
    
    const totalQualityPoints = (freshmanGPA * freshmanCredits) + (preEngGPA * preEngCredits);
    const totalCredits = freshmanCredits + preEngCredits;
    const cgpa = totalQualityPoints / totalCredits;

    displayCgpaResult(cgpa, resultDiv);
}

function displayCgpaResult(cgpa, resultDiv) {
    let perfClass = 'satisfactory', perfMessage = 'Satisfactory Progress.';
    if (cgpa >= 3.85) { perfClass = 'outstanding'; perfMessage = 'Outstanding Performance!'; }
    else if (cgpa >= 3.5) { perfClass = 'excellent'; perfMessage = 'Excellent Achievement!'; }
    else if (cgpa >= 3.0) { perfClass = 'very-good'; perfMessage = 'Very Good Performance!'; }
    else if (cgpa < 2.0) { perfClass = 'warning'; perfMessage = 'Academic Warning.'; }

    resultDiv.innerHTML = `
        <div class="gpa-summary ${perfClass}">
            Your CGPA is: ${cgpa.toFixed(2)}
            <div class="status-message">${perfMessage}</div>
        </div>
    `;
    resultDiv.className = 'result show';
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

// --- Reset Logic ---
document.querySelector('.logo').addEventListener('click', () => {
    document.getElementById('programSelect').value = '';
    document.getElementById('courseInputs').innerHTML = '';
    document.getElementById('gpaResult').innerHTML = '';
    document.querySelectorAll('.semester-gpa').forEach(input => input.value = '');
    document.getElementById('cgpaResult').innerHTML = '';
    document.querySelectorAll('.result').forEach(res => res.classList.remove('show'));
});
