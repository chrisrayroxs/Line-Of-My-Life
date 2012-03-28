
    // All Examples Written by Casey Reas and Ben Fry  
    // unless otherwise stated.  
    void setup() {  
      size(200, 200); 
      background(0,0); 
      
    }  
      
    void draw() {  
      stroke(#000000);  
      strokeWeight(2);
      if(mousePressed) {  
        line(mouseX, mouseY, pmouseX, pmouseY);  
      }  
    }  
    
    void mousePressed() {
	background(0,0);
}

    void clearDrawidng() {
	background(0,0);
}
