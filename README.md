# backlift-templates #

This project contains a set of templates that can be used to create new backlift apps. (see backlift.com) Templates can be downloaded using the backlift command line utility by using the create command:

	backlift create:<template name> <app name>


## blank templates ##

**basic**: The basic template is the default for "backlift create." It's an empty app template, styled with Twitter Bootstrap. Contains a menubar, a landing page and a secondary page. Demonstrates how to organize a view heirarchy, and how to refresh subviews without reloading the whole site.

**auth**: An app template with user sign-in functionality, styled with Twitter Bootstrap. Contains a landing page and two pages that can only be accessed by a logged-in user. Demonstrates how to reuse common layouts across public and private pages, and how to manage a generic login form. 

## examples ##

**demo**: A simple single page app with a tutorial that shows off some of the basics of backlift and backbone.js development.

**minimal**: A minimal project that persists data to backlift. Only two files (plus libraries). A demonstration of how simple a backlift project can be.

**todo**: The classic todo example, running on backlift.

**palettes**: Created by syntagmatic, this template provides a color picker interface inspired by the colorlovers website.

**tweaker**: A twitter clone. Demonstrates how to setup a larger project on backlift including auth, multiple pages and subviews, and server-side validation of form data.

## other ##

**init**: This template only contains a config.yml file. It is used by the "backlift init" command.
