# Core Gaming HTML5/JavaScript Games Developer - Tech Test - Jarrod Verhagen's Submission

## Cover Note - Technology Used

After converting the old JS code I wrote in anticipation for this test into an ES6 project, I went ahead and continued with the test outlines.

I wanted to use ES6 to demonstarte my understanding of it, and due to it usually producing cleaner easier to read code.

I used webpack as the minified code reduces load times.

The system was originally coded expecting spin result data to contain reel positions, win line ids, and amount won. While this did not end up as the case converting the data allowed for an almost identical result in-game.

The reels system rather than having an entire reel worth of symbols being cropped, instead only has as many sprites as will ever be visible and switches textues as needed.
This is usually the more efficient way to handle reel display but that does depend on the graphics system used. As I am new to PIXI.js I cannot be sure if this faster or not. A test of both methods would need to occur to know for sure.


## Cover Note - Running the project

 - First install all node modules with 'npm i' in the projects root.
 - Transpile the code by running watchScript.bat
 - The transpiled code will appear in the 'dist' folder. Having a site set up to point to this folder will allow the game to be played.