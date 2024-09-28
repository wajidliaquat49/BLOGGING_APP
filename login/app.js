// import {
//     auth,
//     signInWithEmailAndPassword
// } from "../utils.js/utils.js";

// const login_btn = document.getElementById("login_btn");
// const login_form = document.getElementById("login_form");
// login_form.addEventListener("submit", function (e) {
//     e.preventDefault();

//     const email = e.target[0].value;
//     const password = e.target[1].value;

//     console.log("Email==>", email);
//     console.log("Password==>", password);

//     signInWithEmailAndPassword(auth, email, password).then(() => {
//         window.location.href = "/"
//     }).catch((error) => {
//         alert("Sign in me error aa rha hai", error)
//     })

// });

import { auth, signInWithEmailAndPassword } from "../utils.js/utils.js";

const login_btn = document.getElementById("login_btn");
const login_form = document.getElementById("login_form");

login_form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = e.target[0].value;
  const password = e.target[1].value;

  console.log("Email==>", email);
  console.log("Password==>", password);

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "/";
  } catch (error) {
    alert("Sign-in error: " + error.message);
  }
});
