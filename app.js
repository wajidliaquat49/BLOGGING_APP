import {
  auth,
  storage,
  db,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  doc,
  setDoc,
  ref,
  uploadBytes,
  getDownloadURL,
  signOut,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
} from "./utils.js/utils.js";

console.log("Auth==>", auth);
console.log("Storage==>", storage);
console.log("db==>", db);

const signout_btn = document.getElementById("signout_btn");
const login = document.getElementById("login");
const profile_image = document.getElementById("profile_image");
const cards_container = document.getElementById("cards_container");
const navId = document.getElementById("navId");
const h1_ID = document.getElementById("h1_ID");
const ul_Id = document.getElementById("ul_Id");
const myproduct_Id = document.getElementById("myproduct_Id");

getAllproduct();
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    login.style.display = "none";
    profile_image.style.display = "inline-block";
    // profile_image.style.marginRight = "18px";
    signout_btn.style.display = "inline-block";
    navId.style.width = "100%";
    navId.style.marginLeft = "320px";
    myproduct_Id.style.display = "inline-block";
    getUserinfo(uid);
  } else {
    login.style.display = "flex";
    login.style.justifyContent = "center";
    login.style.alignItems = "center";
    profile_image.style.display = "none";
    signout_btn.style.display = "none";
    navId.style.width = "100%";
    navId.style.marginLeft = "460px";
    ul_Id.style.gap = "12px";
    myproduct_Id.style.display = "none";
  }
});

signout_btn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
      console.log("SignOut me error aa rha hai");
    });
});

function getUserinfo(uid) {
  const getUserRef = doc(db, "user", uid);
  getDoc(getUserRef)
    .then((docSnapshot) => {
      if (docSnapshot.exists()) {
        console.log("Data==>", docSnapshot.id);
        console.log("Data==>", docSnapshot.data());
        const userData = docSnapshot.data();
        if (userData.Image) {
          profile_image.src = userData.Image;
        } else {
          console.log("Image not found in user data.");
        }
      } else {
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error aa rha hia getuserinfo me", error);
    });
}

async function getAllproduct() {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    cards_container.innerHTML = "";
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
      const product = doc.data();

      const { banner, Product, Price, Quantity } = product;
      const card_code = `<div id="cards_container">
            <div  class="card">
            <img src="${banner}"
                alt="Post Image" class="product-image">
            <div class="product-details">
                <p class="product-name"><b>Post</b>: ${Product}</p>
                <p class="quantity"><b>Description</b>: ${Quantity}</p>
                <p class="price"><b>Additional Information</b>: ${Price}</p>                 
            </div>
            <div class="btns">
                <button  id="${
                  doc.id
                }" onclick = "LikeOrder(this)"  class="like btn">
                 ${
                   auth?.currentUser &&
                   product?.Likes?.includes(auth?.currentUser.uid)
                     ? "Liked.."
                     : "Like"
                 } 
                 ${product?.Likes?.length ? product?.Likes?.length : ""}
                </button>
                 <button class="delete btn" id=${
                   doc.id
                 } onclick = "DeleteProduct(this)">Delete</button>
                 <button class="edit btn"><a href="#" id="order_Id">Read more...</a></button>
            </div>
        </div>
        </div>`;
      window.LikeOrder = LikeOrder;
      window.DeleteProduct = DeleteProduct;
      cards_container.innerHTML += card_code;
      console.log("Products==>", product);
    });
  } catch (error) {
    alert(error);
  }
}

async function LikeOrder(e) {
  console.log(e.innerText);
  if (auth.currentUser) {
    e.disabled = true;
    const docRef = doc(db, "products", e.id);
    if (e.innerText == "Liked..") {
      updateDoc(docRef, {
        Likes: arrayRemove(auth.currentUser.uid),
      })
        .then(() => {
          e.innerText = "Like";
          e.disabled = false;
        })
        .catch((error) => {
          alert(error);
        });
    } else {
      updateDoc(docRef, {
        Likes: arrayUnion(auth.currentUser.uid),
      })
        .then(() => {
          e.innerText = "Liked..";
          e.disabled = false;
        })
        .catch((error) => {
          alert(error);
        });
    }
  } else {
    window.location.href = "./login/index.html";
  }
}

async function DeleteProduct(e) {
  console.log(e);

  // Create a reference to the document
  const docRef = doc(db, "products", e.id);

  // Delete the document
  await deleteDoc(docRef);

  // Retrieve all products
  getAllproduct(auth.currentUser.uid);
}

// {/* <button class="edit btn"><a href="./orderForm/index.html" id="order_Id">Order</a></button> */}
