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

// function getUTCDate() {
//   var date = new Date();
//   var now_utc =  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
//    date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
//
//   return now_utc;
// }

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
  var value = $("#list-item-entry").val().trim();
  var listItem = {
    value: value,
    createdAt: moment().format('MMMM Do YYYY, h:mm:ss a'),
    strike: false,
    archived: false,
    id: Math.random().toString(36).substring(7),
  }
  return listItem;
}

// function strike(cname) {
//   setCookie("list", getCookie(cname).strike(), 365);
// }

function deleteCookie(cname) {
  document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  location.reload();
}

function strike() {
  var id = $(this).attr("data-id");
  var list = getCookie("list");
  var parsedList = JSON.parse(list);
  var foundItem = parsedList.find(function(item) {
    return item.id === id;
  })
  foundItem.strike = !foundItem.strike;
  var stringifiedList = JSON.stringify(parsedList);
  setCookie("list", stringifiedList, 365);
  renderList();
}

function deleteItem() {
  var id = $(this).attr("data-id");
  var list = getCookie("list");
  var parsedList = JSON.parse(list);
  var foundItem = parsedList.find(function(item) {
    return item.id === id;
  })
  foundItem.archived = true;
  var stringifiedList = JSON.stringify(parsedList);
  setCookie("list", stringifiedList, 365);
  renderList();
}

function renderList() {
  var list = getCookie("list");
  var parsedList = JSON.parse(list);
  $("#render-list").html("");
  $.each(parsedList, function(index, object){
    var createdAtMoment = moment(object.createdAt, 'MMMM Do YYYY, h:mm:ss a').fromNow();
    var item = $("<a>")
      .html(object.value)
      .addClass("item truncate")
      .attr("data-id", object.id)
      .addClass(object.strike ? "strike" : null);
    var createdAt = $("<div>")
      .addClass("created-at truncate")
      .html($("<span>")
      .html(createdAtMoment));
    //<button type="button" class="btn btn-danger"><i class="fas fa-dumpster-fire"></i></button>
    var deleteButton = $("<button>")
      .html("<i class=\"fas fa-dumpster-fire\"></i>")
      .attr("data-id", object.id)
      .addClass("delete-item btn btn-danger");
    //var deleteButton = $("<button>").html("Delete").addClass(object.delete ? "delete-item" : null);
    var li = $("<li>")
      .addClass(object.archived ? "hidden" : null)
      .addClass("list-group-item d-flex justify-content-around align-items-center ")
      .prepend(item, createdAt, deleteButton);
    //var li = $("<li>").addClass(object.archived ? "hidden" : null).prepend(item, deleteButton);
    $("#render-list").prepend(li);
    //console.warn(index, object.value);
  });
}

$(function() {
  initList();
  renderList();
  $("#list-item-creator").on("submit", function(event) {
    event.preventDefault();
    var entry = $("#list-item-entry");
    var value = entry.val().trim();
    if(value.length === 0) {
      alert("Enter a valid value!");
      return false;
    }
    addListItem();
    entry.val("");
  })
  $('#render-list').on('click', '.item', strike)
  $('#render-list').on('click', '.delete-item', deleteItem)
  $("#delete").on("click", function() {
    // var cname = $(this).data("cookie");
    // deleteCookie(cname);
    setCookie("list", "[]", 365);
    renderList();
  })
  $("#perm").on("click", function() {
    deleteCookie("list")
  })
});
