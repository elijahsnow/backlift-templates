// This script generates the navigation bar at the top of
// simple-site pages. It fetches the contents of the /pages 
// folder and renders the list using the navtemplate.jst 
// template.

// renderNav: creates the top navigation menu and renders it 
// into the #main-nav div
var renderNav = function(pages) {

  // Sort pages by number if present in filename.
  // For example 1_about.html, friends2.html 

  var pages = _.sortBy(pages, function(page) {
      var number = page.file.match(/\d+/);
      return parseInt(number || "0");
  });

  // Create a list of links, one for each page

  var items = new Array();

  var isActive = function(url) {
    return window.location.pathname == url;
  }

  _.each(pages, function (page) {
      // get the base name of the file, no extensions
      var name = page.file.split('.')[0];
      // replace underscores with spaces
      name = name.replace(/_/g, ' ');
      // trim all leading/trailing digits and whitespace from name
      name = name.replace(/^[\d\s]+|[\d\s]+$/g, '');
      // add to the list
      items.push({ 
        name: name, 
        url: page.url, 
        active: isActive(page.url) 
      });
  });

  // add the index.html page

  items.unshift({ 
    name: "home", 
    url: "/", 
    active: isActive("/") || isActive("/index.html")
  });

  // render the resut into the #main-nav element

  var navContent = JST.navtemplate({items: items});
  $("#main-nav").html(navContent);
}

// When page is ready, fetch the files in
// the /pages folder and then call renderNav
$(function() {
  $.get("/backlift/toc/pages/*", renderNav);
});