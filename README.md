# Gulp Starter Package

_This is a simple package for starting a new project that uses SCSS._

**Installation:**

To install, you must have npm set up on your machine.  You'll need to install the following dependencies:

`npm install -g gulp-cli`

Then, clone the project into a directory of your choice and install:

```
git clone https://github.com/neonflame4/gulp-starter.git

cd gulp-starter
npm install
```


**Run your project:**

To run the project, simply type in `gulp watch`. Whenever you make changes while using the file watcher, the browser will automatically refresh the page to preview your changes.

**Generating Layouts with Components**

Layouts are generated using panini (https://github.com/foundation/panini).  You can find more configuration options on their GitHub page.

Files saved into the src/layouts folder can be used as site skeletons or design templates.

Files saved to the src/pages folder make up the individual pages on your website.  Each of these files will be generated using the chosen layout template.

Files saved to the src/partials folder are shared components that you can pull into pages and layout HTML files.
