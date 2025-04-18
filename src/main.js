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

//create a geometry and a material to color it
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "purple" });

//create a mesh with the geometry and material (takes geometry and applies material to it)
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

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
    cube.material.color.set(Math.random() * 0xffffff);
  //  cube.scale.x=1.5;
  //  cube.scale.y=1.5;
  //  cube.scale.z=1.5; 

        // Scale up then scale down
        gsap.timeline()
        .to(cube.scale, {
          x: 1.5,
          y: 1.5,
          z: 1.5,
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

//on window resize, update the renderer size and camera aspect ratio
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});


function animate() {
  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);
  cube.rotation.z += 0.01;
  // cube.rotation.y += 0.01;
  cube.rotation.x += 0.01;
}
animate();
