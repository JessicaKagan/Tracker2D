# Tracker2D
A step sequencer that uses a 2D space metaphor like Simtunes; think Mario Paint colliding with FL Studio. "Bugs" move over a grid composed of tiles representing music instructions, and sounds play when the bugs travel over a tile containing an instruction. The sound features are intended to provide functionality roughly equivalent to MOD files, although that's a way off from actually being the case.

This program is in alpha. While the program is far from complete, there is enough functionality implemented that you could actually create listenable music with it.

Currently, this software uses jQuery 2.1.3, the Web Audio API, and eventually the HTML File API (currently FileReader is used). More acknowledgements as I add things. It also uses XMLHTTPRequest type things, so you won't be able to run it locally unless you have server software like XAMPP set up. Making it work without that will probably require a major refactoring and the replacement of various crucial libraries. I also intend to use Vorbis to supply audio, so make sure your browser supports that.

So far, this code runs best on Chrome. Firefox seems to handle it decently as well, but there are some issues with visual alignment that eventually need to be handled.

Current bugs:
- Not enough watchful eyes bleeding at the sight of code errors
- Copies of counters made with the select and paste tools share their counter state until they hit 0
- Revert tiles are glitchy and sometimes get ignored by the bugs.
- Large fields and their save/loads may be broken; definite tile corruption in the upper right of large fields. They're also really slow.
- Unknown glitch with tile pointers, used for counters and teleports and such?
- On Google Chrome, slowed down samples don't play for their entire length; should be fixed in either v44 or v45.

Tracker2D contains some code released under the MIT License. The following block of legalese applies to such:

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.