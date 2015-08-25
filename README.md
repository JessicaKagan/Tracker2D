# Tracker2D
A step sequencer that uses a 2D space metaphor like Simtunes; think Mario Paint colliding with FL Studio. "Bugs" move over a grid composed of tiles representing music instructions, and sounds play when the bugs travel over a tile containing an instruction. The sound features are intended to provide functionality roughly equivalent to MOD files, although that's a way off from actually being the case.

This program is in late alpha. While the program is far from complete, there is enough functionality implemented that you can easily create interesting music with it. Most development effort is going towards UI improvements and increasing the range of sound/instrumentation possible. Besides the GitHub Pages version, you can also play with a live version of this program at http://www.kongregate.com/games/PepsiPoP/tracker2d.

Currently, this software uses jQuery 2.1.3, the Web Audio API, and eventually the HTML File API (currently FileReader is used). More acknowledgements as I add things. It also uses XMLHTTPRequest to prep sound files, so you won't be able to run it locally unless you have server software like XAMPP set up. Making it work without that will probably require a major refactoring and the replacement of various crucial libraries. I also use Vorbis audio for the sound set, so make sure your browser supports that.

So far, this code runs best on Chrome. Firefox seems to handle it decently as well, but there are some issues with visual alignment that eventually need to be handled.

Current bugs:
- Not enough watchful eyes bleeding at the sight of code errors
- Some tools may use reference pastes instead of deep clone pastes via jQuery.extend();
- Mouse input can be 'sticky' and occasionally problematic if you click too fast or drag properly (I can't tell you more because I don't know how quite to describe it).
- Occasionally, if you click the bottom row, the canvas doesn't register the click properly and instead selects some unknown text (eventually the first UIShifter div).
- Large fields and their save/loads may have various odd bugs. They're also really slow.
- Microsoft Edge does not support Vorbis audio.

Tracker2D contains some code released under the MIT License. The following block of legalese applies to such:

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.