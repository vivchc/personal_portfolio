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

        // Store all children in Room for later reference
        this.roomChildren = {};
        // Store x, y, z scale values for children in Room
        this.roomChildrenScale = {};

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
        this.actualRoom.children.forEach((roomChild) => {
            if (roomChild.type === 'Object3D') {
                // Child is empty obj. holding groups and meshes; loop through children
                roomChild.children.forEach((e) => {
                    this.castShadow(e);
                });
            } else {
                // Child is already group or mesh
                this.castShadow(roomChild);
            }

            // Create a glass effect for tank water
            if (roomChild.name === 'bag_pets') {
                roomChild.children.forEach((child) => {
                    if (child.name.includes('tank')) {
                        child.children.forEach((e) => {
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
                });
            }

            // Add videoTexture to laptop screen
            if (roomChild.name === 'desk_stuff') {
                roomChild.children.forEach((child) => {
                    if (child.name.includes('laptop')) {
                        child.children.forEach((e) => {
                            if (e.material.name === 'screen') {
                                e.material = new THREE.MeshBasicMaterial({
                                    map: this.resources.items.laptop_screen
                                });
                            }
                        });
                    }
                });
            }

            // Load cup for preloader
            if (roomChild.name === 'cup_for_intro') {
                // Initial size
                roomChild.scale.set(3, 3, 3);
                // Lower y-position so cup is near its shadow, x=
                roomChild.position.set(-0.0026, -0.27, 0.120295);
                // Rotate cup so handle is left and right-side up
                roomChild.rotation.z = -Math.PI / 2;
                roomChild.rotation.x = -1.5 * Math.PI;
            }

            // Store room objects in roomChildren, scale values in this.roomChildrenScale. Hide all room objects.
            this.roomChildren[roomChild.name] = roomChild;

            // Saves original scale values then hides room object
            this.setAndSaveScale(roomChild);
        });

        // Scale room model to 2 square units on GridHelper
        this.actualRoom.scale.set(0.8, 0.8, 0.8);
        this.scene.add(this.actualRoom);
    }

    // Helper; saves the original scale into this.roomChildrenScale for each room object then hides it
    setAndSaveScale(roomChild) {
        if (
            roomChild.name != 'cup_for_intro' &&
            roomChild.name != 'room_window' &&
            roomChild.children.length > 0
        ) {
            // roomChild has children
            roomChild.children.forEach((child) => {
                // Rename asset name; cannot start with numbers
                child.name = child.name.substring(2);

                // Save original scale values. Scale object not iterable; set each to float.
                this.roomChildrenScale[child.name] = [
                    parseFloat(child.scale.x),
                    parseFloat(child.scale.y),
                    parseFloat(child.scale.z)
                ];

                // Move position for mailbox_floor
                if (child.name.includes('mailbox_floor')) {
                    // Save initial position with scale
                    this.roomChildrenScale[child.name].push(
                        parseFloat(child.position.x)
                    );
                    this.roomChildrenScale[child.name].push(
                        parseFloat(child.position.y)
                    );
                    this.roomChildrenScale[child.name].push(
                        parseFloat(child.position.z)
                    );

                    // Set mailbox platform floor in hidden position. Found via trial&error.
                    child.position.x = 5.5;
                    child.position.z = -5.5; // equi. to y in Blender
                }
                // Hide room object
                child.scale.set(0, 0, 0);
            });
        } else {
            // roomChild has NO children
            // Save original scale values. Scale object not iterable; set each to float.
            this.roomChildrenScale[roomChild.name] = [
                parseFloat(roomChild.scale.x),
                parseFloat(roomChild.scale.y),
                parseFloat(roomChild.scale.z)
            ];
            // Hide room object
            roomChild.scale.set(0, 0, 0);
        }
    }

    // Takes in a group or mesh object and cast shadows for them/each
    castShadow(obj) {
        if (obj.type === 'Group') {
            // Loop through group children
            obj.children.forEach((groupChild) => {
                // Cast shadow for each group child
                groupChild.castShadow = true;
                groupChild.receiveShadow = true;
            });
        } else {
            // Is a mesh; directly cast shadow
            obj.castShadow = true;
            obj.receiveShadow = true;
        }
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
        // Rotate room vertically based on cursor location
        this.actualRoom.rotation.y = this.lerp.current;
        // Set animation speed (larger value = faster)
        this.mixer.update(this.time.delta * 0.0008);
    }
}
