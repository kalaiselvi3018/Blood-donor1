// ===============================
// BLOOD DONOR FINDER
// ===============================

// Load saved donors
let donors = JSON.parse(localStorage.getItem("donors")) || [];

// ===============================
// SAVE DONORS
// ===============================

function saveDonors() {
  localStorage.setItem("donors", JSON.stringify(donors));
}

// ===============================
// REGISTER DONOR
// ===============================

function addDonor() {
  const name = document.getElementById("name").value.trim();
  const age = document.getElementById("age").value;
  const bloodGroup = document.getElementById("bloodGroup").value;
  const city = document.getElementById("city").value.trim();
  const phone = document.getElementById("phone").value.trim();

  // Check empty fields
  if (
    name === "" ||
    age === "" ||
    bloodGroup === "" ||
    city === "" ||
    phone === ""
  ) {
    alert("⚠️ Please fill all fields!");
    return;
  }

  // Age validation
  if (Number(age) < 18) {
    alert("⚠️ Donor must be 18 years or older.");
    return;
  }

  if (Number(age) > 65) {
    alert("⚠️ Please check the donor age.");
    return;
  }

  // Phone validation
  if (phone.length < 10) {
    alert("⚠️ Please enter a valid phone number.");
    return;
  }

  // Create donor
  const donor = {
    id: Date.now(),
    name: name,
    age: age,
    bloodGroup: bloodGroup,
    city: city,
    phone: phone,
  };

  // Add donor
  donors.push(donor);

  // Save
  saveDonors();

  alert("✅ Donor registered successfully!");

  // Clear form
  document.getElementById("name").value = "";
  document.getElementById("age").value = "";
  document.getElementById("bloodGroup").value = "";
  document.getElementById("city").value = "";
  document.getElementById("phone").value = "";

  // Update page
  updateDashboard();
  showAllDonors();

  // Download CSV
  downloadCSV();
}

// ===============================
// SHOW ALL DONORS
// ===============================

function showAllDonors() {
  const donorList = document.getElementById("donorList");

  if (!donorList) {
    return;
  }

  if (donors.length === 0) {
    donorList.innerHTML = `
            <div class="empty-message">
                🩸 No donors registered yet.
            </div>
        `;
    return;
  }

  donorList.innerHTML = "";

  donors.forEach(function (donor) {
    donorList.innerHTML += `
            <div class="donor-card">

                <h3>🩸 ${donor.name}</h3>

                <p><strong>Age:</strong> ${donor.age}</p>

                <p>
                    <strong>Blood Group:</strong>
                    <span class="blood-badge">
                        ${donor.bloodGroup}
                    </span>
                </p>

                <p><strong>City:</strong> ${donor.city}</p>

                <p><strong>Phone:</strong> ${donor.phone}</p>

                <div class="donor-buttons">

                    <button
                        class="call-btn"
                        onclick="callDonor('${donor.phone}')">
                        📞 Call
                    </button>

                    <button
                        class="message-btn"
                        onclick="messageDonor('${donor.phone}')">
                        💬 Message
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteDonor(${donor.id})">
                        🗑️ Delete
                    </button>

                </div>

            </div>
        `;
  });
}

// ===============================
// SEARCH DONORS
// ===============================

function searchDonors() {
  const searchBlood = document.getElementById("searchBlood").value;

  const searchCity = document
    .getElementById("searchCity")
    .value.trim()
    .toLowerCase();

  const donorList = document.getElementById("donorList");

  const results = donors.filter(function (donor) {
    const bloodMatch = searchBlood === "" || donor.bloodGroup === searchBlood;

    const cityMatch =
      searchCity === "" || donor.city.toLowerCase().includes(searchCity);

    return bloodMatch && cityMatch;
  });

  if (results.length === 0) {
    donorList.innerHTML = `
            <div class="empty-message">
                ❌ No matching donors found.
            </div>
        `;

    return;
  }

  donorList.innerHTML = "";

  results.forEach(function (donor) {
    donorList.innerHTML += `
            <div class="donor-card">

                <h3>🩸 ${donor.name}</h3>

                <p><strong>Age:</strong> ${donor.age}</p>

                <p>
                    <strong>Blood Group:</strong>
                    <span class="blood-badge">
                        ${donor.bloodGroup}
                    </span>
                </p>

                <p><strong>City:</strong> ${donor.city}</p>

                <p><strong>Phone:</strong> ${donor.phone}</p>

                <div class="donor-buttons">

                    <button
                        class="call-btn"
                        onclick="callDonor('${donor.phone}')">
                        📞 Call
                    </button>

                    <button
                        class="message-btn"
                        onclick="messageDonor('${donor.phone}')">
                        💬 Message
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteDonor(${donor.id})">
                        🗑️ Delete
                    </button>

                </div>

            </div>
        `;
  });
}

// ===============================
// RESET SEARCH
// ===============================

function resetSearch() {
  document.getElementById("searchBlood").value = "";
  document.getElementById("searchCity").value = "";

  showAllDonors();
}

// ===============================
// CALL DONOR
// ===============================

function callDonor(phone) {
  window.location.href = "tel:" + phone;
}

// ===============================
// MESSAGE DONOR
// ===============================

function messageDonor(phone) {
  window.location.href = "sms:" + phone;
}

// ===============================
// DELETE DONOR
// ===============================

function deleteDonor(id) {
  const confirmDelete = confirm("Are you sure you want to delete this donor?");

  if (!confirmDelete) {
    return;
  }

  donors = donors.filter(function (donor) {
    return donor.id !== id;
  });

  saveDonors();

  alert("🗑️ Donor deleted successfully!");

  showAllDonors();
  updateDashboard();

  downloadCSV();
}

// ===============================
// DELETE ALL DONORS
// ===============================

function deleteAllDonors() {
  if (donors.length === 0) {
    alert("No donors to delete.");
    return;
  }

  const confirmDelete = confirm("⚠️ Delete ALL donors?");

  if (!confirmDelete) {
    return;
  }

  donors = [];

  saveDonors();

  alert("🗑️ All donors deleted.");

  showAllDonors();
  updateDashboard();

  downloadCSV();
}

// ===============================
// DASHBOARD
// ===============================

function updateDashboard() {
  const totalDonors = document.getElementById("totalDonors");

  const totalBloodGroups = document.getElementById("totalBloodGroups");

  const totalCities = document.getElementById("totalCities");

  if (totalDonors) {
    totalDonors.textContent = donors.length;
  }

  if (totalBloodGroups) {
    const groups = new Set(
      donors.map(function (donor) {
        return donor.bloodGroup;
      }),
    );

    totalBloodGroups.textContent = groups.size;
  }

  if (totalCities) {
    const cities = new Set(
      donors.map(function (donor) {
        return donor.city.toLowerCase();
      }),
    );

    totalCities.textContent = cities.size;
  }

  updateBloodGroupCounts();
}

// ===============================
// BLOOD GROUP COUNTS
// ===============================

function updateBloodGroupCounts() {
  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  bloodGroups.forEach(function (group) {
    const count = donors.filter(function (donor) {
      return donor.bloodGroup === group;
    }).length;

    const element = document.getElementById(
      "count-" + group.replace("+", "\\+").replace("-", "\\-"),
    );

    if (element) {
      element.textContent = count;
    }

    // Alternative ID handling
    const simpleId =
      "count-" + group.replace("+", "plus").replace("-", "minus");

    const simpleElement = document.getElementById(simpleId);

    if (simpleElement) {
      simpleElement.textContent = count;
    }
  });
}

// ===============================
// DOWNLOAD CSV
// ===============================

function downloadCSV() {
  if (donors.length === 0) {
    return;
  }

  let csv = "Name,Age,Blood Group,City,Phone\n";

  donors.forEach(function (donor) {
    csv += `"${donor.name}","${donor.age}","${donor.bloodGroup}","${donor.city}","${donor.phone}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "blood_donors.csv";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

// ===============================
// EMERGENCY REQUEST
// ===============================

function sendEmergencyRequest() {
  const patientName = document.getElementById("patientName").value.trim();

  const blood = document.getElementById("emergencyBlood").value;

  const hospital = document.getElementById("hospital").value.trim();

  const city = document.getElementById("emergencyCity").value.trim();

  if (patientName === "" || blood === "" || hospital === "" || city === "") {
    alert("⚠️ Please fill all emergency request fields.");
    return;
  }

  alert(
    "🚨 Emergency request sent!\n\n" +
      "Patient: " +
      patientName +
      "\n" +
      "Blood Group: " +
      blood +
      "\n" +
      "Hospital: " +
      hospital +
      "\n" +
      "City: " +
      city,
  );

  document.getElementById("patientName").value = "";
  document.getElementById("emergencyBlood").value = "";
  document.getElementById("hospital").value = "";
  document.getElementById("emergencyCity").value = "";
}

// ===============================
// DARK MODE
// ===============================

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  const darkMode = document.body.classList.contains("dark-mode");

  localStorage.setItem("darkMode", darkMode);
}

// ===============================
// LOAD PAGE
// ===============================

window.onload = function () {
  // Load dark mode
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }

  updateDashboard();
  showAllDonors();
};
