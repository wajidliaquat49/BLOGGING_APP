var feedtext = document.getElementById("feedtext");
var feedbtn = document.getElementById("feedbtn");

function blogSub() {
  var getValue = feedtext.value;
  feedtext.value = "";
  console.log(getValue);
  if (getValue) {
    alert("Blog Query Submitted");
  }
}
blogSub();
