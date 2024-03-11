import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBB7B8pLifqJGtqJlo7ZfLRo926CmwWZVo",
  authDomain: "herabound-auth.firebaseapp.com",
  projectId: "herabound-auth",
  storageBucket: "herabound-auth.appspot.com",
  messagingSenderId: "922586715500",
  appId: "1:922586715500:web:eeb2bf3977037fd1ab0f49",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();

const emailInput = document.querySelector("#login-email");
const passwordInput = document.querySelector("#login-pass");
const loginBtn = document.querySelector(".login-btn");
console.log(loginBtn);
const loginGoogleBtn = document.querySelector("#googleAddBtn");
const loginEmailError = document.querySelector("#error2");
const loginPasswordError = document.querySelector("#error3");
const loginPasswordIcon = document.querySelector(".pass-icon");

const passwordRegex = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{6,}$/g;

loginBtn.addEventListener("click", (e) => {
  //   alert("hi");
  e.preventDefault();
  let hasError = false;

  if (emailInput.value === "") {
    loginEmailError.innerHTML = "email address field is required";
    hasError = true;
  } else if (emailInput.value.length <= 10) {
    loginEmailError.innerHTML = "enter a valid email address";
    hasError = true;
  } else if (
    !emailInput.value.includes("@") &&
    !emailInput.value.includes(".")
  ) {
    loginEmailError.innerHTML =
      "email must include '@' and '.' in the right place";
    hasError = true;
  } else {
    loginEmailError.innerHTML = "";
  }

  if (passwordInput.value === "") {
    loginPasswordError.innerHTML = "password field is required";
    hasError = true;
  } else if (!passwordRegex.test(passwordInput.value)) {
    loginPasswordError.innerHTML =
      "password must be a combination of all characters";
    hasError = true;
  } else if (passwordInput.value.length <= 7) {
    loginPasswordError.innerHTML =
      "password must be at least 8 characters long";
    hasError = true;
  } else {
    loginPasswordError.innerHTML = "";
  }

  if (!hasError) {
    // Only attempt to create a user if there are no errors
    const email = emailInput.value;
    const password = passwordInput.value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        set(ref(database, "users/" + user.uid), {
          email: emailInput.value,
        }).catch((error) => {
          console.error("Error writing data to the database:", error.message);
        });
        console.log("User created!");
        window.location.href = "library.html"; // Redirect after successful sign up
      })
      .catch((error) => {
        // alert(error.message)
        console.log(error.code);
        console.log(error.message);
      });
  }

  allowAutoRedirect();
});

// FOR THE GOOGLE SIGN IN BTN....

const userSignInWithGoogle = async () => {
  signInWithPopup(auth, provider)
    .then((googleResult) => {
      const credential = GoogleAuthProvider.credentialFromResult(googleResult);
      const token = credential.accessToken;
      const user = googleResult.user;
      console.log(user);
    })
    .catch((error) => {
      // alert(error.message)
      console.log(error.code);
      console.log(error.message);
    });
};

let preventAutoRedirectOnLoad = true; // Flag to prevent auto-redirect on initial load

function allowAutoRedirect() {
  preventAutoRedirectOnLoad = false;
}

onAuthStateChanged(auth, (user) => {
  console.log(user);
  console.log(!preventAutoRedirectOnLoad);
  if (user && !preventAutoRedirectOnLoad) {
    // User is signed in, and we allow redirecting now
    console.log("user is signed in");
    window.location.href = "library.html";
  } else if (!user) {
    console.log("User is signed out!");
  }
  preventAutoRedirectOnLoad = false;
});

loginGoogleBtn.addEventListener("click", (e) => {
  e.preventDefault();
  userSignInWithGoogle();

  allowAutoRedirect();
});

// PASSWORD ICON

let isPasswordVisible = false;
loginPasswordIcon.addEventListener("click", () => {
  if (isPasswordVisible) {
    passwordInput.type = "password";
    loginPasswordIcon.innerHTML = `<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#372549"
    class="pass-icon h-4 md:h-6 lg:h-6 absolute right-[1.2rem] md:right-3 lg:right-5 top-[1rem] md:top-4 lg:top-[1.2rem] cursor-pointer"
  >
    <path
      d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z"
    />
    <path
      d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z"
    />
    <path
      d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z"
    />
  </svg>
  `;
    isPasswordVisible = false;
  } else {
    passwordInput.type = "text";
    loginPasswordIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" fill="#372549"
    class="h-4 md:h-6 lg:h-6 absolute right-[1.2rem] md:right-3 lg:right-5 top-[1rem] md:top-4 lg:top-[1.2rem] cursor-pointer" stroke-width="2" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>`;
    isPasswordVisible = true;
  }
});
