const gradePoints = {
    'A': 4.0,
    'A-': 3.75,
    'B+': 3.5,
    'B': 3.0,
    'B-': 2.75,
    'C+': 2.5,
    'C': 2.0,
    'C-': 1.75,
    'D': 1.0,
    'F': 0.0
};

const programCourses = {
    freshman: [
        { name: "Communicative English Language Skills I", creditHours: 6 },
        { name: "Physical Fitness", isPassFail: true },
        { name: "General Physics", creditHours: 6 },
        { name: "General Psychology", creditHours: 6 },
        { name: "Mathematics for Natural Sciences", creditHours: 6 },
        { name: "Geography of Ethiopia and the Horn", creditHours: 6 }
    ],
    preEngineering: [
        { name: "Communicative English Language Skills II", creditHours: 5 },
        { name: "Social Anthropology", creditHours: 5 },
        { name: "Applied Mathematics I", creditHours: 5 },
        { name: "Enterprenuership", creditHours: 4 },
        { name: "Introduction to Emerging Technologies", creditHours: 5 },
        { name: "Moral and Civic Education", creditHours: 4 },
        { name: "Computer Programing", creditHours: 5 }
    ]
};

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`${tabName}-section`).classList.add('active');
    event.target.classList.add('active');

    document.querySelector('.container').classList.add('calculator-active');
}

function generateProgramCourses() {
    const program = document.getElementById('programSelect').value;
    const courseInputsDiv = document.getElementById('courseInputs');
    
    if (!program) {
        courseInputsDiv.innerHTML = '';
        return;
    }
    
    let courses = [];
    let totalCreditHours = 0;
    
    if (program === 'freshman') {
        courses = [
            { name: 'Communicative English Language Skills I', creditHours: 3 },
            { name: 'Critical Thinking', creditHours: 3 },
            { name: 'General Physics', creditHours: 3 },
            { name: 'General Psychology', creditHours: 3 },
            { name: 'Mathematics for Natural Sciences', creditHours: 3 },
            { name: 'Geography of Ethiopia and the Horn', creditHours: 3 }
        ];
        totalCreditHours = 18;
    } else if (program === 'preEngineering') {
        courses = [
            { name: 'Applied Mathematics I', creditHours: 4 },
            { name: 'Applied Mathematics II', creditHours: 4 },
            { name: 'General Physics I', creditHours: 4 },
            { name: 'General Physics II', creditHours: 4 },
            { name: 'General Chemistry', creditHours: 4 },
            { name: 'Introduction to Computing', creditHours: 3 },
            { name: 'Fundamentals of Programming', creditHours: 3 },
            { name: 'Engineering Drawing', creditHours: 3 },
            { name: 'Communicative English Skills', creditHours: 3 },
            { name: 'Technical Report Writing', creditHours: 1 }
        ];
        totalCreditHours = 33;
    }
    
    // Display total credit hours
    let html = `
        <div class="total-credits-display">
            <div class="credit-badge">Total Credit Hours: ${totalCreditHours}</div>
        </div>
    `;
    
    // Generate course inputs
    courses.forEach((course, index) => {
        html += `
            <div class="course-item">
                <div class="course-header">
                    <h3>${course.name}</h3>
                </div>
                <div class="course-input-group">
                    <div class="input-group">
                        <label for="grade-${index}" class="required-field">Grade:</label>
                        <select id="grade-${index}" class="grade-select" required>
                            <option value="">Select Grade</option>
                            <option value="4.0">A (4.0)</option>
                            <option value="3.75">A- (3.75)</option>
                            <option value="3.5">B+ (3.5)</option>
                            <option value="3.0">B (3.0)</option>
                            <option value="2.75">B- (2.75)</option>
                            <option value="2.5">C+ (2.5)</option>
                            <option value="2.0">C (2.0)</option>
                            <option value="1.75">C- (1.75)</option>
                            <option value="1.0">D (1.0)</option>
                            <option value="0">F (0)</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += `
        <button onclick="calculateGPA()" class="action-btn">
            <span>Calculate GPA</span>
        </button>
    `;
    
    courseInputsDiv.innerHTML = html;
}

function calculateGPA() {
    const program = document.getElementById('programSelect').value;
    const courseItems = document.querySelectorAll('.course-item');
    const resultDiv = document.getElementById('gpaResult');
    
    if (!program || courseItems.length === 0) {
        showMessage('Please select a program first.', 'error');
        return;
    }
    
    let totalPoints = 0;
    let totalCredits = 0;
    let validInputs = true;
    let courseDetails = [];
    
    // Get credit hours per course based on program
    const creditHoursPerCourse = program === 'freshman' ? 
        [3, 3, 3, 3, 3, 3] : // Freshman courses (all 3 credit hours)
        [4, 4, 4, 4, 4, 3, 3, 3, 3, 1]; // Pre-engineering courses
    
    courseItems.forEach((item, index) => {
        const gradeSelect = item.querySelector('.grade-select');
        const courseName = item.querySelector('.course-header h3').textContent;
        
        if (!gradeSelect.value) {
            gradeSelect.classList.add('error');
            validInputs = false;
            return;
        } else {
            gradeSelect.classList.remove('error');
        }
        
        const gradeValue = parseFloat(gradeSelect.value);
        const creditHours = creditHoursPerCourse[index];
        
        totalPoints += gradeValue * creditHours;
        totalCredits += creditHours;
        
        courseDetails.push({
            name: courseName,
            grade: gradeSelect.options[gradeSelect.selectedIndex].text,
            gradeValue: gradeValue,
            creditHours: creditHours,
            qualityPoints: (gradeValue * creditHours).toFixed(2)
        });
    });
    
    if (!validInputs) {
        showMessage('Please select grades for all courses.', 'error');
        return;
    }
    
    const gpa = totalPoints / totalCredits;
    
    // Determine performance level
    let performanceClass = '';
    let performanceMessage = '';
    let icon = '';
    
    if (gpa >= 3.85) {
        performanceClass = 'outstanding';
        performanceMessage = 'Outstanding Performance!';
        icon = '🌟';
    } else if (gpa >= 3.5) {
        performanceClass = 'excellent';
        performanceMessage = 'Excellent Achievement!';
        icon = '🎓';
    } else if (gpa >= 3.0) {
        performanceClass = 'very-good';
        performanceMessage = 'Very Good Performance!';
        icon = '📚';
    } else if (gpa >= 2.0) {
        performanceClass = 'satisfactory';
        performanceMessage = 'Satisfactory Progress.';
        icon = '📝';
    } else {
        performanceClass = 'warning';
        performanceMessage = 'Academic Warning.';
        icon = '⚠️';
    }
    
    // Create result HTML
    let resultHTML = `
        <div class="results-container">
            <h2 class="results-header">GPA Results</h2>
            <div class="gpa-summary ${performanceClass}">
                Your GPA is: ${gpa.toFixed(2)}
            </div>
            
            <div class="status-message ${performanceClass}">
                ${icon} ${performanceMessage}
            </div>
            
            <div class="course-summary">
                <h3>Course Details:</h3>
                <div class="course-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Grade</th>
                                <th>Credit Hours</th>
                                <th>Quality Points</th>
                            </tr>
                        </thead>
                        <tbody>
    `;
    
    courseDetails.forEach(course => {
        resultHTML += `
            <tr>
                <td>${course.name}</td>
                <td>${course.grade}</td>
                <td>${course.creditHours}</td>
                <td>${course.qualityPoints}</td>
            </tr>
        `;
    });
    
    resultHTML += `
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="2"><strong>Total</strong></td>
                                <td><strong>${totalCredits}</strong></td>
                                <td><strong>${totalPoints.toFixed(2)}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    resultDiv.innerHTML = resultHTML;
    resultDiv.classList.add('show', performanceClass);
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

function generateSemesterInputs() {
    const semesterInputs = document.getElementById('semesterInputs');
    semesterInputs.innerHTML = '';

    const semesters = [
        { name: "Freshman", creditHours: 30 },
        { name: "Pre-Engineering", creditHours: 33 }
    ];

    semesters.forEach((semester, index) => {
        const semesterItem = document.createElement('div');
        semesterItem.className = 'semester-item';
        semesterItem.innerHTML = `
            <div class="course-header">${semester.name} Semester</div>
            <div class="course-input-group">
                <div class="grade-group">
                    <label class="required-field">GPA:</label>
                    <input type="number" class="semester-gpa" placeholder="Enter GPA" 
                           step="0.01" min="0" max="4" required>
                </div>
                <div class="credit-display">
                    Total Credit Hours: ${semester.creditHours}
                </div>
            </div>
        `;
        semesterInputs.appendChild(semesterItem);
    });

    const calculateBtn = document.createElement('button');
    calculateBtn.className = 'action-btn calculate-btn';
    calculateBtn.innerHTML = '<span>Calculate CGPA</span>';
    calculateBtn.onclick = calculateCGPA;
    semesterInputs.appendChild(calculateBtn);

    document.querySelector('.container').classList.add('calculator-active');
}

function calculateCGPA() {
    // Get the input elements
    const freshmanInput = document.querySelector('.semester-card.freshman .semester-gpa');
    const preEngineeringInput = document.querySelector('.semester-card.pre-engineering .semester-gpa');
    
    // Check if inputs exist
    if (!freshmanInput || !preEngineeringInput) {
        showMessage('Error: GPA input fields not found.', 'error');
        return;
    }
    
    // Get the GPA values
    const freshmanGPA = parseFloat(freshmanInput.value);
    const preEngineeringGPA = parseFloat(preEngineeringInput.value);
    
    // Validate that inputs are not empty
    if (!freshmanInput.value || !preEngineeringInput.value) {
        showMessage('Please enter GPA values for both semesters.', 'error');
        return;
    }

    // Validate that inputs are valid numbers
    if (isNaN(freshmanGPA) || isNaN(preEngineeringGPA)) {
        showMessage('Please enter valid numeric GPA values.', 'error');
        return;
    }
    
    // Validate GPA range
    if (freshmanGPA < 0 || freshmanGPA > 4 || preEngineeringGPA < 0 || preEngineeringGPA > 4) {
        showMessage('GPA values must be between 0 and 4.', 'error');
        return;
    }

    // Calculate CGPA
    const freshmanCreditHours = 30; // Changed back to 30
    const preEngineeringCreditHours = 33;
    const totalCreditHours = freshmanCreditHours + preEngineeringCreditHours;
    
    const freshmanQualityPoints = freshmanGPA * freshmanCreditHours;
    const preEngineeringQualityPoints = preEngineeringGPA * preEngineeringCreditHours;
    const totalQualityPoints = freshmanQualityPoints + preEngineeringQualityPoints;
    
    const cgpa = totalQualityPoints / totalCreditHours;

    // Display results
    const resultsDiv = document.getElementById('cgpaResult');
    resultsDiv.innerHTML = `
        <div class="results-container">
            <h2 class="results-header">CGPA Results</h2>
            <div class="cgpa-value">CGPA: ${cgpa.toFixed(2)}</div>
            
            <div class="semester-details">
                <div class="semester-summary">
                    <h3>Freshman Semester</h3>
                    <p>GPA: ${freshmanGPA.toFixed(2)}</p>
                    <p>Credit Hours: ${freshmanCreditHours}</p>
                    <p>Quality Points: ${freshmanQualityPoints.toFixed(2)}</p>
                </div>
                
                <div class="semester-summary">
                    <h3>Pre-engineering Semester</h3>
                    <p>GPA: ${preEngineeringGPA.toFixed(2)}</p>
                    <p>Credit Hours: ${preEngineeringCreditHours}</p>
                    <p>Quality Points: ${preEngineeringQualityPoints.toFixed(2)}</p>
                </div>
                
                <div class="total-summary">
                    <h3>Total Summary</h3>
                    <p>Total Credit Hours: ${totalCreditHours}</p>
                    <p>Total Quality Points: ${totalQualityPoints.toFixed(2)}</p>
                </div>
            </div>
        </div>
    `;

    // Show performance message
    let performanceMessage = '';
    let performanceClass = '';
    let icon = '';

    if (cgpa >= 3.85) {
        performanceMessage = 'Outstanding Performance! Keep up the excellent work!';
        performanceClass = 'outstanding';
        icon = '🌟';
    } else if (cgpa >= 3.5) {
        performanceMessage = 'Excellent Achievement! You\'re doing great!';
        performanceClass = 'excellent';
        icon = '🎓';
    } else if (cgpa >= 3.0) {
        performanceMessage = 'Very Good Performance! Keep pushing forward!';
        performanceClass = 'very-good';
        icon = '📚';
    } else if (cgpa >= 2.0) {
        performanceMessage = 'Satisfactory Progress. There\'s room for improvement!';
        performanceClass = 'satisfactory';
        icon = '📝';
    } else {
        performanceMessage = 'Academic Warning: Please seek academic guidance.';
        performanceClass = 'warning';
        icon = '⚠️';
    }

    const statusMessage = document.createElement('div');
    statusMessage.className = `status-message ${performanceClass}`;
    statusMessage.innerHTML = `${icon} ${performanceMessage}`;
    resultsDiv.appendChild(statusMessage);

    // Scroll to results
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Add input validation for GPA inputs
    const gpaInputs = document.querySelectorAll('.semester-gpa');
    gpaInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value;
            
            // Allow only numbers and one decimal point
            if (!/^(\d*\.?\d*)?$/.test(value)) {
                // If invalid characters, revert to previous valid value
                value = value.replace(/[^\d.]/g, '');
                
                // Ensure only one decimal point
                const parts = value.split('.');
                if (parts.length > 2) {
                    value = parts[0] + '.' + parts.slice(1).join('');
                }
            }
            
            // If value is greater than 4, cap it at 4
            if (value !== '' && parseFloat(value) > 4) {
                value = '4';
            }
            
            // Update the input value
            e.target.value = value;
            
            // Validate input
            if (value === '') {
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });

        // Add blur event to validate when input loses focus
        input.addEventListener('blur', (e) => {
            const value = e.target.value;
            
            if (!value) {
                input.classList.add('error');
                showMessage('Please enter a GPA value.', 'error');
                return;
            }
            
            // Format to 2 decimal places when losing focus
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
                e.target.value = numValue.toFixed(2);
            }
        });
    });

    // Add click event listener to calculate button
    const calculateButton = document.querySelector('.calculate-btn');
    if (calculateButton) {
        calculateButton.addEventListener('click', calculateCGPA);
    }
});

// Add input validation for required fields
document.querySelectorAll('input[required]').forEach(input => {
    input.addEventListener('input', () => {
        const errorMsg = document.getElementById(`${input.id}Error`);
        if (input.value.trim()) {
            errorMsg.classList.remove('show');
        }
    });
});

// Add this function to reset the calculator
function resetCalculator() {
    document.getElementById('programSelect').value = '';
    document.getElementById('courseInputs').innerHTML = '';
    document.getElementById('gpaResult').innerHTML = '';
    document.getElementById('semesterInputs').innerHTML = '';
    document.getElementById('cgpaResult').innerHTML = '';
    document.querySelector('.container').classList.remove('calculator-active');
}

// Add click event listener to logo for reset functionality
document.querySelector('.logo').addEventListener('click', resetCalculator); 