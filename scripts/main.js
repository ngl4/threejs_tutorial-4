//Global vars
var objects = []; //collection of objects
var num = 20; //number of objects
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

//create a scene object
var scene = new THREE.Scene();

//create a perspective camera
var camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0.0, -1.0, 10.0); //x, y, z
camera.rotation.y = 0.5;

//create renderer
var renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("3d-image").appendChild(renderer.domElement);

//create environment map
var envMap = new THREE.CubeTextureLoader()
  .setPath("assets/")
  .load([
    "posx.jpg",
    "negx.jpg",
    "posy.jpg",
    "negy.jpg",
    "posz.jpg",
    "negz.jpg"
  ]);
//set as skybox
scene.background = envMap;

//create collection of objects
for (i = 0; i <= num; i++) {
  //create new Mesh
  var geometry = new THREE.SphereBufferGeometry(1, 30, 30);
  var material = new THREE.MeshPhysicalMaterial({
    envMap: envMap,
    metalness: 1.0,
    roughness: 0.0
  });
  var object = new THREE.Mesh(geometry, material);

  //set random position
  object.position.set(
    Math.random() * 20.0 - 10.0,
    Math.random() * 20.0 - 10.0,
    Math.random() * 20.0 - 10.0
  );

  //calculate distance as constant and assign to object
  var a = new THREE.Vector3( 0, 0, 0 );
  var b = object.position;
  var d = a.distanceTo( b );
  object.distance = d;

  //define 2 random but constant angles in radians
  object.radians = Math.random() * 360 * Math.PI/180; //initial angle
  object.radians2 = Math.random() * 360 * Math.PI/180; //initial angle

  //add object to scene
  scene.add(object);
  //add to collection
  objects.push(object);

}

//render the scene
var animate = function () {
  requestAnimationFrame( animate );
  for (i=0; i <= num; i++) {
    var o = objects[i];

    if (i % 2 == 0){
      o.radians += .008;
      o.radians2 += .008;
    }else {
      o.radians -= .008;
      o.radians2 -= .008;

    }
    o.position.x = (Math.cos(o.radians) * o.distance);
    o.position.y = (Math.sin(o.radians) * o.distance);
    o.position.z = (Math.sin(o.radians2) * o.distance*.5);


  }
  renderer.render (scene, camera);
};
animate();

//add a click event listener (mousedown) --harder to control
// document.addEventListener( 'mousedown', onDocumentMouseDown, false);
// function onDocumentMouseDown( event ) {
//   event.preventDefault();

//   mouse.x = ( event.clientX / renderer.domElement.clientWidth ) *2 -1;
//   mouse.y = ( event.clientY / renderer.domElement.clientHeight ) *2 -1;
//   raycaster.setFromCamera( mouse, camera );

//   var intersects = raycaster.intersectObjects ( objects, true );
//   if ( intersects.length > 0) {
//     active = intersects[ 0 ].object; //get the first object intersects
//     active.material.color.setHex( Math.random() * 0xffffff ); //change material to random color
//   }
// }


//add a click event listener (mousemove)
document.addEventListener( 'mousemove', onDocumentMouseMove, false);
function onDocumentMouseMove( event ) {
  event.preventDefault();
  mouse.x = ( event.clientX / renderer.domElement.clientWidth ) *2 -1;
  mouse.y = ( event.clientY / renderer.domElement.clientHeight ) *2 -1;
  raycaster.setFromCamera( mouse, camera );

  var intersects = raycaster.intersectObjects ( objects, true );
  if ( intersects.length > 0) {
    active = intersects[ 0 ].object; //get the first object intersects
    //change material to random color
    active.material.color.setHex( Math.random() * 0xffffff );

    document.getElementById("3d-image").style.cursor = "pointer";
  }else {
    document.getElementById("3d-image").style.cursor = "default";

  }
}

//add mobile/touch event listener
document.addEventListener( 'touchstart', onDocumentTouchStart, false);
function onDocumentTouchStart( event ) {

  if (event.touches.length === 1) {
    event.preventDefault();
    mouse.x = + ( event.targetTouches[0].pageX / window.innerWidth ) *2 -1;
    mouse.y = ( event.targetTouches[0].pageY / window.innerHeight ) *2 -1;
    raycaster.setFromCamera( mouse, camera );
  
    var intersects = raycaster.intersectObjects ( objects, true );
    if ( intersects.length > 0) {
      active = intersects[ 0 ].object; //get the first object intersects
      //change material to random color
      active.material.color.setHex( Math.random() * 0xffffff );
      }
  } 
}

