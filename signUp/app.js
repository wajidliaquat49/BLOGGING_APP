import {
  auth,
  storage,
  createUserWithEmailAndPassword,
  db,
  doc,
  setDoc,
  ref,
  uploadBytes,
  getDownloadURL,
} from "../utils.js/utils.js";

const sign_form = document.getElementById("sign_form");
const signup_btn = document.getElementById("signup_btn");
const sign_up_pic = document.getElementById("sign_up_pic");
const formFilemd = document.getElementById("formFilemd");

sign_form.addEventListener("submit", function (e) {
  e.preventDefault();
  const firstName = e.target[0].value;
  const lastName = e.target[1].value;
  const email = e.target[2].value;
  const password = e.target[3].value;
  const Image = e.target[4].files[0];

  const userInfo = {
    firstName,
    lastName,
    email,
    password,
  };

  console.log("e==>", e);
  console.log("UserInfo==>", userInfo);

  // Create an Account
  signup_btn.disabled = true;
  signup_btn.innerText = "Loading...";
  createUserWithEmailAndPassword(auth, email, password)
    .then((user) => {
      console.log("User==>", user.user.uid);

      // Uplaod Image ...
      const userRef = ref(storage, `user/${user.user.uid}`);
      uploadBytes(userRef, Image)
        .then(() => {
          // <-- Passing Image here
          console.log("Image Uploaded==>");

          // Get URL...
          getDownloadURL(userRef)
            .then((url) => {
              console.log("URL==>", url);

              // url set in object firebase
              userInfo.Image = url;

              // Create document  referrence
              const userdbDofRef = doc(db, "user", user.user.uid);

              // Updated Object...
              setDoc(userdbDofRef, userInfo)
                .then(() => {
                  console.log("Object Updated");
                  window.location.href = "/";
                  signup_btn.disabled = false;
                  signup_btn.innerText = "Sign Up";
                })
                .catch((error) => {
                  console.log("Updated object me error aa rha hai: ", error);
                  signup_btn.disabled = false;
                  signup_btn.innerText = "Sign Up";
                });
            })
            .catch((error) => {
              console.log("Get URL me error aa rha hai: ", error);
              signup_btn.disabled = false;
              signup_btn.innerText = "Sign Up";
            });
        })
        .catch((error) => {
          console.log("Image upload me error aa rha hai: ", error);
          signup_btn.disabled = false;
          signup_btn.innerText = "Sign Up";
        });
    })
    .catch((error) => {
      console.log("Account create karne me error aa rha hai: ", error);
      signup_btn.disabled = false;
      signup_btn.innerText = "Sign Up";
    });
});
