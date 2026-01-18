import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';

let scene, camera, renderer, objects = [];
let width = window.innerWidth;
let height = window.innerHeight * 0.6;

// Initialize Three.js scene
function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121212);
    scene.fog = new THREE.Fog(0x121212, 10, 50);

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    const container = document.getElementById('three-js-canvas');
    if (!container) return;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x9c27b0, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x673ab7, 1, 100);
    pointLight.position.set(-10, -10, 10);
    scene.add(pointLight);

    // Create 3D objects
    createCubes();
    createSpheres();
    createTorus();
    createParticles();

    // Event listeners
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);

    // Start animation loop
    animate();
}

// Create animated cubes
function createCubes() {
    const materials = [
        new THREE.MeshPhongMaterial({ color: 0x9c27b0, emissive: 0x6a1b9a }),
        new THREE.MeshPhongMaterial({ color: 0x673ab7, emissive: 0x4527a0 })
    ];

    for (let i = 0; i < 3; i++) {
        const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        const material = materials[i % materials.length];
        const cube = new THREE.Mesh(geometry, material);

        cube.position.x = (i - 1) * 2;
        cube.position.y = Math.sin(i * Math.PI / 3) * 1.5;
        cube.castShadow = true;
        cube.receiveShadow = true;

        cube.userData = {
            rotationSpeed: Math.random() * 0.05 + 0.01,
            floatSpeed: Math.random() * 0.01 + 0.005,
            floatRange: 0.5,
            initialY: cube.position.y
        };

        scene.add(cube);
        objects.push(cube);
    }
}

// Create animated spheres
function createSpheres() {
    const geometry = new THREE.IcosahedronGeometry(0.6, 4);
    const materials = [
        new THREE.MeshPhongMaterial({
            color: 0x9c27b0,
            wireframe: false,
            emissive: 0x6a1b9a,
            shininess: 100
        }),
        new THREE.MeshPhongMaterial({
            color: 0x673ab7,
            wireframe: false,
            emissive: 0x4527a0,
            shininess: 100
        })
    ];

    for (let i = 0; i < 2; i++) {
        const sphere = new THREE.Mesh(geometry, materials[i]);
        sphere.position.set(
            Math.cos(i * Math.PI) * 3,
            Math.sin(i * Math.PI / 2) * 1.5,
            -2
        );
        sphere.castShadow = true;
        sphere.receiveShadow = true;

        sphere.userData = {
            rotationSpeed: 0.03,
            orbitSpeed: 0.005,
            orbitRadius: 3,
            initialX: sphere.position.x,
            initialY: sphere.position.y
        };

        scene.add(sphere);
        objects.push(sphere);
    }
}

// Create animated torus
function createTorus() {
    const geometry = new THREE.TorusGeometry(2, 0.4, 16, 64);
    const material = new THREE.MeshPhongMaterial({
        color: 0x9c27b0,
        emissive: 0x6a1b9a,
        shininess: 100
    });
    
    const torus = new THREE.Mesh(geometry, material);
    torus.rotation.x = Math.PI / 3;
    torus.castShadow = true;
    torus.receiveShadow = true;

    torus.userData = {
        rotationSpeed: 0.01,
        tiltSpeed: 0.005
    };

    scene.add(torus);
    objects.push(torus);
}

// Create particle system
function createParticles() {
    const particleCount = 100;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 20;
        positions[i + 1] = (Math.random() - 0.5) * 20;
        positions[i + 2] = (Math.random() - 0.5) * 20;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0x9c27b0,
        size: 0.1,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.6
    });

    const particles = new THREE.Points(geometry, material);
    particles.userData = {
        rotationSpeed: 0.0005
    };

    scene.add(particles);
    objects.push(particles);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Animate objects
    objects.forEach((obj, index) => {
        if (obj.userData) {
            const data = obj.userData;

            // Cube rotations and floating
            if (data.rotationSpeed && data.floatSpeed) {
                obj.rotation.x += data.rotationSpeed;
                obj.rotation.y += data.rotationSpeed * 1.5;
                obj.position.y = data.initialY + Math.sin(Date.now() * data.floatSpeed) * data.floatRange;
            }
            // Sphere rotations and orbiting
            else if (data.orbitSpeed) {
                obj.rotation.x += data.rotationSpeed;
                obj.rotation.y += data.rotationSpeed;
                const time = Date.now() * data.orbitSpeed;
                obj.position.x = Math.cos(time) * data.orbitRadius;
                obj.position.y = data.initialY + Math.sin(time * 0.5) * 0.5;
            }
            // Torus rotation and tilt
            else if (data.tiltSpeed) {
                obj.rotation.x += data.rotationSpeed;
                obj.rotation.y += data.rotationSpeed * 0.5;
                obj.rotation.z += data.tiltSpeed;
            }
            // Particles rotation
            else if (data.rotationSpeed === 0.0005) {
                obj.rotation.x += data.rotationSpeed;
                obj.rotation.y += data.rotationSpeed * 2;
            }
        }
    });

    renderer.render(scene, camera);
}

// Mouse movement interaction
function onMouseMove(event) {
    const mouseX = (event.clientX / width) * 2 - 1;
    const mouseY = -(event.clientY / height) * 2 + 1;

    objects.forEach((obj) => {
        if (obj instanceof THREE.Mesh) {
            obj.rotation.x += mouseY * 0.0005;
            obj.rotation.y += mouseX * 0.0005;
        }
    });
}

// Window resize handler
function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight * 0.6;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    renderer.dispose();
});
