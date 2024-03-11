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

const usernameInput = document.querySelector("#username");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#pass");
const cPasswordInput = document.querySelector("#cpass");
const signupBtn = document.querySelector("#signBtn");
const googleBtn = document.querySelector("#googleAdd");
const nameError = document.querySelector("#error1");
const emailError = document.querySelector("#error2");
const passwordError = document.querySelector("#error3");
const cpassError = document.querySelector("#error4");
const passwordIcon = document.querySelector(".pass-icon");
const confirmPassIcon = document.querySelector(".confirmPass-icon");

const passwordRegex = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{6,}$/g;

signupBtn.addEventListener("click", (e) => {
  // alert("hi");
  e.preventDefault();
  let hasError = false;

  if (usernameInput.value === "") {
    nameError.innerHTML = "username field is required";
    hasError = true;
  } else if (usernameInput.value.length <= 7) {
    nameError.innerHTML = "username must contain at least 8 characters";
    hasError = true;
  } else {
    nameError.innerHTML = "";
  }

  if (emailInput.value === "") {
    emailError.innerHTML = "email address field is required";
    hasError = true;
  } else if (emailInput.value.length <= 10) {
    emailError.innerHTML = "enter a valid email address";
    hasError = true;
  } else if (
    !emailInput.value.includes("@") &&
    !emailInput.value.includes(".")
  ) {
    emailError.innerHTML = "email must include '@' and '.' in the right place";
    hasError = true;
  } else {
    emailError.innerHTML = "";
  }

  if (passwordInput.value === "") {
    passwordError.innerHTML = "password field is required";
    hasError = true;
  } else if (!passwordRegex.test(passwordInput.value)) {
    passwordError.innerHTML =
      "password must be a combination of all characters";
    hasError = true;
  } else if (passwordInput.value.length <= 7) {
    passwordError.innerHTML = "password must be at least 8 characters long";
    hasError = true;
  } else {
    passwordError.innerHTML = "";
  }

  if (cPasswordInput.value !== passwordInput.value) {
    cpassError.innerHTML = "password do not match";
    hasError = true;
  } else if (cPasswordInput.value === passwordInput.value) {
    cpassError.innerHTML = "";
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
          username: usernameInput.value,
          email: emailInput.value,
        }).catch((error) => {
          console.error("Error writing data to the database:", error.message);
        });
        alert("User created!");
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
    alert("user is signed in");
    window.location.href = "library.html";
  } else if (!user) {
    console.log("User is signed out!");
  }
  preventAutoRedirectOnLoad = false;
});

googleBtn.addEventListener("click", (e) => {
  e.preventDefault();
  userSignInWithGoogle();

  allowAutoRedirect();
});

// PASSWORD $$ CONFIRM-PASSWORD ICON

let isPasswordVisible = false;
passwordIcon.addEventListener("click", () => {
  if (isPasswordVisible) {
    passwordInput.type = "password";
    passwordIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#372549" class="w-6 h-6">
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clip-rule="evenodd" />
  </svg>`;
    isPasswordVisible = false;
  } else {
    passwordInput.type = "text";
    passwordIcon.innerHTML = `<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#372549"
    class="h-5 md:h-6 lg:h-6 absolute right-3 md:right-3 lg:right-3 top-3 md:top-4 lg:top-[1.2rem] cursor-pointer"
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
  </svg>"`;
    isPasswordVisible = true;
  }
});

let isConfirmPasswordVisible = false;
confirmPassIcon.addEventListener("click", () => {
  if (isConfirmPasswordVisible) {
    cPasswordInput.type = "password";
    confirmPassIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#372549" class="w-6 h-6">
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clip-rule="evenodd" />
  </svg>`;
    isConfirmPasswordVisible = false;
  } else {
    cPasswordInput.type = "text";
    confirmPassIcon.innerHTML = `<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#372549"
    class="h-5 md:h-6 lg:h-6 absolute right-3 md:right-3 lg:right-3 top-3 md:top-4 lg:top-[1.2rem] cursor-pointer"
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
  </svg>"`;
    isConfirmPasswordVisible = true;
  }
});
