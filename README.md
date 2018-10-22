# robots-zooo-simulator
Let's play some ZOOO
try to run away from the red attacker

#Quick start:
 run the game with:
 node app
 
 then connect it throw the tcp port `26881`
 
 and it will send u the position of the robots then you sould drive it with a string like this:

`
 <left_or_right_Wheel>, <forward_or_backward>, <speed>
 `
 
examples:


`
 0,0,500 //left wheel turns forward with 500 speed
 
 1,0,600 //right wheel turns forward with 600 speed
 
 0,1,500 //left wheel turns backward with 500 speed
`

speed range: 0~1000
