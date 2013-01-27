# backlift-templates #

This project contains a set of templates that can be used to create new backlift apps. (see [backlift.com](http://backlift.com)) Templates can be used by creating an app within backlift, or by using the command line utility.

## simple templates ##

**helloworld**: This is a demo of a minimal backlift app. It is just an index.html file with an image in the header, styled with Twitter Bootstrap. It uses the backlift-reloader.js script to automatically refresh the page when changes to the app are uploaded to backlift.

**simple-site**: A simple website. This provides a bit more functionality and is useful as a starting point for a new app. Demonstrates the use of the config.yml file and {{ script }} and {{ style }} variables to ease asset management.

**googlemaps**: A simple template and starting point for building googlemaps API based applications.

## backbone.js templates ##

**backbone-basic**: The basic template is the default for "backlift create." It's an empty app template, styled with Twitter Bootstrap. Contains a menubar, a landing page and a secondary page. Demonstrates how to organize a view heirarchy, and how to refresh subviews without reloading the whole site.

**backbone-auth**: An app template with user sign-in functionality, styled with Twitter Bootstrap. Contains a landing page and two pages that can only be accessed by a logged-in user. Demonstrates how to reuse common layouts across public and private pages, and how to manage a generic login form. 

**backbone-demo**: A simple single page app with a tutorial that shows off some of the basics of backlift and backbone.js development.

**backbone-minimal**: A minimal project that persists data to backlift. Only two files (plus libraries). A demonstration of how simple a backlift project can be.

**backbone-todo**: The classic todo example, running on backlift.

**backbone-palettes**: Created by syntagmatic, this template provides a color picker interface inspired by the colorlovers website.

**backbone-tweaker**: A twitter clone. Demonstrates how to setup a larger project on backlift including auth, multiple pages and subviews, and server-side validation of form data.

## knockout.js templates ##

**knockout-todo**: A very simple starting point for building a knockout.js app. It implements the TODO example on the knockout.js website.

## other ##

**init**: This template only contains a config.yml file. It is used by the "backlift init" command.
