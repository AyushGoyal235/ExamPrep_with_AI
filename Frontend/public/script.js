
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const message = document.getElementById("message");

function showLogin() {
    loginForm.hidden = false;
    signupForm.hidden = true;

    loginTab.classList.add("active");
    signupTab.classList.remove("active");

    message.textContent = "";
}

function showSignup() {
    loginForm.hidden = true;
    signupForm.hidden = false;

    signupTab.classList.add("active");
    loginTab.classList.remove("active");

    message.textContent = "";
}

loginTab.addEventListener("click", showLogin);
signupTab.addEventListener("click", showSignup);

document.getElementById("goSignup").addEventListener("click", (e) => {
    e.preventDefault();
    showSignup();
});

document.getElementById("goLogin").addEventListener("click", (e) => {
    e.preventDefault();
    showLogin();
});

function showMessage(text, type) {
    message.textContent = text;
    message.className = "message " + type;
}

// SIGNUP
signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        showMessage("Passwords do not match!", "error");
        return;
    }

    if (password.length < 8) {
        showMessage("Password must be at least 8 characters.", "error");
        return;
    }

    const button = signupForm.querySelector(".submit-btn");
    button.disabled = true;
    button.textContent = "Creating Account...";

    try {
        const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ name, email, password })
        });

        const data = await readResponse(response);

        showMessage("Account created successfully!", "success");

        signupForm.reset();

        setTimeout(showLogin, 1000);

    } catch (error) {
        showMessage(error.message, "error");
    } finally {
        button.disabled = false;
        button.textContent = "Create Account";
    }
});

// LOGIN
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    const button = loginForm.querySelector(".submit-btn");
    button.disabled = true;
    button.textContent = "Logging in...";

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ email, password })
        });

        const data = await readResponse(response);

        showMessage("Login successful!", "success");

        window.location.href = "/app/";

    } catch (error) {
        showMessage(error.message, "error");
    } finally {
        button.disabled = false;
        button.textContent = "Login to Account";
    }
});

async function readResponse(response) {
    const text = await response.text();

    let data = {};

    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        throw new Error(
            `Server returned invalid response. Status: ${response.status}`
        );
    }

    if (!response.ok) {
        throw new Error(
            data.message || `Request failed. Status: ${response.status}`
        );
    }

    return data;
}
