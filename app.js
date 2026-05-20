
document.addEventListener('DOMContentLoaded', function () {
    const page = document.body.dataset.page;

    if (page === 'home') {
        showCurrentDate();
    }

    if (page === 'sports') {
        setupSportsPage();
    }

    if (page === 'feedback') {
        setupFeedbackPage();
    }
});

const eventList = [
    {
        id: 'EVT-101',
        name: '100m Sprint',
        category: 'Track',
        date: '2026-06-11',
        time: '09:00 AM',
        venue: 'Main Track Field',
        fee: '$10',
        status: 'Open'
    },
    {
        id: 'EVT-102',
        name: 'Throw Ball',
        category: 'Field',
        date: '2026-06-12',
        time: '11:00 AM',
        venue: 'East Ground',
        fee: '$12',
        status: 'Open'
    },
    {
        id: 'EVT-103',
        name: 'Basketball',
        category: 'Team',
        date: '2026-06-13',
        time: '03:00 PM',
        venue: 'Sports Court A',
        fee: '$15',
        status: 'Open'
    },
    {
        id: 'EVT-104',
        name: 'Badminton Singles',
        category: 'Racquet',
        date: '2026-06-14',
        time: '10:30 AM',
        venue: 'Indoor Court',
        fee: '$8',
        status: 'Open'
    },
    {
        id: 'EVT-105',
        name: 'Long Jump',
        category: 'Field',
        date: '2026-06-11',
        time: '02:00 PM',
        venue: 'Long Jump Pit',
        fee: '$10',
        status: 'Open'
    }
];

//Home page functionssss
function showCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (!dateElement) return;
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    dateElement.textContent = formattedDate;
}

// Sports wala page 
function setupSportsPage() {
    const eventTableBody = document.getElementById('eventTableBody');
    const participantForm = document.getElementById('participantForm');
    const participantMessage = document.getElementById('participantMessage');
    const participantCount = document.getElementById('participantCount');
    const participantDetails = document.getElementById('participantDetails');

    const eventSelect = document.getElementById('participantEvent');
    if (!eventTableBody || !participantForm || !participantMessage || !participantCount || !participantDetails || !eventSelect) {
        return;
    }

    renderEventTable(eventTableBody, eventList);
    populateEventSelect(eventSelect, eventList);
    const storageKey = 'campusSportsParticipants';
    let participants = JSON.parse(localStorage.getItem(storageKey)) || [];

    updateParticipantDisplay(participants, participantCount, participantDetails);
    participantForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('studentName').value.trim();
        const regNumber = document.getElementById('registrationNumber').value.trim();
        const email = document.getElementById('studentEmail').value.trim();
        const phone = document.getElementById('studentPhone').value.trim();
        const department = document.getElementById('studentDepartment').value;
        const teamMembers = document.getElementById('teamMembers').value;
        const eventId = eventSelect.value;
        const eventName = eventSelect.selectedOptions[0]?.text || '';

        const errors = [];

        if (!name) {
            errors.push('Student name is required.');
        }
        if (!regNumber) {
            errors.push('Registration number is required.');
        }
        if (!validateEmail(email)) {
            errors.push('Enter a valid email address.');
        }
        if (!/^[0-9]{10}$/.test(phone)) {
            errors.push('Phone number must be 10 digits.');
        }
        if (!department) {
            errors.push('Department is required.');
        }
        if (!teamMembers) {
            errors.push('Number of team members is required.');
        }
        if (!eventId) {
            errors.push('Please select an event.');
        }

        const duplicate = participants.some(item => item.eventId === eventId && (item.regNumber.toLowerCase() === regNumber.toLowerCase() || item.email.toLowerCase() === email.toLowerCase()));
        if (duplicate) {
            errors.push('This student has already registered for this event.');
        }

        if (errors.length > 0) {
            showMessage(participantMessage, errors.join(' '), 'error');
            return;
        }

        const newParticipant = {
            id: 'PART-' + Date.now(),
            name: name,
            regNumber: regNumber,
            email: email,
            phone: phone,
            department: department,
            teamMembers: teamMembers,
            eventId: eventId,
            eventName: eventName
        };

        participants.push(newParticipant);
        localStorage.setItem(storageKey, JSON.stringify(participants));

        showMessage(participantMessage, 'Participation submitted successfully!', 'success');
        updateParticipantDisplay(participants, participantCount, participantDetails);
        participantForm.reset();
    });
}

function renderEventTable(container, events) {
    container.innerHTML = '';
    events.forEach(event => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${event.id}</td>
            <td>${event.name}</td>
            <td>${event.category}</td>
            <td>${event.date}</td>
            <td>${event.time}</td>
            <td>${event.venue}</td>
            <td>${event.fee}</td>
            <td>${event.status}</td>
        `;
        container.appendChild(row);
    });
}

function populateEventSelect(selectElement, events) {
    selectElement.innerHTML = '<option value="">Select event</option>' +
        events.map(event => `<option value="${event.id}">${event.name}</option>`).join('');
}

function updateParticipantDisplay(participants, countElement, detailsElement) {
    countElement.textContent = `${participants.length} student(s) registered`;
    renderParticipantDetails(participants, detailsElement);
}

function renderParticipantDetails(participants, container) {
    if (participants.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = participants
        .map(participant => `
            <tr>
                <td>${participant.name}</td>
                <td>${participant.regNumber}</td>
                <td>${participant.eventName || ''}</td>
                <td>${participant.email}</td>
                <td>${participant.phone}</td>
                <td>${participant.department}</td>
                <td>${participant.teamMembers}</td>
            </tr>
        `)
        .join('');
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// --- Feedback page functions ---
function setupFeedbackPage() {
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const feedbackList = document.getElementById('feedbackList');
    const feedbackEvent = document.getElementById('feedbackEvent');

    if (!feedbackForm || !feedbackMessage || !feedbackList || !feedbackEvent) {
        return;
    }

    populateEventSelect(feedbackEvent, eventList);
    const storageKey = 'campusSportsFeedback';
    let feedbackItems = JSON.parse(localStorage.getItem(storageKey)) || [];
    renderFeedbackList(feedbackItems, feedbackList);

    feedbackForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('feedbackName').value.trim();
        const regNumber = document.getElementById('feedbackReg').value.trim();
        const rating = document.getElementById('feedbackRating').value.trim();
        const feedbackEventId = feedbackEvent.value;
        const feedbackEventName = feedbackEvent.selectedOptions[0]?.text || '';
        const message = document.getElementById('feedbackMessageInput').value.trim();

        if (!name || !regNumber || !rating || !feedbackEventId || !message) {
            showMessage(feedbackMessage, 'Please fill in all feedback fields.', 'error');
            return;
        }

        if (!/^[1-5]$/.test(rating)) {
            showMessage(feedbackMessage, 'Rating must be a number from 1 to 5.', 'error');
            return;
        }

        if (!feedbackEventId) {
            showMessage(feedbackMessage, 'Please select an event for feedback.', 'error');
            return;
        }

        if (message.length < 20) {
            showMessage(feedbackMessage, 'Feedback message must be at least 20 characters long.', 'error');
            return;
        }

        const newFeedback = {
            id: 'FB-' + Date.now(),
            name: name,
            regNumber: regNumber,
            rating: rating,
            eventId: feedbackEventId,
            eventName: feedbackEventName,
            message: message,
            date: new Date().toLocaleString()
        };

        feedbackItems.push(newFeedback);
        localStorage.setItem(storageKey, JSON.stringify(feedbackItems));

        showMessage(feedbackMessage, 'Feedback submitted successfully.', 'success');
        feedbackForm.reset();
        renderFeedbackList(feedbackItems, feedbackList);
    });
}

function renderFeedbackList(items, container) {
    if (items.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = items
        .map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.regNumber}</td>
                <td>${item.eventName || ''}</td>
                <td>${item.rating || ''}</td>
                <td>${item.message}</td>
                <td>${item.date}</td>
            </tr>
        `)
        .join('');
}

function showMessage(element, text, type) {
    if (!element) return;
    element.textContent = text;
    element.className = `message ${type}`;

    window.setTimeout(function () {
        element.textContent = '';
        element.className = 'message';
    }, 4000);
}
