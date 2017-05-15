The diminishing returns of isomorphism

I think it is time to take a fresh look at what problems isomorphic solutions solved, and ask ourselves if the problems it solved has relevance in the age of HTTP/2 and Service workers.  Does server-side rendering have anything near the potency it once did? Does the PRPL pattern, combined with web components and the addtion of key api's built into the browser, address everything isomorphic solutions addressed?  Or is a new paradigm needed, which leverages a lighter-weight server-rendering layer?  

Isomorphism was a convenient way to straddle the gap between two diverging directions the web was going until recently.  

Starting in 2005, with the advent of AJAX, and the widespread availability of broadband in developing nations, and with the great advances in just-in-time JavaScript compilation introduced by Chrome in 2008, desktop web applications have seen a great migration south, where all the logic has moved from the server to the client.  This produced generally richer applications able to compete with native desktop, with the minor expense of one-time download of the heavy libraries that fueled all the rich functionality.  Consolidating all the logic in one single-language layer also helped lighten the barrier to entry for new developers and made maintenance and debugging more straightforward.

On the other hand, with the introduction of the first truly web enabled phone in 2007, and the relatively unstable network conditions these devices must withstand, the huge momementum already in place for desktop applications meant that developers were effectively declaring defeat on the mobile web.

Eventually, some brave, innovative companies who were trying to make the mobile web work, like Twitter, AirBnB and Facebook, began to question the wisdom of pumping down all the client-side logic to the browser before anything rendered. Why it took so long to change course is an indication of how developer habits and biases tend to outlive their usefulness.  AirBnb famously introduced the concept of isomorphic rendering, and React added a functional view twist which increased the popularity of this approach.  (AirBnB would eventually adopt React).  Many frameworks have since followed suit, providing their own flavors of isomorphism (or "universalism").

But one framework or library has bucked that trend - Polymer, a framework that relies heavily on HTML5+ standards (some of which have not yet been fully ratified).  Their motto is "Use the Platform", rather than clever JavaScript workarounds.  Polymer (and the Chrome team and other browser vendors) have standardized a number of 

PuRPLiSh pattern

1. Requests / pushes for content / resources that don't change frequently, or are sensitive in nature,must be kept separate from requests / pushes for non sensitive resources that changes infrequently, so that the latter resources can be cached effectively.
    1. In fact, in many contexts, caching of the sensitive data could be considered an auditing violation.
2. For first time visitors, who have no cached resources, it is desirable to prioritize displaying:
    1. A navigational shell, so users can jump to where they want to go, followed by:
    2. A simple, 1998-style pure readonly HTML/CSS view of the content of the "home" view, without first having to wait for extensive libraries to download.  On the other hand, as the Polymer team would interject, we don't want to display buttons, sliders, other controls, if they don't do anything until those libraries are downloaded.  (Load the Walmart.com website in slow motion, by enabling network throttling, for plenty of examples of these). If some of that content is relatively dynamic or sensitive, then some sort of server-side (non-cached) rendering is therefore desirable. But we should do this without violating directive 1).
3.  As the PRPL pattern suggests, it is desirable to conduct a certain amount of preloading / caching of resources in the background that will be used for secondary views.
4.  On repeated visits, everything should be cached except the highly dynamic and/or sensitive data.  That data needs to be retrieved fresh every time a view is loaded.
5. For both first time visits and repeated visits, only those resources required for a particular view should be loaded first.

 