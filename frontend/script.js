// Replace this with your Azure App Service backend URL after deployment
const API_URL = "http://localhost:8080";

async function saveContact() {
  const name  = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const btn   = document.getElementById("saveBtn");

  // Basic validation
  if (!name || !email || !phone) {
    showAlert("Please fill in all fields.", "error");
    return;
  }

  if (!isValidEmail(email)) {
    showAlert("Please enter a valid email address.", "error");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Saving...";

  try {
    const response = await fetch(`${API_URL}/api/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone }),
    });

    const data = await response.json();

    if (response.ok) {
      showAlert("Contact saved successfully!", "success");
      clearForm();
    } else {
      showAlert(data.error || "Something went wrong. Please try again.", "error");
    }
  } catch (err) {
    showAlert("Unable to connect to the server. Please try again.", "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Save";
  }
}

function showAlert(message, type) {
  const alert = document.getElementById("alert");
  alert.textContent = message;
  alert.className = `alert ${type}`;
}

function clearForm() {
  document.getElementById("name").value  = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
