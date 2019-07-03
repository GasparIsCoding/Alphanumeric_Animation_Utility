# Alphanumeric Animation Utility
Create custom animations for 14-segment alphanumeric displays plus the dot segment!

![demo animation](https://github.com/GasparIsCoding/Alphanumeric_Animation_Utility/blob/gh-pages/demo_images/animation_demo.gif)

# [ACCESS THE UTILITY HERE](https://gaspariscoding.github.io/Alphanumeric_Animation_Utility/)

This code generates hex arrays based on your animations. Select and copy the arrays, and paste them on your IDE. Test your animation in the browser or play it in your display by writting a simple for-loop or by using delays!

This utility is meant to help you code Arduino sketches that use an alphanumeric display such as the:

**[Adadruit 0.54" Alphanumeric display with i2c backpack](https://learn.adafruit.com/adafruit-led-backpack/0-54-alphanumeric) and**

**[Adafruit 0.54" Quad Alphanumeric FeatherWing Display with i2c backpack](https://learn.adafruit.com/14-segment-alpha-numeric-led-featherwing)**

## How to use this utility
![demo of the interface](https://github.com/GasparIsCoding/Alphanumeric_Animation_Utility/blob/gh-pages/demo_images/interface_demo.jpg)

- Start by choosing the LED's color. Choose 1 of 5 predefined colors or choose your favorite with the color picker. You can change the color at any time.
- Start animating!
- Press over the segments you wish to turn on. Press again to turn them off.
- When you're done with the first frame, press the **>>> Next Frame** button.
- You can modify previous frames by pressing the **<<< Previous Frame** button.
- Test your animation by pressing the **PLAY** or **STOP** buttons, and adjust the **playback speed slider**.
- When you're done with your animation, select and copy the 4 arrays on bottom of the page. Paste them on your IDE - e.g., the Arduino IDE.
- Finish your code on your IDE by writing a for-loop, or use delays to switch each frame of the animation. You must use the Adafruit's libraries in order to use the writeDigitRaw() function. It should look something like this - alpha4.writeDigitRaw(0, digit_0[i]);

- Check the Adafruit guide on [how to incorporate and use the necessary libraries in your sketch](https://learn.adafruit.com/adafruit-led-backpack/0-54-alphanumeric).

### Have fun! If you use this utility, feel free to share your projects with me!

Code written by [P. Gaspar](https://pedrogaspar.weebly.com/). 2019


### Ideas for future updates
- Right now you can only animate 1 display (= 4 digits). In future updates I would like to have up to 4 displays (= 16 digits). 
- Create a "delete last frame" button.
Stay tuned.
