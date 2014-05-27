FontCutter
==========

I've created a small HTML5 tool ([FontCutter](http://fontcutter.fbksoft.com)) to easily generate Angel Code Font files (documentation here) for fixed-sized font sheets. This format is used in many game frameworks, like libgdx and several Unity3D plugins, and probably many many other ones.

Most tools available allow you to generate these descriptors by rasterizing true type fonts (like Hiero or Bitmap Font Generator), but I couldn't find any simple way to quickly generate this file, when you start with an existing bitmap sheet.

### How to use

It's really straightforward. Click on "open an image", tweak the char width and height until the grid match perfectly the letters in the image. Then manually write down the glyphs. Click on "preview" to check everything is fine. Once you're satisfied with the result, simply click on "ouput", and copy paste the result in a new fnt file.








