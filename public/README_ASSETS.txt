Optional assets for the mini-game
---------------------------------

Place your ship sprite as `assets/ship.png` under the `public` folder so it is served at runtime:

  public/assets/ship.png

The game will automatically load it if present and draw it instead of the built-in pixel art. Suggested sprite size: ~44x18px. Any size works; the image is scaled to fit and drawn with smoothing disabled for crisp pixels.

You can also provide a rock sprite:

  public/assets/rock.png

Rocks will use this image if present. Any size works; it will be fitted within each rock's bounding box.

Optionally, provide a whale sprite:

  public/assets/whale.png

Whales will use this sprite if present. If omitted, a simple pixel whale is drawn.
