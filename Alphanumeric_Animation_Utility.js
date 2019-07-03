/*
 Alphanumeric Animation Utility - Create custom animations for 14-segment displays plus the dot segment.
 Created by P. Gaspar, July, 2019.
 https://pedrogaspar.weebly.com
 https://github.com/GasparIsCoding
 
 Coded in p5.js
*/

let digit_0;
let digit_1;
let digit_2;
let digit_3;

let bColor1;
let bColor2;
let bColor3;
let bColor4;
let bColor5;
let customColor;
let selColor;
let baseColor;
let ledText;
let segmentOutline;

let copyPasteInfo;

let prevFrame;
let nextFrame;
let totalFrames=0;
let currentFrame=0;

let buttonsPos=850;

let binaryTitle = "Binary values: ";
let hexTitle = "Hex values: ";
let isRewindOn;

let playbackSpeedText;
let speedSlider;

let playB;
let stopB;
let playBool=false;

let prevTimeCounter;

let mergeBuffer;

function setup() {
  createCanvas(900, 500);
  frameRate(25);

  ////Meaning of the Digit's() constructor: 1st is the digit's index, 2nd the X position, 3rd the Y position
  digit_0 = new Digit(0, 112, 10);
  digit_1 = new Digit(1, 262, 10);
  digit_2 = new Digit(2, 412, 10);
  digit_3 = new Digit(3, 562, 10);

  ////in drawBuffer() I'm creating a hidden image for each digit in order to have functional, non-rectangle buttons.
  digit_0.drawBuffer();
  digit_1.drawBuffer();
  digit_2.drawBuffer();
  digit_3.drawBuffer();

  ////Customize the digit's color. Choose from 5 predefined colors or choose your own with the color picker.
  ledText=createP('LED color: ');
  ledText.style('color', '#FFFFFF');
  ledText.position(buttonsPos-80, 8);

  selColor = color(255, 255, 255); //Segment's default color when mouse is pressed.
  baseColor = color(25, 25, 25); //Segment's default color when not pressed. It's always dark grey, unless you change this line ;)
  segmentOutline = color (255, 204, 0); //The orange outline

  bColor1 = createButton("White");
  bColor1.position (buttonsPos, 20);
  bColor1.mousePressed(() => {
    changeSelColor(color(255, 255, 255));
  }
  );

  bColor2 = createButton("Red");
  bColor2.position (buttonsPos+57, 20);
  bColor2.mousePressed(() => {
    changeSelColor(color(250, 0, 0));
  }
  );

  bColor3 = createButton("Yellow");
  bColor3.position (buttonsPos+105, 20);
  bColor3.mousePressed(() => {
    changeSelColor(color(250, 250, 0));
  }
  );

  bColor4 = createButton("Blue");
  bColor4.position (buttonsPos+165, 20);
  bColor4.mousePressed(() => {
    changeSelColor(color(0, 0, 255));
  }
  );

  bColor5 = createButton("Green");
  bColor5.position (buttonsPos+215, 20);
  bColor5.mousePressed(() => {
    changeSelColor(color(85, 230, 30));
  }
  );

  customColor = createColorPicker('#EF1AFF');
  customColor.position(buttonsPos+275, 20);
  customColor.input(changeCustomSelColor);
  //// 

  ////Playback buttons
  prevFrame = createButton("<<< Previous Frame");
  prevFrame.position (20, 500);
  prevFrame.attribute('disabled', 'false');
  prevFrame.mousePressed(rewindFrame);

  nextFrame = createButton(">>> Next Frame");
  nextFrame.position (760, 500);
  nextFrame.mousePressed(forwardFrame);


  speedSlider = createSlider(0.2, 10, 5, 0.2);
  speedSlider.position(190, 530);
  speedSlider.style('width', '50px');

  textAlign(LEFT);
  playbackSpeedText =createP("Playback speed: "+speedSlider.value());
  playbackSpeedText.position(10, 510);
  playbackSpeedText.style('font-size', '20px');
  playbackSpeedText.style('color', '#AAAAAA');

  playB = createButton("PLAY");
  playB.position(255, 522);
  playB.style('font-size', '25px');
  playB.mousePressed(()=> {
    playOrStop(true);
  }
  );

  stopB = createButton("STOP");
  stopB.position(255+100, 522);
  stopB.style('font-size', '25px');
  stopB.mousePressed(()=> {
    playOrStop(false);
  }
  );

  prevTimeCounter = millis()-(speedSlider.value()*100);
  ////

  mergeBuffer = createGraphics(1280, 720);
  mergeBuffer.background(0);
  mergeBuffer.blend(digit_0.bufferImg, 0, 0, 1280, 720, 0, 0, 1280, 720, ADD);
  mergeBuffer.blend(digit_1.bufferImg, 0, 0, 1280, 720, 0, 0, 1280, 720, ADD);
  mergeBuffer.blend(digit_2.bufferImg, 0, 0, 1280, 720, 0, 0, 1280, 720, ADD);
  mergeBuffer.blend(digit_3.bufferImg, 0, 0, 1280, 720, 0, 0, 1280, 720, ADD);

  copyPasteInfo=createP('Select and copy the arrays below into your IDE');
  copyPasteInfo.style('color', '#FF3E3E');
  copyPasteInfo.position(10, 550);
}

function changeSelColor(color_) {
  selColor = color_;
}

function changeCustomSelColor() {
  selColor = color(this.value());
}

function playOrStop(bool_) {
  if (totalFrames>0) {
    playBool = bool_;
  }
}

function forwardFrame() {
  prevFrame.removeAttribute('disabled');

  currentFrame +=1;

  if (currentFrame > totalFrames ) {
    totalFrames +=1;

    digit_0.digitArray[currentFrame] = '0x0000';
    digit_1.digitArray[currentFrame] = '0x0000';
    digit_2.digitArray[currentFrame] = '0x0000';
    digit_3.digitArray[currentFrame] = '0x0000';

    digit_0.updateHexArray();
    digit_1.updateHexArray();
    digit_2.updateHexArray();
    digit_3.updateHexArray();

    digit_0.refreshDigits('Forward', currentFrame);
    digit_1.refreshDigits('Forward', currentFrame);
    digit_2.refreshDigits('Forward', currentFrame);
    digit_3.refreshDigits('Forward', currentFrame);
  } else {    
    //When you press the "next frame" button, but it's not the last frame of the animation.

    digit_0.refreshDigits('Forward2', currentFrame); 
    digit_1.refreshDigits('Forward2', currentFrame);
    digit_2.refreshDigits('Forward2', currentFrame);
    digit_3.refreshDigits('Forward2', currentFrame);
  }
}

function rewindFrame() {

  if (currentFrame >0) {
    currentFrame -=  1;
  } else {
    currentFrame = 0;
  }

  digit_0.refreshDigits('Rewind', currentFrame);
  digit_1.refreshDigits('Rewind', currentFrame);
  digit_2.refreshDigits('Rewind', currentFrame);
  digit_3.refreshDigits('Rewind', currentFrame);
}

function draw() {
  background(50, 50, 50);

  textSize(15);
  fill(255);
  text(binaryTitle, 2, 250);
  text(hexTitle, 18, 280);

  let timeElapsed = millis() - prevTimeCounter;

  playbackSpeedText.html("Playback speed: "+(map(speedSlider.value(), 0.2, 10, 10, 0.2).toFixed(2)));

  //playing or stopping the animation's playback
  if (playBool==true) {
    //plays the animation
    if (timeElapsed > (speedSlider.value()*100)) {
      prevTimeCounter = millis();

      if (currentFrame<=totalFrames) {
        if (currentFrame>=totalFrames) {
          currentFrame=0;
        } else {
          currentFrame+=1;
        }
        digit_0.refreshDigits('Forward2', currentFrame);
        digit_1.refreshDigits('Forward2', currentFrame);
        digit_2.refreshDigits('Forward2', currentFrame);
        digit_3.refreshDigits('Forward2', currentFrame);
      }
    }
  } else if (playBool==false) {
    //stops playing
  }

  //setting up the color after mouse press and the base color when not pressed
  digit_0.draw_(color(selColor), color(baseColor));
  digit_1.draw_(color(selColor), color(baseColor));
  digit_2.draw_(color(selColor), color(baseColor));
  digit_3.draw_(color(selColor), color(baseColor));

  textAlign(CENTER);
  noStroke();
  fill(255);
  textSize(20);
  text("Current frame: " + currentFrame, 520, 357);

  textAlign(LEFT);

  //image(mergeBuffer, 0, 0); //This is the hidden image that the code uses in order to check in which digit's segments the mouse is pressing. Check it out!
}

function mousePressed() {
  digit_0.mousePressed_(digit_0.bufferImg.get(mouseX, mouseY));
  digit_1.mousePressed_(digit_1.bufferImg.get(mouseX, mouseY));
  digit_2.mousePressed_(digit_2.bufferImg.get(mouseX, mouseY));
  digit_3.mousePressed_(digit_3.bufferImg.get(mouseX, mouseY));
}

function mouseMoved() { //This function just switches the cursor when hoovering the digit's segments
  //I'm only using the red channel (since I'm working with shades of black and white, all RGB channels have the same value).

  if (red(mergeBuffer.get(mouseX, mouseY)) >0) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
}

class Digit {  //Each digit is created from this class

  constructor(index, posX, posY) {

    //setup
    this.index = index;
    this.orX = posX;
    this.orY = posY;

    //booleans
    this.digitBooleans = [];
    this.prevDigitBooleans = [];

    for (var b = 0; b < 16; b++) {
      this.digitBooleans[b] = false;
    }

    this.stringBinary="abc";
    this.valBinary1=0;
    this.valBinary2=0;
    this.valBinary3=0;
    this.valBinary4=0;
    this.block = [];
    this.stringFinalHexVal="0";

    let bufferImg;

    this.digitColors = [];

    for (var c = 0; c < 15; c++) {
      this.digitColors[c] = color((c+1)*17, (c+1)*17, (c+1)*17);
    } 

    let binaryViewer;
    this.binaryViewer = "0000000000000000";

    let hexVal;
    this.hexVal ="0x0000";

    this.digitArray = [];
    this.digitArraySize =0;

    this.hexArray = createP('int digit_'+this.index+'[1] = {0x0000};');
    this.hexArray.style('color', '#FFFFFF');
    this.hexArray.position (10, (this.orY)+(this.orX/2)+520);

    this.digitArray[0] = '0x0000';
  }

  drawBuffer() { //In order to have functional, non-rectangle buttons for each segment,
    //I applyed a technique which consists in creating an image that will not be seen 
    //by the user (bufferImg). This image has a different color for each button.
    //When the user presses the mouse button, the mouse's X and Y coordinates are compared against
    //the pixel coordinates on the hidden image, which then turns the segment on or off.

    this.bufferImg = createGraphics(1280, 720);

    this.bufferImg.noStroke();

    this.bufferImg.fill(this.digitColors[0]);
    //Digit A
    this.bufferImg.beginShape();
    this.bufferImg.vertex(this.orX + 29, this.orY + 0);
    this.bufferImg.vertex(this.orX + 124, this.orY + 0);
    this.bufferImg.vertex(this.orX + 129, this.orY + 6);
    this.bufferImg.vertex(this.orX + 118, this.orY + 16);
    this.bufferImg.vertex(this.orX + 33, this.orY + 16);
    this.bufferImg.vertex(this.orX + 23, this.orY + 6);
    this.bufferImg.endShape(CLOSE);

    this.bufferImg.fill(this.digitColors[1]);
    //Digit B
    this.bufferImg.beginShape();
    this.bufferImg.vertex(this.orX + 131, this.orY + 7);
    this.bufferImg.vertex(this.orX + 136, this.orY + 14);
    this.bufferImg.vertex(this.orX + 130, this.orY + 95);
    this.bufferImg.vertex(this.orX + 120, this.orY + 103);
    this.bufferImg.vertex(this.orX + 113, this.orY + 95);
    this.bufferImg.vertex(this.orX + 120, this.orY + 17);
    this.bufferImg.endShape(CLOSE);

    this.bufferImg.fill(this.digitColors[2]);
    //Digit C
    this.bufferImg.beginShape();
    this.bufferImg.vertex(this.orX + 120, this.orY + 108);
    this.bufferImg.vertex(this.orX + 128, this.orY + 114);
    this.bufferImg.vertex(this.orX + 121, this.orY + 198);
    this.bufferImg.vertex(this.orX + 114, this.orY + 202);
    this.bufferImg.vertex(this.orX + 105, this.orY + 192);
    this.bufferImg.vertex(this.orX + 112, this.orY + 116);
    this.bufferImg.endShape(CLOSE);

    this.bufferImg.fill(this.digitColors[3]);
    //Digit D
    this.bufferImg.beginShape();
    this.bufferImg.vertex(this.orX + 18, this.orY + 194);
    this.bufferImg.vertex(this.orX + 104, this.orY + 194);
    this.bufferImg.vertex(this.orX + 113, this.orY + 204);
    this.bufferImg.vertex(this.orX + 107, this.orY + 210);
    this.bufferImg.vertex(this.orX + 11, this.orY + 210);
    this.bufferImg.vertex(this.orX + 6, this.orY + 205);
    this.bufferImg.endShape(CLOSE);

    this.bufferImg.fill(this.digitColors[4]);
    //Digit E
    this.bufferImg.beginShape();
    this.bufferImg.vertex(this.orX + 14, this.orY + 108);
    this.bufferImg.vertex(this.orX + 21, this.orY + 114);
    this.bufferImg.vertex(this.orX + 17, this.orY + 192);
    this.bufferImg.vertex(this.orX + 5, this.orY + 203);
    this.bufferImg.vertex(this.orX + 0, this.orY + 198);
    this.bufferImg.vertex(this.orX + 5, this.orY + 114);
    this.bufferImg.endShape(CLOSE);

    this.bufferImg.fill(this.digitColors[5]);
    //Digit F
    this.bufferImg.beginShape();
    this.bufferImg.vertex(this.orX + 21, this.orY + 7);
    this.bufferImg.vertex(this.orX + 31, this.orY + 17);
    this.bufferImg.vertex(this.orX + 24, this.orY + 95);
    this.bufferImg.vertex(this.orX + 16, this.orY + 103);
    this.bufferImg.vertex(this.orX + 9, this.orY + 95);
    this.bufferImg.vertex(this.orX + 15, this.orY + 13);
    this.bufferImg.endShape(CLOSE);

    this.bufferImg.fill(this.digitColors[6]);
    //Digit G1
    this.bufferImg.beginShape();
    this.bufferImg.vertex(this.orX + 17, this.orY + 105);
    this.bufferImg.vertex(this.orX + 25, this.orY + 97);
    this.bufferImg.vertex(this.orX + 59, this.orY + 97);
    this.bufferImg.vertex(this.orX + 66, this.orY + 105);
    this.bufferImg.vertex(this.orX + 57, this.orY + 112);
    this.bufferImg.vertex(this.orX + 23, this.orY + 112);
    this.bufferImg.endShape(CLOSE);

    this.bufferImg.fill(this.digitColors[7]);
    //Digit G2
    this.bufferImg.beginShape();
    this.bufferImg.vertex(this.orX + 69, this.orY + 105);
    this.bufferImg.vertex(this.orX + 78, this.orY + 97);
    this.bufferImg.vertex(this.orX + 110, this.orY + 97);
    this.bufferImg.vertex(this.orX + 118, this.orY + 105);
    this.bufferImg.vertex(this.orX + 111, this.orY + 112);
    this.bufferImg.vertex(this.orX + 76, this.orY + 112);
    this.bufferImg.endShape(CLOSE);

    this.bufferImg.fill(this.digitColors[8]);
    //Digit H
    this.bufferImg.beginShape();
    this.bufferImg.vertex(this.orX + 33, this.orY + 18);
    this.bufferImg.vertex(this.orX + 41, this.orY + 18);
    this.bufferImg.vertex(this.orX + 61, this.orY + 66);
    this.bufferImg.vertex(this.orX + 58, this.orY + 95);
    this.bufferImg.vertex(this.orX + 54, this.orY + 95);
    this.bufferImg.vertex(this.orX + 32, this.orY + 35);
    this.bufferImg.endShape(CLOSE);

    this.bufferImg.fill(this.digitColors[9]);
    //Digit J
    this.bufferImg.beginShape();
    this.bufferImg.vertex(this.orX + 75, this.orY + 18);
    this.bufferImg.vertex(this.orX + 83, this.orY + 26);
    this.bufferImg.vertex(this.orX + 76, this.orY + 96);
    this.bufferImg.vertex(this.orX + 68, this.orY + 103);
    this.bufferImg.vertex(this.orX + 61, this.orY + 96);
    this.bufferImg.vertex(this.orX + 67, this.orY + 26);
    this.bufferImg.endShape(CLOSE);

    this.bufferImg.fill(this.digitColors[10]);
    //Digit K
    this.bufferImg.beginShape();
    this.bufferImg.vertex(this.orX + 111, this.orY + 18);
    this.bufferImg.vertex(this.orX + 117, this.orY + 18);
    this.bufferImg.vertex(this.orX + 116, this.orY + 35);
    this.bufferImg.vertex(this.orX + 84, this.orY + 95);
    this.bufferImg.vertex(this.orX + 78, this.orY + 95);
    this.bufferImg.vertex(this.orX + 81, this.orY + 69);
    this.bufferImg.endShape(CLOSE);

    this.bufferImg.fill(this.digitColors[11]);
    //Digit L
    this.bufferImg.beginShape();
    this.bufferImg.vertex(this.orX + 52, this.orY + 115);
    this.bufferImg.vertex(this.orX + 57, this.orY + 115);
    this.bufferImg.vertex(this.orX + 55, this.orY + 139);
    this.bufferImg.vertex(this.orX + 24, this.orY + 191);
    this.bufferImg.vertex(this.orX + 17, this.orY + 191);
    this.bufferImg.vertex(this.orX + 21, this.orY + 167);
    this.bufferImg.endShape(CLOSE);

    this.bufferImg.fill(this.digitColors[12]);
    //Digit M
    this.bufferImg.beginShape();
    this.bufferImg.vertex(this.orX + 67, this.orY + 107);
    this.bufferImg.vertex(this.orX + 75, this.orY + 114);
    this.bufferImg.vertex(this.orX + 69, this.orY + 183);
    this.bufferImg.vertex(this.orX + 60, this.orY + 191);
    this.bufferImg.vertex(this.orX + 53, this.orY + 185);
    this.bufferImg.vertex(this.orX + 59, this.orY + 115);
    this.bufferImg.endShape(CLOSE);

    this.bufferImg.fill(this.digitColors[13]);
    //Digit N
    this.bufferImg.beginShape();
    this.bufferImg.vertex(this.orX + 77, this.orY + 115);
    this.bufferImg.vertex(this.orX + 81, this.orY + 115);
    this.bufferImg.vertex(this.orX + 104, this.orY + 174);
    this.bufferImg.vertex(this.orX + 103, this.orY + 191);
    this.bufferImg.vertex(this.orX + 94, this.orY + 191);
    this.bufferImg.vertex(this.orX + 75, this.orY + 139);
    this.bufferImg.endShape(CLOSE);

    //Digit DP
    this.bufferImg.fill(this.digitColors[14]);
    this.bufferImg.ellipse(this.orX + 132, this.orY + 203, 15, 15);

    this.bufferImg.loadPixels();
  }

  draw_(selColor, baseColor) { //This is what the user sees

    ////This is the info shown below each digit
    noStroke();
    fill(255);
    textSize(15);
    text(this.binaryViewer, this.orX, this.orY+240);
    text(this.hexVal, this.orX, this.orY+270);
    ////

    this.selColor = selColor;
    this.baseColor = baseColor;
    stroke(segmentOutline);//The segment's outline
    strokeWeight(1);

    //Segment A
    if (this.digitBooleans[0]==true) {
      fill(this.selColor);
    } else {
      fill(this.baseColor);
    }
    beginShape();
    vertex(this.orX + 29, this.orY + 0);
    vertex(this.orX + 124, this.orY + 0);
    vertex(this.orX + 129, this.orY + 6);
    vertex(this.orX + 118, this.orY + 16);
    vertex(this.orX + 33, this.orY + 16);
    vertex(this.orX + 23, this.orY + 6);
    endShape(CLOSE);

    //Segment B
    if (this.digitBooleans[1]==true) {
      fill(this.selColor);
    } else {
      fill(this.baseColor);
    }
    beginShape();
    vertex(this.orX + 131, this.orY + 7);
    vertex(this.orX + 136, this.orY + 14);
    vertex(this.orX + 130, this.orY + 95);
    vertex(this.orX + 120, this.orY + 103);
    vertex(this.orX + 113, this.orY + 95);
    vertex(this.orX + 120, this.orY + 17);
    endShape(CLOSE);

    //Segment C
    if (this.digitBooleans[2]==true) {
      fill(this.selColor);
    } else {
      fill(this.baseColor);
    }
    beginShape();
    vertex(this.orX + 120, this.orY + 108);
    vertex(this.orX + 128, this.orY + 114);
    vertex(this.orX + 121, this.orY + 198);
    vertex(this.orX + 114, this.orY + 202);
    vertex(this.orX + 105, this.orY + 192);
    vertex(this.orX + 112, this.orY + 116);
    endShape(CLOSE);

    //Segment D
    if (this.digitBooleans[3]==true) {
      fill(this.selColor);
    } else {
      fill(this.baseColor);
    }
    beginShape();
    vertex(this.orX + 18, this.orY + 194);
    vertex(this.orX + 104, this.orY + 194);
    vertex(this.orX + 113, this.orY + 204);
    vertex(this.orX + 107, this.orY + 210);
    vertex(this.orX + 11, this.orY + 210);
    vertex(this.orX + 6, this.orY + 205);
    endShape(CLOSE);

    //Digit E    
    if (this.digitBooleans[4]==true) {
      fill(this.selColor);
    } else {
      fill(this.baseColor);
    }
    beginShape();
    vertex(this.orX+ 14, this.orY + 108);
    vertex(this.orX+ 21, this.orY + 114);
    vertex(this.orX+ 17, this.orY + 192);
    vertex(this.orX+ 5, this.orY + 203);
    vertex(this.orX+ 0, this.orY + 198);
    vertex(this.orX+ 5, this.orY + 114);
    endShape(CLOSE);

    //Digit F
    if (this.digitBooleans[5]==true) {
      fill(this.selColor);
    } else {
      fill(this.baseColor);
    }
    beginShape();
    vertex(this.orX+ 21, this.orY + 7);
    vertex(this.orX+ 31, this.orY + 17);
    vertex(this.orX+ 24, this.orY + 95);
    vertex(this.orX+ 16, this.orY + 103);
    vertex(this.orX+ 9, this.orY + 95);
    vertex(this.orX+ 15, this.orY + 13);
    endShape(CLOSE);

    //Digit G1
    if (this.digitBooleans[6]==true) {
      fill(this.selColor);
    } else {
      fill(this.baseColor);
    }
    beginShape();
    vertex(this.orX+ 17, this.orY + 105);
    vertex(this.orX+ 25, this.orY + 97);
    vertex(this.orX+ 59, this.orY + 97);
    vertex(this.orX+ 66, this.orY + 105);
    vertex(this.orX+ 57, this.orY + 112);
    vertex(this.orX+ 23, this.orY + 112);
    endShape(CLOSE);

    //Digit G2
    if (this.digitBooleans[7]==true) {
      fill(this.selColor);
    } else {
      fill(this.baseColor);
    }
    beginShape();
    vertex(this.orX+ 69, this.orY + 105);
    vertex(this.orX+ 78, this.orY + 97);
    vertex(this.orX+ 110, this.orY + 97);
    vertex(this.orX+ 118, this.orY + 105);
    vertex(this.orX+ 111, this.orY + 112);
    vertex(this.orX+ 76, this.orY + 112);
    endShape(CLOSE);

    //Digit H
    if (this.digitBooleans[8]==true) {
      fill(this.selColor);
    } else {
      fill(this.baseColor);
    }
    beginShape();
    vertex(this.orX+ 33, this.orY + 18);
    vertex(this.orX+ 41, this.orY + 18);
    vertex(this.orX+ 61, this.orY + 66);
    vertex(this.orX+ 58, this.orY + 95);
    vertex(this.orX+ 54, this.orY + 95);
    vertex(this.orX+ 32, this.orY + 35);
    endShape(CLOSE);

    //Digit J
    if (this.digitBooleans[9]==true) {
      fill(this.selColor);
    } else {
      fill(this.baseColor);
    }
    beginShape();
    vertex(this.orX+ 75, this.orY + 18);
    vertex(this.orX+ 83, this.orY + 26);
    vertex(this.orX+ 76, this.orY + 96);
    vertex(this.orX+ 68, this.orY + 103);
    vertex(this.orX+ 61, this.orY + 96);
    vertex(this.orX+ 67, this.orY + 26);
    endShape(CLOSE);

    //Digit K
    if (this.digitBooleans[10]==true) {
      fill(this.selColor);
    } else {
      fill(this.baseColor);
    }
    beginShape();
    vertex(this.orX+ 111, this.orY + 18);
    vertex(this.orX+ 117, this.orY + 18);
    vertex(this.orX+ 116, this.orY + 35);
    vertex(this.orX+ 84, this.orY + 95);
    vertex(this.orX+ 78, this.orY + 95);
    vertex(this.orX+ 81, this.orY + 69);
    endShape(CLOSE);

    //Digit L
    if (this.digitBooleans[11]==true) {
      fill(this.selColor);
    } else {
      fill(this.baseColor);
    }
    beginShape();
    vertex(this.orX+ 52, this.orY + 115);
    vertex(this.orX+ 57, this.orY + 115);
    vertex(this.orX+ 55, this.orY + 139);
    vertex(this.orX+ 24, this.orY + 191);
    vertex(this.orX+ 17, this.orY + 191);
    vertex(this.orX+ 21, this.orY + 167);
    endShape(CLOSE);

    //Digit M
    if (this.digitBooleans[12]==true) {
      fill(this.selColor);
    } else {
      fill(this.baseColor);
    }
    beginShape();
    vertex(this.orX+ 67, this.orY + 107);
    vertex(this.orX+ 75, this.orY + 114);
    vertex(this.orX+ 69, this.orY + 183);
    vertex(this.orX+ 60, this.orY + 191);
    vertex(this.orX+ 53, this.orY + 185);
    vertex(this.orX+ 59, this.orY + 115);
    endShape(CLOSE);

    //Digit N
    if (this.digitBooleans[13]==true) {
      fill(this.selColor);
    } else {
      fill(this.baseColor);
    }
    beginShape();
    vertex(this.orX+ 77, this.orY + 115);
    vertex(this.orX+ 81, this.orY + 115);
    vertex(this.orX+ 104, this.orY + 174);
    vertex(this.orX+ 103, this.orY + 191);
    vertex(this.orX+ 94, this.orY + 191);
    vertex(this.orX+ 75, this.orY + 139);
    endShape(CLOSE);

    //Digit DP
    if (this.digitBooleans[14]==true) {
      fill(this.selColor);
    } else {
      fill(this.baseColor);
    }
    ellipse(this.orX+ 132, this.orY + 203, 15, 15);
  }

  mousePressed_(colorClick) {
    var separator = '';
    var theColor;
    theColor = colorClick;
    if (mouseX >this.orX && mouseX<this.orX+140 && mouseY >this.orY && mouseY <this.orY+220) {

      for (var m = 0; m < 15; m++) { //Checking if I'm pressing one of the segments

        if (red(colorClick) == red(this.digitColors[m])) { //I ended up only comparing the red channels

          if (this.digitBooleans[m]==false) {
            this.digitBooleans[m] =true;
          } else if (this.digitBooleans[m] ==true) {
            this.digitBooleans[m]=false;
          }
        }
      }

      this.stringBinary = join(byte(this.digitBooleans).reverse(), separator);

      this.finalStringBinary = this.stringBinary;

      this.binaryViewer = this.finalStringBinary;

      this.finalHexVal = binaryToHex(this.finalStringBinary);

      this.digitArray[currentFrame] = '0x'+this.finalHexVal;

      this.updateHexArray();

      this.hexVal= this.digitArray[currentFrame];
    }
  }
  updateHexArray() {// This is the "copy-able" text with the hex values for each frame of animation
    this.hexArray.html('int digit_'+this.index+'['+(totalFrames+1)+'] = {' +join(this.digitArray, ', ')+'};');
  }

  refreshDigits(rewindOrForward, frame) {
    this.hexVal= this.digitArray[frame];
    this.binaryViewer = hexStringToByteNoReverse(this.hexVal);

    if (rewindOrForward=='Forward') {
      isRewindOn=false;
      if (currentFrame==totalFrames) {

        let convertHexToBinaryForward = hexStringToByte(this.digitArray[frame]);
        for (var b = 0; b < 16; b++) {
          this.digitBooleans[b] = (convertHexToBinaryForward.charAt(b));
        }
      }

      for (var m = 0; m < 16; m++) {
        this.digitBooleans[m] = false;
      }
    }

    if (rewindOrForward=="Forward2") { //Displays the following frame, except for the last frame of the animation

      isRewindOn=false;
      let convertHexToBinary = hexStringToByte(this.digitArray[currentFrame]);

      for (var v = 0; v < 16; v++) {
        this.digitBooleans[v] = (convertHexToBinary.charAt(v));
      }
    }

    if (rewindOrForward=="Rewind") {
      isRewindOn=true;

      let convertHexToBinary = hexStringToByte(this.digitArray[frame]);

      for (var n = 15; n >=0; n--) {
        this.digitBooleans[n] = (convertHexToBinary.charAt(n));
      }
    }
  }
}

function binaryToHex(value) {
  let sum = 0;
  for (let u=0; u<value.length; u++) {
    let bit = value.charAt(value.length-u-1);
    sum += parseInt(bit) * pow(2, u);
  }
  return (hex(sum)).substring(4);
}

function hexStringToByte(hex) {
  let convertToBinary = 0;
  convertToBinary = (parseInt(hex, 16).toString(2)).padStart(16, '0');
  let splitBinaryArray = convertToBinary.split("");

  let reverseBinaryArray= splitBinaryArray.reverse();

  let joinFinalArray = reverseBinaryArray.join("");

  return joinFinalArray;
}

function hexStringToByteNoReverse(hex_) {
  let convertToBinary_ = 0;
  convertToBinary_ = (parseInt(hex_, 16).toString(2)).padStart(16, '0');
  return convertToBinary_;
}
