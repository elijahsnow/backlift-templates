// This script generates the navigation bar at the top of
// simple-site pages. It uses the Backlift.payload variable
// which contains a table of contents for the /pages folder.
// The payload and table of contents can be configured using
// the config.yml file. The resulting list of pages is
// rendered using the /scripts/navtemplate.jst template and
// placed into the top-nav HTML element.

window.onload = function() {

  // get table of contents payload

  var toc;
  if (Backlift.payload) {
    toc = Backlift.payload.toc || Backlift.payload["/backlift/toc"];
  } else {
    return;
  }

  // create list of pages

  if (toc.pages && _.isArray(toc.pages)) {

    // Order pages by number if present in filename.
    // For example 1_about.html, friends2.html 

    var pages = _.sortBy(toc.pages, function(page) {
        return parseInt(page.file.match(/\d+/)||"0");
    });

    // Create a list of links, one for each page

    var items = new Array();

    var isActive = function(url) {
      return window.location.pathname == url ? "active" : "";
    }

    _.each(pages, function (page) {
        var name = page.file.split('.')[0];
        // replace underscores with spaces
        name = name.replace(/_/g, ' ');
        // trim all leading/trailing digits and whitespace from name
        name = name.replace(/^[\d\s]+|[\d\s]+$/g, '');

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
      active: isActive("/") + isActive("/index.html")
    });

    // render the resut into the #top-nav element

    var navContent = JST.navtemplate({items: items});
    document.getElementById("top-nav").innerHTML = navContent;

  }

};