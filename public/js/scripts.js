function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// function checkCookie() {
//   var user = getCookie("list");
//   if (user != "") {
//     alert("Welcome again " + user);
//   } else {
//     user = prompt("Please enter your name:", "");
//     if (user != "" && user != null) {
//       setCookie("list", user, 365);
//     }
//   }
// }

function getUTCDate() {
  var date = new Date();
  var now_utc =  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
   date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

  return now_utc;
}

function addListItem() {
  var list = getCookie("list"),
  newListItem = createListItem(),
  parsedList = JSON.parse(list);
  parsedList.push(newListItem);
  var stringifiedList = JSON.stringify(parsedList);
  setCookie("list", stringifiedList, 365);
  renderList();
  //console.warn(JSON.parse(getCookie("list")));
}

function initList() {
  var list = getCookie("list");
  if(list.length === 0) {
    setCookie("list", "[]", 365);
    console.warn("Initialized");
  }
}

function createListItem() {
  var value = $("#list-item-entry").val();
  var listItem = {
    value: value,
    createdAt: getUTCDate(),
    strike: false,
    id: Math.random().toString(36).substring(7),
  }
  return listItem;
}

// function setListItem() {
//   var listItem = $("#list-item-entry").val();
//   setCookie("list", listItem, 365);
//   $("#render-list").html(getCookie("list"));
// }

function strike(cname) {
  setCookie("list", getCookie(cname).strike(), 365);
}

function deleteCookie(cname) {
  document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function renderList() {
  var list = getCookie("list");
  var parsedList = JSON.parse(list);
  $("#render-list").html("");
  $.each(parsedList, function(index, object){
    $("#render-list").prepend(object.value);
    //console.warn(index, object.value);
  });
}

$(function() {
  initList();
  renderList();
  $("#submit").on("click", addListItem)
  $("#delete").on("click", function() {
    // var cname = $(this).data("cookie");
    // deleteCookie(cname);
    setCookie("list", "[]", 365);
    renderList();
  })
});
