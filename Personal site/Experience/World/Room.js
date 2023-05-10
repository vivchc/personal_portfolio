import * as THREE from 'three';
import GSAP from 'gsap';
import time from '../Utils/Time';
import Experience from '../Experience';

export default class Room {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        // Grab loaded assets from Resources
        this.room = this.resources.items.room;
        this.actualRoom = this.room.scene;

        // lerp = linear interpolation, makes camera movement smoother
        this.lerp = {
            current: 0,
            target: 0, // update target on scroll
            ease: 0.1 // determines animation smoothness (larger = choppier)
        };

        this.setModel();
        this.setAnimation();
        this.onMouseMove();
    }

    // Add room model to scene
    setModel() {
        // Set shadows for each child of the room model
        this.actualRoom.children.forEach((child) => {
            child.castShadow = true;
            child.receiveShadow = true;

            // Make grouped children also cast shadows
            if (child instanceof THREE.Group) {
                child.children.forEach((groupChild) => {
                    groupChild.castShadow = true;
                    groupChild.receiveShadow = true;
                });
            }

            // Create a glass effect for tank water
            if (child.name === 'tank_water') {
                child.material = new THREE.MeshPhysicalMaterial();
                child.material.color.set('#DCF9FF');
                child.material.metalness = 0;
                // How reflective material is
                child.material.roughness = 0;
                // How much light is refracted, [1-2.3]
                child.material.ior = 2;
                // Transparency of material
                child.material.transmission = 1;
                // Visibility of object
                child.material.opacity = 1;
                child.material.envMap = 1;
            }

            // Add videoTexture to laptop screen
            if (child.name === 'laptop_screen') {
                child.material = new THREE.MeshBasicMaterial({
                    map: this.resources.items.laptop_screen
                });
            }

            // Add image texture to iPad
            // Add videoTexture to laptop screen
            if (child.name === 'laptop_screen') {
                child.material = new THREE.MeshBasicMaterial({
                    map: this.resources.items.laptop_screen
                });
            }
        });

        this.scene.add(this.actualRoom);
        // Scale room model to 2 square units on GridHelper
        this.actualRoom.scale.set(0.8, 0.8, 0.8);
    }

    // Add animation for fish
    setAnimation() {
        this.mixer = new THREE.AnimationMixer(this.actualRoom);

        this.swim = this.mixer.clipAction(this.room.animations[42]);
        this.swim.play();
    }

    // Slightly rotate room depending on cursor location
    onMouseMove() {
        // Listen for mouse movement
        window.addEventListener('mousemove', (e) => {
            this.rotation =
                ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth;
            this.lerp.target = this.rotation * 0.15; // sets how much to rotate room model
        });
    }

    resize() {}

    update() {
        this.lerp.current = GSAP.utils.interpolate(
            this.lerp.current,
            this.lerp.target,
            this.lerp.ease
        );
        // Rotate room based on cursor location
        this.actualRoom.rotation.y = this.lerp.current;
        // Set animation speed (larger value = faster)
        this.mixer.update(this.time.delta * 0.0008);
    }
}