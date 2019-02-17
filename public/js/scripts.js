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
    console.warn("List Initialized");
  }
}

function setFontName(fontName) {
  setCookie("fontName", fontName, 365);
}

function initFontName() {
  var fontName = getCookie("fontName");
  if(fontName.length === 0) {
    setCookie("fontName", "staatliches", 365);
    console.warn("Font Name Initialized");
  }
  changeFontName(fontName);
}

function changeFontName(fontName) {
  clearFonts();
  switch (fontName) {
    case "staatliches":
      $("body").addClass("font-staatliches")
      break;
    case "titillium":
      $("body").addClass("font-titillium-web")
      break;
    case "merienda":
      $("body").addClass("font-merienda")
      break;
    default:
      $("body").addClass("font-staatliches")
  }
}

function clearFonts() {
  var fontClasses = ["font-staatliches", "font-titillium-web", "font-merienda"];
  $.each(fontClasses, function(i, v) {
    $("body").removeClass(v);
  });
}

function setFontSize(fontSize) {
  setCookie("fontSize", fontSize, 365);
}

function initFontSize() {
  var fontSize = getCookie("fontSize");
  if(fontSize.length === 0) {
    setCookie("fontSize", "12", 365);
    console.warn("Font Size Initialized");
  }
  changeFontSize(parseInt(fontSize));
}

function changeFontSize(fontSize) {
  clearFontSize();
  switch (fontSize) {
    case 12:
      $("body").addClass("font-size-12")
      break;
    case 18:
      $("body").addClass("font-size-18")
      break;
    case 24:
      $("body").addClass("font-size-24")
      break;
    default:
      $("body").addClass("font-size-12")
  }
}

function clearFontSize() {
  var fontClasses = ["font-size-12", "font-size-18", "font-size-24"];
  $.each(fontClasses, function(i, v) {
    $("body").removeClass(v);
  });
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
  initFontName();
  initFontSize();
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
  $('.change-font').on('click', function() {
    var fontName = $(this).data("font-name");
    setFontName(fontName);
    changeFontName(fontName);
  })
  $('.change-font-size').on('click', function() {
    var fontSize = $(this).data("font-size");
    setFontSize(fontSize);
    changeFontSize(fontSize);
  })
  $("#delete").on("click", function() {
    // var cname = $(this).data("cookie");
    // deleteCookie(cname);
    setCookie("list", "[]", 365);
    renderList();
  })
  $("#perm").on("click", function() {
    deleteCookie("list");
    deleteCookie("fontName");
    deleteCookie("fontSize");
  })
});
