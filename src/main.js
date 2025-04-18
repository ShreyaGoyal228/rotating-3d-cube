import * as THREE from "three";
import gsap from "gsap";

//create a scene
const scene = new THREE.Scene();

//create a camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(); //craete a 2D vector to store the mouse position

camera.position.z = 5;

//display the background points/stars
const starGeometry=new THREE.BufferGeometry();
const starCount = 1500;
const starVertices = [];
for (let i = 0; i < starCount; i++) {
  const x = (Math.random() - 0.5) * 200;
  const y = (Math.random() - 0.5) * 200;
  const z = -Math.random() * 200;
  starVertices.push(x, y, z);
}
starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starVertices, 3)
);

const starMaterial = new THREE.PointsMaterial({ color: 0xffffff,size:0.4,sizeAttenuation:true });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

//create a geometry and a material to color it
const geometry = new THREE.BoxGeometry(2, 2, 2);
// const material = new THREE.MeshBasicMaterial({ color: "purple"});

//to give it a shiny look, we used MeshPhysicalMaterial
const material = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("purple"),   
  metalness: 1,                       
  roughness: 0,                    
  reflectivity: 1,                   
  clearcoat: 1,                      
  clearcoatRoughness: 0,
  sheen: 1,                          
  sheenColor: new THREE.Color("purple"),
});

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(-5, 5, 5);
scene.add(directionalLight);

//create a mesh with the geometry and material (takes geometry and applies material to it)
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Add dashed edges outline to the cube
const edgesGeometry = new THREE.EdgesGeometry(geometry);
const edgesMaterial = new THREE.LineDashedMaterial({ color: 0xffffff, linewidth: 0.1, opacity: 0.5, dashSize:0.03, gapSize:0.03 });
const lines = new THREE.LineSegments(edgesGeometry, edgesMaterial);
lines.computeLineDistances();
cube.add(lines);

const canvas = document.querySelector("canvas");  

//change the cube color on mouse click
canvas.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  //shoot a ray from camera through the point where the mouse is clicked
  raycaster.setFromCamera(mouse, camera);

  //check basically for intersection of ray with the cube
  const intersects = raycaster.intersectObjects([cube]);

  if (intersects.length > 0) {
    // If cube is clicked
    const newColor= new THREE.Color(Math.random() * 0xffffff);
    cube.material.color.set(newColor);
    cube.material.sheenColor.set(newColor);
  //  cube.scale.x=1.5;
  //  cube.scale.y=1.5;
  //  cube.scale.z=1.5; 

        // Scale up then scale down
        gsap.timeline()
        .to(cube.scale, {
          x: 1.2,
          y: 1.2,
          z: 1.2,
          duration: 0.6,
        })
        .to(cube.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.6,
        });
  }
});

//create a renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

//changing the background color of canvas
renderer.setClearColor(0x000000); 

//on window resize, update the renderer size and camera aspect ratio
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

const starPositions = starGeometry.attributes.position.array;


function animate() {
  window.requestAnimationFrame(animate);
  // Move stars forward (along z-axis)
  for (let i = 2; i < starPositions.length; i += 3) {
    starPositions[i] += 0.1; // move z towards the camera 

    // Reset star if it goes beyond the camera
    if (starPositions[i] > 0) {
      starPositions[i] = -200; 
    }
  }
  starGeometry.attributes.position.needsUpdate = true;
  renderer.render(scene, camera);
  cube.rotation.z += 0.02;
  // cube.rotation.y += 0.01;
  cube.rotation.x += 0.02;
}
animate();

// Add animation to the heading
gsap.from("h1",{
  duration:2,
  y:60,
  opacity:0
})