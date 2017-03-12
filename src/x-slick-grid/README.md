# X-SlickGrid Web Component

The X-Slick-Grid custom element is a W3C standard web component (version 0, for now) custom element, which provides a convenient wrapper around the [x-slick-grid grid library] (http://ddomingues.com/X-SlickGrid/), 
which in turn is a fork of dormant [slickgrid] (https://github.com/mleibman/SlickGrid/wiki) library.  Like the base slickgrid, the component has as a dependency JQuery and Jquery UI. 
The component only adds its own reference to these libraries if they are found not to be present.

Currently, the X-Slick-Grid also depends on [Polymer] (https://www.polymer-project.org/1.0/) for providing facilities for structuring the web component.  The component works with IE11+, and should work for other
evergreen browsers as well(Edge, Chrome, Safari, Firefox have been tested).

The web component supports all the examples provided by the X-SlickGrid api documentation, as listed below. 

Examples:

* Example 1  - [Simple Configuration] (https://rawgit.com/bahrus/crystal/master/xtal-elements/x-slick-grid/examples/example1-simple.html)
* Example 2  - [Formatting] (https://rawgit.com/bahrus/crystal/master/xtal-elements/x-slick-grid/examples/example2-formatters.html)
* Example 3  - [Editing] (https://rawgit.com/bahrus/crystal/master/xtal-elements/x-slick-grid/examples/example3-editing.html)
* Example 3a - [Editing with less code] (https://rawgit.com/bahrus/crystal/master/xtal-elements/x-slick-grid/examples/example3-editing.html)