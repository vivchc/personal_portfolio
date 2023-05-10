// Handles all the controls for the camera/room (?)
import * as THREE from 'three';
import Experience from '../Experience';
import GSAP from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';

export default class Controls {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.sizes = this.experience.sizes;
        this.time = this.experience.time;
        this.camera = this.experience.camera;
        this.room = this.experience.world.room.actualRoom;

        // Register plugin
        GSAP.registerPlugin(ScrollTrigger);

        this.setPath();
    }

    // Triggers animation
    setPath() {
        console.log(this.room);
        this.timeline = new GSAP.timeline();
        // Move mesh instead of camera
        this.timeline.to(this.room.position, {
            x: () => {
                return this.sizes.width * 0.002;
            },
            scrollTrigger: {
                trigger: '.first-scrollTrigger',
                markers: true,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1, // animates with scroll
                invalidateOnRefresh: true
            }
        });
    }

    resize() {}

    update() {}
}
