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
            // Make objects within empty objects cast shadows
            if (
                child instanceof THREE.Object3D ||
                child instanceof THREE.Group
            ) {
                for (let i = 0; i < child.children.length; i++) {
                    child.children[i].children.forEach((groupChild) => {
                        groupChild.castShadow = true;
                        groupChild.receiveShadow = true;
                    });
                }
            }

            // Make grouped children also cast shadows
            if (child instanceof THREE.Group) {
                child.children.forEach((groupChild) => {
                    groupChild.castShadow = true;
                    groupChild.receiveShadow = true;
                });
            }

            // Create a glass effect for tank water
            if (child.name === 'bag_pets') {
                child.children[0].children.forEach((e) => {
                    if (e.material.name === 'tank_water') {
                        e.material = new THREE.MeshPhysicalMaterial();
                        e.material.color.set('#DCF9FF');
                        e.material.metalness = 0;
                        // How reflective material is
                        e.material.roughness = 0;
                        // How much light is refracted, [1-2.3]
                        e.material.ior = 2;
                        // Transparency of material
                        e.material.transmission = 1;
                        // Visibility of object
                        e.material.opacity = 1;
                        e.material.envMap = 1;
                    }
                });
            }

            // Add videoTexture to laptop screen
            if (child.name === 'desk_stuff') {
                child.children[3].children[0].material =
                    new THREE.MeshBasicMaterial({
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

        this.room.animations.forEach((ani) => {
            if (ani.name.includes('fishAction')) {
                this.swim = this.mixer.clipAction(ani);
                this.swim.play();
            }
        });
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
