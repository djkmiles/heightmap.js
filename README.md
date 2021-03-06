To use, a canvas element must be appended.

Example:

![513px png heightmap](https://raw.githubusercontent.com/djkmiles/heightmap.js/master/noisemap.png)


```
<canvas id='display' width='1' height='1'>
```

```
var display = document.getElementById('display');
var ctx = display.getContext('2d');

terrain = new Terrain(9);
display.width = terrain.size;
display.height = terrain.size;
terrain.generate(0.7);
terrain.draw(ctx);
```

Convert PNG to RAW 16 heightmap format with ImageMagick.

Mac format:

```
convert noisemap.png -depth 16 -endian msb gray:heightmap.raw
```

PC format:

```
convert noisemap.png -depth 16 -endian lsb gray:heightmap.raw
```


based on http://demos.playfuljs.com/terrain/
