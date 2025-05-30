//Importing lib.
    import kaboom from "kaboom"

//Setting screen config and defining "k" as a 'get' of kaboom lib.
    const k=kaboom({
        width:800, //X
        height:600, //Y
        stretch:false, //Define if screen game gonna stretch with screen size values. 
        letterbox:true, //Create edges on screen size rounded, put the corners on the middle.
        background:[0,0,0] //Black.
    });
//End.


//Loading sprites.
    const playerSprite=k.loadSprite("player","sprites/chromeSprite.png");
    const candySprite=k.loadSprite("candy","sprites/Ram.png");
    const gameBackgroundSprite=k.loadSprite("gameBackground","sprites/waterfall.jpg");
    const snakeTitleSprite=k.loadSprite("snakeTitleSprite","sprites/snakeTitleSprite.png");
    const startTextSprite=k.loadSprite("startTextSprite","sprites/startTextSprite.png");
    const gameOverTextSprite=k.loadSprite("gameOverTextSprite","sprites/gameOverTextSprite.png");
    const retryTextSprite=k.loadSprite("retryTextSprite","sprites/retryTextSprite.png");
    const scoreTextSprite=k.loadSprite("scoreTextSprite","sprites/scoreTextSprite.png");
    const motivationTextSprite=k.loadSprite("motivationTextSprite","sprites/motivationTextSprite.png");
//End.


//Defining game scene and start mechanic game programming.
    k.scene("game",()=>{
        //Setup background color.
            k.add([
                k.sprite(gameBackgroundSprite),
                k.scale(1),
                "background"
            ]);

        //Player is let beacause your values his change in others code block's.
            let player=add([
                k.sprite(playerSprite),
                k.scale(0.1),
                k.pos(center()),
                k.area(), //Setup object collison.
                {speed:200,currentDir:"up"},
                "snake-head" //Tag to call the object more easily.
            ]);
        //End.

        //Snake body array for make body size increment.
            let snakeBody=[];

        //Function will be spawn random apples in the map.
            function spawnApple(){
                k.add([
                    k.sprite(candySprite),
                    k.pos(rand(100,700),rand(100,500)), //Defining random position for each spawned.
                    k.scale(1.1),
                    k.area(),
                    "candy"
                ]);
            };
        //End.


        //Score att rotine and change player spped for each apple eated.
            k.add([
                k.sprite(scoreTextSprite),
                k.scale(0.3),
                k.pos(-90,-90),
            ]);

            let score=add([  //Created for show number score text in screen.
                k.text(""),
                k.scale(1),
                k.pos(180,22),
                {value:0} //Score value, this value will be increased.
            ]);


            //Verify collision between player and candy.
            player.onCollide("candy",(candy)=>{
                k.destroy(candy); //Destroy object.
                spawnApple(); //Call the function will be spawn candy in random positions after collide.
 

                score.value+=1; //Increase new value on score value variable.
                score.text=""+score.value; //Update text with new value.


                player.speed+=5; //Increases player speed value.


                //Verify if snakebody have any segment. If yes(snakeBody.length > 0), pick the last body segment(snakeBody[snakeBody.length - 1]). If no, use the snake head with reference. On resume, if snake have body, use the last segment with parameter, if no have body, use the snake head with parameter.
                const lastSegment=snakeBody.length>0 ? snakeBody[snakeBody.length-1]:player;
                const newSegment=add([
                    k.sprite(playerSprite),
                    k.scale(0.1),
                    k.pos(lastSegment.pos),
                    k.area(),
                    "snake-body"
                ]);
                //Increment a new segment on snake body array.
                snakeBody.push(newSegment);
            });
        //End.


        //Movement mechanic. Adjust the default direction value for the key that was pressed.
            k.onKeyDown("up",()=>{
                player.currentDir="up" //The lib reference directions based on keyboard dpad.
            });
            k.onKeyDown("down",()=>{
                player.currentDir="down"
            });
            k.onKeyDown("left",()=>{
                player.currentDir="left"
            });
            k.onKeyDown("right",()=>{
                player.currentDir="right"
            });
        //End.


        //Function to check distance between player sprite and snake body.
            function closePositions(position1,position2){ //Position parameters that will checked.
                const spriteSize=32; //Variable to use as a parameter in the distance check.
                return position1.dist(position2)<spriteSize; //This line will check distance between arg1 and arg2 and check if they are less spriteSize value variable. '.dist()' is from lib.
            };
        //End.   


        //Update game for each frame and action in game. I'm unique all mechanics what need update by frame in just one 'onUpdate' for best organize and less redundacy, because all this things use onUpdate, so, use just one work's normarly.
            k.onUpdate(()=>{
                //Update player movement, frame by frame.
                    //Temporary array for save actual player position.
                        const previousPosition=[];


                    //Saving actual snake head position. player.pos.clone() make's a copy of snake head for avoid change original value.
                        previousPosition.push(player.pos.clone());


                    //Saving each snake body piece.
                        for(let i=0;i<snakeBody.length;i++){
                            //Clone position of item in array for previousPositions.
                            previousPosition.push(snakeBody[i].pos.clone());
                        };
                    //End.


                    //Change player movement direction.
                        switch(player.currentDir){
                            case "up"://Reconize what key is pressed, based in movement mechanic code block.
                                player.pos.y-=player.speed*dt() //dt() is the time since the last frame, used so that the speed is consistent even with different FPS rates.
                                break; //Break, because if don't have break after check case, the switch will continue check which key was pressed.
                            case "down":
                                player.pos.y+=player.speed*dt()
                                break;
                            case "left":
                                player.pos.x-=player.speed*dt()
                                break;
                            case "right":
                                player.pos.x+=player.speed*dt()
                                break;
                        };
                    //End.
                    

                    //It causes each segment of the body to move to the previous position of the segment in front. Example: segment 1 go to snake head position previous, segment 2 go to where the segment 1 was.
                        for(let i=0;i<snakeBody.length;i++){
                            snakeBody[i].pos=previousPosition[i];
                        };
                    //End.
                //End.


                //Makes collision system to check if the snake touch screen edge, if yes, turn back.
                    //0 is the inicial position of screen limit, it's work to height too.
                    switch(true){
                        case(player.pos.x<0):
                            player.currentDir="right";
                            break;

                        //Final limit of screen, it's work to height too.
                        case(player.pos.x>755):
                            player.currentDir="left";
                            break;

                        case(player.pos.y<0):
                            player.currentDir="down";
                            break;

                        case(player.pos.y>550):
                            player.currentDir="up";
                            break;
                    };
                //End.
             

                //Rotine to check collision between player and snake body array.
                    for(let i=20;i<snakeBody.length;i++){ //i=20 for check after snake body get big, because if i=0, will always check, as they are very close.
                        if(closePositions(player.pos,snakeBody[i].pos)){
                            go("game-over")
                        }
                    };
                //End.
            });
        //End.
    

        //Call the function for spawn first apple, after first spawn, the others block code will work.
            spawnApple();
});
//End.
        //Main menu before start game.
            k.scene("main-menu",()=>{
                k.add([
                    k.sprite(snakeTitleSprite),
                    k.scale(0.3),
                    k.pos(150,140),
                    "snake-game-title"
                ]);

                k.add([
                    k.sprite(startTextSprite),  
                    k.scale(0.5),
                    k.color(rgb(255,0,0)), //Red.
                    k.pos(-15,100),
                    retryGame(),
                    "start-text"
                ]);
            });
        //End.
    


        //Game over scene, used when player collide with snake body after 30th segment.
            k.scene("game-over",()=>{
                k.add([
                    k.sprite(gameOverTextSprite),
                    k.scale(0.3),
                    k.pos(150,100),
                    "game-over-sprite"
                ]);

                k.add([
                    k.sprite(retryTextSprite),
                    k.scale(0.5),
                    k.color(rgb(255,0,0)), //Red.
                    k.pos(20,100),
                    retryGame(), //Call retryGame function.
                    "retry-text-sprite"
                ]);

                k.add([
                    k.sprite(motivationTextSprite),
                    k.scale(0.3),
                    k.pos(160,370),
                    "motivation-text-sprite"
                ]);
            });

            //Function to retry game when game over screen is called.
            function retryGame(){
                k.onKeyDown("space",()=>{
                    go("game") //Create new game scene.
                })
            };
        //End.


    //Start on main menu scene.
        go("main-menu");
