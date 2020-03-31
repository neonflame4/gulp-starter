# Gulp Starter Package

_This is a simple project template using gulp._

**Features:**

HTML
* Panini HTML templating engine
* YML/JSON data injection

CSS
* SCSS/SASS Compiler
* Minify/Concatenate

Javascript
* Babel cross-browser compatibility module
* JS Minify/Concatenate

#
**Installation:**

To install this set of tools, you must first install npm set up on your machine.  You'll need to install the following dependencies:

`npm install -g gulp-cli`

Then, clone the project into a directory of your choice and install:

```
git clone https://github.com/neonflame4/gulp-starter.git

cd gulp-starter
npm install
```


For image processing support, you will additionally need to install imagemagick:

Ubuntu:
```
apt-get install imagemagick
apt-get install graphicsmagick
```

Mac OS X (using Homebrew):
``` 
brew install imagemagick
brew install graphicsmagick
```

#
**Generating Layouts with Components**

Layouts are generated using panini (https://get.foundation/sites/docs/panini.html).

Files saved into the src/templates/layouts folder can be used as site skeletons or shared design templates.

Files saved to the src/templates/pages folder make up the individual pages on your website.  Each of these files will be utilize the default layout, unless otherwise defined.

Files saved to the src/templates/partials folder are shared components/snippets that you can pull into pages and layout HTML files.

To inject text or other data into your pages, panini is also able to parse data from YML or JSON files in your src/data folder.  Further documentation on this feature is also included in the link above.

This sample project contains usage examples for each of these tools.



#
**Running your project:**

To run the project, simply type in `gulp watch`. Whenever you make changes while using the file watcher, the browser will automatically refresh the page to preview your changes.
