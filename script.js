function showTab(tab){
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById(tab + '-section').classList.add('active');
  event.target.classList.add('active');
}

// Course lists
function generateProgramCourses(){
  const program = document.getElementById('programSelect').value;
  const container = document.getElementById('courseInputs');
  container.innerHTML = '';
  
  let courses = [];
  if(program === 'freshman'){
    courses = [
      {name: 'Communicative English Language Skills I', code: 'FLEn 1011', cr: 3},
      {name: 'Critical Thinking', code: 'LoCT 1011', cr: 3},
      {name: 'General Physics', code: 'Phys 1011', cr: 3},
      {name: 'General Psychology', code: 'Psyc 1011', cr: 3},
      {name: 'Mathematics for Natural Sciences', code: 'Math 1011', cr: 3},
      {name: 'Geography of Ethiopia and the Horn', code: 'GeES 1011', cr: 3}
    ];
  } else if(program === 'preEngineering'){
    courses = [
      {name: 'Communicative English Language Skills II', code: 'FLEn 1012', cr: 3},
      {name: 'Social Anthropology', code: 'Anth 1012', cr: 2},
      {name: 'Applied Mathematics I', code: 'Math 1041', cr: 3},
      {name: 'Entrepreneurship', code: 'Mgmt 1012', cr: 3},
      {name: 'Introduction to Emerging Technologies', code: 'EmTe 1012', cr: 3},
      {name: 'Moral and Civic Education', code: 'McIE 1012', cr: 2},
      {name: 'Computer Programming', code: 'ECEg 2052', cr: 3}
    ];
  }
  
  courses.forEach((c, i) => {
    container.innerHTML += `
      <div class="course-item">
        <div class="course-header">
          <span class="course-name">${c.name} (${c.code})</span>
          <span class="course-credit">${c.cr} CrH</span>
        </div>
        <select id="grade-${i}">
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
      </div>`;
  });
  
  container.innerHTML += `<button class="action-btn" onclick="calculateGPA('${program}')">Calculate GPA</button>`;
}

// GPA calculation
function calculateGPA(program){
  const resultDiv = document.getElementById('gpaResult');
  let totalPts = 0, totalCr = 0;
  
  let crs = (program === 'freshman') ? [3,3,3,3,3,3] : [3,2,3,3,3,2,3];
  
  crs.forEach((cr, i) => {
    const gradeSelect = document.getElementById('grade-' + i);
    const g = gradeSelect.value;
    
    if(!g){
      gradeSelect.style.borderColor = 'var(--error-color)';
      alert('Please select all grades!');
      return;
    } else {
      gradeSelect.style.borderColor = '';
    }
    
    totalPts += parseFloat(g) * cr;
    totalCr += cr;
  });
  
  const gpa = totalPts / totalCr;
  let performance = '';
  
  if(gpa >= 3.5) performance = 'Excellent!';
  else if(gpa >= 3.0) performance = 'Very Good!';
  else if(gpa >= 2.5) performance = 'Good';
  else if(gpa >= 2.0) performance = 'Satisfactory';
  else performance = 'Needs Improvement';
  
  resultDiv.innerHTML = `
    <div class="gpa-summary">Your GPA: ${gpa.toFixed(2)}</div>
    <div class="performance-message">${performance}</div>
  `;
}

// CGPA calculation
function calculateCGPA(){
  const f = document.getElementById('freshmanGPA').value;
  const p = document.getElementById('preEngGPA').value;
  
  if(!f || !p){
    alert('Please enter both GPAs!');
    return;
  }
  
  const fG = parseFloat(f), pG = parseFloat(p);
  
  if(isNaN(fG) || isNaN(pG) || fG > 4.0 || pG > 4.0){
    alert('Please enter valid GPA values (0-4)!');
    return;
  }
  
  const totalQP = (fG * 30) + (pG * 33);
  const cgpa = totalQP / (30 + 33);
  
  let performance = '';
  if(cgpa >= 3.5) performance = 'Outstanding!';
  else if(cgpa >= 3.0) performance = 'Excellent!';
  else if(cgpa >= 2.5) performance = 'Very Good';
  else if(cgpa >= 2.0) performance = 'Good';
  else performance = 'Needs Improvement';
  
  document.getElementById('cgpaResult').innerHTML = `
    <div class="gpa-summary">Your CGPA: ${cgpa.toFixed(2)}</div>
    <div class="performance-message">${performance}</div>
  `;
}

