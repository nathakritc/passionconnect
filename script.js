/* script.js */

const appContainer = document.getElementById('app-container');
const navbarLogo = document.getElementById('logo');

// --- Helper Functions ---

function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function clearAppContainer() {
    appContainer.innerHTML = '';
}

function createDropdown(id, count) {
    let options = '';
    for (let i = 1; i <= count; i++) {
        options += `<option value="${i}">${i}</option>`;
    }
    return `<select id="${id}" required>${options}</select>`;
}

function createCheckbox(id, label) {
    return `
        <div>
            <input type="checkbox" id="${id}" name="availability" value="${id}">
            <label for="${id}">${label}</label>
        </div>
    `;
}

// --- View Rendering Functions ---

function renderHomeView() {
    clearAppContainer();
    appContainer.innerHTML = `
        <section id="hero">
            <h1>Welcome to Passion Connect</h1>
            <p>Connect with tutors or students based on your passions.</p>
        </section>
        <div id="role-selector">
            <button id="student-btn">I am a Student</button>
            <button id="tutor-btn">I am a Tutor</button>
        </div>
    `;
    document.getElementById('student-btn').addEventListener('click', renderStudentForm);
    document.getElementById('tutor-btn').addEventListener('click', renderTutorForm);
}

function renderStudentForm() {
    clearAppContainer();
    appContainer.innerHTML = `
        <div class="form-container">
            <form id="student-form">
                <h2>Student Registration</h2>
                <div class="form-group">
                    <label for="student-name">Name</label>
                    <input type="text" id="student-name" required>
                </div>
                <div class="form-group">
                    <label for="student-age">Age</label>
                    <input type="number" id="student-age" required>
                </div>
                <div class="form-group">
                    <label for="student-grade">Grade</label>
                    <input type="number" id="student-grade" required>
                </div>
                <div class="form-group">
                    <label for="student-school">School</label>
                    <input type="text" id="student-school" required>
                </div>
                <div class="form-group">
                    <label for="student-interests">Top 3 Interests</label>
                    <input type="text" id="student-interests" placeholder="e.g. Music, Animals, Science" required>
                </div>
                <div class="form-group">
                    <label>Confidence Ratings (1-5) for Interests</label>
                    <div id="confidence-ratings-container"></div>
                </div>
                <div class="form-group">
                    <label for="student-dreamjob">Dream Job</label>
                    <input type="text" id="student-dreamjob" required>
                </div>
                <button type="submit" id="student-submit">Register as Student</button>
            </form>
        </div>
    `;

    const studentInterestsInput = document.getElementById('student-interests');
    const confidenceRatingsContainer = document.getElementById('confidence-ratings-container');

    studentInterestsInput.addEventListener('input', () => {
        const interests = studentInterestsInput.value.split(',').map(item => item.trim()).filter(item => item !== '');
        confidenceRatingsContainer.innerHTML = '';
        interests.slice(0, 3).forEach((interest, index) => {
            confidenceRatingsContainer.innerHTML += `
                <div class="form-group">
                    <label for="confidence-${index + 1}">Confidence in ${interest}</label>
                    ${createDropdown(`confidence-${index + 1}`, 5)}
                </div>
            `;
        });
    });

    document.getElementById('student-form').addEventListener('submit', handleStudentFormSubmit);
}

function renderTutorForm() {
    clearAppContainer();
    appContainer.innerHTML = `
        <div class="form-container">
            <form id="tutor-form">
                <h2>Tutor Registration</h2>
                <div class="form-group">
                    <label for="tutor-name">Name</label>
                    <input type="text" id="tutor-name" required>
                </div>
                <div class="form-group">
                    <label for="tutor-age">Age/Year Level</label>
                    <input type="number" id="tutor-age" required>
                </div>
                <div class="form-group">
                    <label for="tutor-school">School</label>
                    <input type="text" id="tutor-school" required>
                </div>
                <div class="form-group">
                    <label for="tutor-subjects">Subjects/Topics</label>
                    <input type="text" id="tutor-subjects" placeholder="e.g. Math, English" required>
                </div>
                <div class="form-group">
                    <label for="tutor-hobbies">Hobbies/Skills</label>
                    <input type="text" id="tutor-hobbies" placeholder="e.g. Guitar, Soccer" required>
                </div>
                <div class="form-group">
                    <label>Availability Slots</label>
                    <div class="checkbox-group">
                        ${createCheckbox('avail-mon-am', 'Monday AM')}
                        ${createCheckbox('avail-mon-pm', 'Monday PM')}
                        ${createCheckbox('avail-tue-am', 'Tuesday AM')}
                        ${createCheckbox('avail-tue-pm', 'Tuesday PM')}
                        ${createCheckbox('avail-wed-am', 'Wednesday AM')}
                        ${createCheckbox('avail-wed-pm', 'Wednesday PM')}
                        ${createCheckbox('avail-thu-am', 'Thursday AM')}
                        ${createCheckbox('avail-thu-pm', 'Thursday PM')}
                        ${createCheckbox('avail-fri-am', 'Friday AM')}
                        ${createCheckbox('avail-fri-pm', 'Friday PM')}
                        ${createCheckbox('avail-sat-am', 'Saturday AM')}
                        ${createCheckbox('avail-sat-pm', 'Saturday PM')}
                        ${createCheckbox('avail-sun-am', 'Sunday AM')}
                        ${createCheckbox('avail-sun-pm', 'Sunday PM')}
                    </div>
                </div>
                <button type="submit" id="tutor-submit">Register as Tutor</button>
            </form>
        </div>
    `;
    document.getElementById('tutor-form').addEventListener('submit', handleTutorFormSubmit);
}

function renderConfirmationView(userName) {
    clearAppContainer();
    appContainer.innerHTML = `
        <section id="confirmation">
            <h2>Welcome, ${userName}! Your registration is complete.</h2>
            <button id="return-home">Return Home</button>
        </section>
    `;
    document.getElementById('return-home').addEventListener('click', renderHomeView);
}

function renderAdminDashboard() {
    clearAppContainer();
    const students = getFromLocalStorage('students') || [];
    const tutors = getFromLocalStorage('tutors') || [];

    let studentsTableRows = students.map(student => `
        <tr>
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.grade}</td>
            <td>${student.school}</td>
            <td>${student.interests.map(i => `<span class="emoji-tag">${i}</span>`).join('')}</td>
            <td>${student.confidence_ratings.join(', ')}</td>
            <td>${student.dream_job}</td>
        </tr>
    `).join('');

    let tutorsTableRows = tutors.map(tutor => `
        <tr>
            <td>${tutor.name}</td>
            <td>${tutor.age_year}</td>
            <td>${tutor.school}</td>
            <td>${tutor.subjects.map(s => `<span class="emoji-tag">${s}</span>`).join('')}</td>
            <td>${tutor.hobbies_skills.map(h => `<span class="emoji-tag">${h}</span>`).join('')}</td>
            <td>${tutor.availability_slots.join(', ')}</td>
        </tr>
    `).join('');

    appContainer.innerHTML = `
        <section id="admin-dashboard">
            <h2>Admin Dashboard</h2>

            <h3>Students</h3>
            <table id="students-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Grade</th>
                        <th>School</th>
                        <th>Top 3 Interests</th>
                        <th>Confidence Ratings</th>
                        <th>Dream Job</th>
                    </tr>
                </thead>
                <tbody>
                    ${studentsTableRows}
                </tbody>
            </table>

            <h3>Tutors</h3>
            <table id="tutors-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Age/Year</th>
                        <th>School</th>
                        <th>Subjects</th>
                        <th>Hobbies/Skills</th>
                        <th>Availability Slots</th>
                    </tr>
                </thead>
                <tbody>
                    ${tutorsTableRows}
                </tbody>
            </table>
        </section>
    `;
}

// --- Event Handlers ---

function handleStudentFormSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('student-name').value;
    const age = parseInt(document.getElementById('student-age').value);
    const grade = parseInt(document.getElementById('student-grade').value);
    const school = document.getElementById('student-school').value;
    const interests = document.getElementById('student-interests').value.split(',').map(item => item.trim()).filter(item => item !== '');
    const dreamJob = document.getElementById('student-dreamjob').value;

    const confidenceRatings = [];
    for (let i = 1; i <= interests.slice(0, 3).length; i++) {
        const confidence = document.getElementById(`confidence-${i}`);
        if (confidence) {
            confidenceRatings.push(parseInt(confidence.value));
        }
    }

    if (interests.length === 0 || confidenceRatings.length !== interests.slice(0, 3).length) {
        alert('Please enter at least one interest and provide confidence ratings for all entered interests.');
        return;
    }

    const student = {
        id: generateUniqueId(),
        name,
        age,
        grade,
        school,
        interests: interests.slice(0, 3),
        confidence_ratings: confidenceRatings,
        dream_job: dreamJob
    };

    const students = getFromLocalStorage('students') || [];
    students.push(student);
    saveToLocalStorage('students', students);
    saveToLocalStorage('session_user', { name: name, role: 'student' });

    renderConfirmationView(name);
}

function handleTutorFormSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('tutor-name').value;
    const ageYear = parseInt(document.getElementById('tutor-age').value);
    const school = document.getElementById('tutor-school').value;
    const subjects = document.getElementById('tutor-subjects').value.split(',').map(item => item.trim()).filter(item => item !== '');
    const hobbiesSkills = document.getElementById('tutor-hobbies').value.split(',').map(item => item.trim()).filter(item => item !== '');

    const availabilitySlots = [];
    document.querySelectorAll('input[name="availability"]:checked').forEach(checkbox => {
        availabilitySlots.push(checkbox.value);
    });

    if (subjects.length === 0) {
        alert('Please enter at least one subject.');
        return;
    }

    const tutor = {
        id: generateUniqueId(),
        name,
        age_year: ageYear,
        school,
        subjects,
        hobbies_skills: hobbiesSkills,
        availability_slots: availabilitySlots
    };

    const tutors = getFromLocalStorage('tutors') || [];
    tutors.push(tutor);
    saveToLocalStorage('tutors', tutors);
    saveToLocalStorage('session_user', { name: name, role: 'tutor' });

    renderConfirmationView(name);
}

function handleAdminLoginKeyCombo(event) {
    if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        const username = prompt('Enter admin username:');
        const password = prompt('Enter admin password:');

        if (username === 'admin' && password === 'adminpass') {
            renderAdminDashboard();
        } else {
            alert('Invalid credentials.');
        }
    }
}

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    renderHomeView();
    navbarLogo.addEventListener('click', renderHomeView);
    document.addEventListener('keydown', handleAdminLoginKeyCombo);
});
