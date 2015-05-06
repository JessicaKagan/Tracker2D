# Tracker2D
A step sequencer that uses a 2D space metaphor like Simtunes. "Bugs" move over a grid composed of tiles representing music instructions, and sounds play when the bugs travel over a tile containing an instruction. The sound features are intended to provide functionality roughly equivalent to MOD files, although that's a way off from actually being the case.

This program is in alpha. While the program is far from complete, there is enough functionality implemented that you could actually create listenable music with it.

Currently, this software uses jQuery 2.1.3, the Web Audio API, and eventually the HTML File API.. More acknowledgements as I add things.
It also uses XMLHTTPRequest type things, so you won't be able to run it locally unless you have server software like XAMPP set up, or if I can get the thing working on an actual server. Making it work without that will probably require a major refactoring and the replacement of various crucial libraries.
So far, this code runs best on Chrome. Firefox seems to handle it decently as well, but there are some issues with visual alignment that eventually need to be handled.

Current bugs:
- Not enough watchful eyes bleeding at the sight of code errors