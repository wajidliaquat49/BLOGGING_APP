import {
  ref,
  storage,
  uploadBytes,
  getDownloadURL,
  db,
  collection,
  addDoc,
  doc,
  auth,
} from "../utils.js/utils.js";

console.log("Auth===>", auth);

const productForm = document.getElementById("productForm");
productForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("form submitted", e);

  // Add your form submission logic here
  const productInfo = {
    banner: e.target[0].files[0],
    Product: e.target[1].value,
    Quantity: e.target[2].value,
    Price: e.target[3].value,
    order_submit: e.target[4].value,
    createdBy: auth.currentUser.uid,
    createdByEmail: auth.currentUser.email,

    Likes: [],
  };
  console.log("productInfo==>", productInfo);

  const imgRef = ref(storage, productInfo.banner.name);
  uploadBytes(imgRef, productInfo.banner).then((url) => {
    console.log("Image Upload Hoghi");

    getDownloadURL(imgRef).then((url) => {
      console.log("Url Aaghi", url);
      productInfo.banner = url;

      // add document to products collection
      const productCollection = collection(db, "products");
      addDoc(productCollection, productInfo).then((doc) => {
        console.log("Document Added !");
        window.location.href = "/";
      });
    });
  });
});
