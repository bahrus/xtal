## The diminishing returns of isomorphism

I think it is time to take a fresh look at what problems isomorphic solutions solved, and ask ourselves if the problems it solved has relevance in the age of HTTP/2 and Service workers.  Does server-side rendering have anything near the potency it once did? Does the PRPL pattern, combined with web components and the addition of key api's built into the browser, address everything isomorphic solutions addressed?  Or is a new paradigm needed, which leverages a lighter-weight server-rendering layer?  

Isomorphism was a convenient way to straddle the gap between two diverging directions the web was going until recently.  

Starting in 2005, with the advent of AJAX, and the widespread availability of broadband in developing nations, and with the great advances in just-in-time JavaScript compilation introduced by Chrome in 2008, desktop web applications have seen a great migration south, where all the logic has moved from the server to the client.  This produced generally richer applications able to compete with native desktop, with the minor expense of one-time download of the heavy libraries that fueled all the rich functionality.  Consolidating all the logic in one single-language layer also helped lighten the barrier to entry for new developers and made maintenance and debugging more straightforward.

On the other hand, with the introduction of the first truly web enabled phone in 2007, and the relatively unstable network conditions these devices must withstand, the huge momentum already in place for desktop applications meant that developers were effectively declaring defeat on the mobile web.

Eventually, some brave, innovative companies who were trying to make the mobile web work, like Twitter, AirBnB and Facebook, began to question the wisdom of pumping down all the client-side logic to the browser before anything would render. Why it took so long to change course is an indication of how developer habits and biases tend to outlive their usefulness.  AirBnb famously introduced the concept of isomorphic rendering, and React added a functional view twist which increased the popularity of this approach.  (AirBnB would eventually adopt React).  Many frameworks have since followed suit, providing their own flavors of isomorphism (or "universalism").

But one framework or library has bucked that trend -- Polymer, a framework that relies heavily on HTML5+ standards (some of which have not yet been fully ratified).  Their motto is "Use the Platform", rather than clever JavaScript workarounds.  Polymer (and the Chrome team and other browser vendors) have standardized a number of api's and protocols, including HTTP/2, service workers, and various mechanisms for pushing / lazy loading static resources.  They suggest that all you need is to use the PRPL pattern, using techniques showcased in the Polymer Shop App.  

The Polymer team has gone so far as to question whether the complexity associated with isomorphic solutions is worth it, when the performance doesn't necessarily outperform what can be done by sticking to the platform.  

[Their scores on the Hacker News PWA are respectable enough, and their solution is simple enough, that they clearly have a point.](https://hnpwa.com/) 

On the other hand, the case for server-side rendering has not vanished, even among the "use the platform" crowd.  The AMP project recently announced that they are looking at server-side rendering in conjunction with their AMP custom elements.  It can be argued that the starter kits the Polymer project has provide might cover some use cases well, but for enterprise line of business applications, it may fall short.

For example, consider a scenario where the initial view users will see is a fairly sophisticated grid, requiring column customization, nested columns / rows, the works.  Most grid libraries that support this rich technology don't yet "progressively boot", but rather, the entire library needs to be downloaded before the grid becomes functional.  While waiting for the libraries to download, it could be be beneficial to at least display a simple read-only display of the data.

So given the current state-of-the-art of the browser platform, how would an enterprise line of business application best utilize a combination of platform as well as server-side rendering?  Here is an outline for how this might be optimized.  We call it the PuRPLish pattern

PuRPLiSh pattern

1. Requests / pushes for content / resources that change frequently, or are sensitive in nature, must be kept separate from requests / pushes for non sensitive resources that change infrequently, so that the latter resources can be cached effectively.
    1. In fact, in many contexts, caching of the sensitive data could be considered an auditing violation.
2. For first time visitors, who have no cached resources, it is desirable to prioritize displaying:
    1. A navigational shell, so users can jump to where they want to go, followed by:
    2. A simple, 1998-style pure readonly HTML/CSS view of the content of the "home" view, without first having to wait for extensive libraries to download.  On the other hand, as the Polymer team would interject, we don't want to display buttons, sliders, other controls, if they don't do anything until those libraries are downloaded.  (Load the Walmart.com website in slow motion, by enabling network throttling, for plenty of examples of these). If some of that content is relatively dynamic or sensitive, then some sort of server-side (non-cached) rendering is therefore desirable. But we should do this without violating directive 1).
3.  As the PRPL pattern suggests, it is desirable to conduct a certain amount of preloading / caching of resources in the background that will be used for secondary views.
4.  On repeated visits, everything should be cached except the highly dynamic and/or sensitive data.  That data needs to be retrieved fresh every time a view is loaded.
5. For both first time visits and repeated visits, only those resources required for a particular view should be loaded first.

## The problem with class inheritance and mixins for progressive enhancement

Class Hierarchies or Polymer mixins require all the dependdencies to load before the class can be defined and the associated custom element registered.

What we need instead is to 

```html
<my-grid>
    <column>
        <xtal-defer><my-grid-toggler is="dependency"></my-grid-toggler>
            <toggle-button hidden until="ready" on-click="toggle"></toggle-button>
        </xtal-defer>
    </column>
</my-grid>
```

The xtal-defer element looks for all child elements with attribute is="dependency".  It waits for the element to load, then applies the methods of the prototype to the prototype of the element before the last dash.  So for example, the methods in element "my-grid-toggler" would be added to the prototype of the class associated with element "my-grid"


 