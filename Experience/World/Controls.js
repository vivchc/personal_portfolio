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

        this.setScrollTrigger();
    }

    // Triggers animation
    setScrollTrigger() {
        ScrollTrigger.matchMedia({
            // Desktop
            '(min-width: 969px)': () => {
                this.camera.orthographicCamera.position.set(-0.2, 4.5, 6.5);
                // First section
                this.firstMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: '.first-scrollTrigger',
                        markers: true,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1, // animates with scroll
                        invalidateOnRefresh: true
                    }
                }).to(this.camera.orthographicCamera.position, {
                    x: -2.7, // positive=model moves left
                    y: 4.5 // position relative to camera's starting point
                });
                // }).to(this.room.position, {
                //     x: () => {
                //         return this.sizes.width * 0.002;
                //     }
                // });

                // Second section
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: '.second-scrollTrigger',
                        markers: true,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1, // animates with scroll
                        invalidateOnRefresh: true
                    }
                })
                    .to(
                        this.camera.orthographicCamera.position,
                        {
                            // Relative to last ortho. camera position
                            x: 3.3, // positive=model moves left
                            y: 5.9 // positive=model moves up
                        },
                        'same'
                    )
                    .to(
                        this.room.scale,
                        {
                            x: 2.3,
                            y: 2.3,
                            z: 2.3
                        },
                        'same'
                    );

                // Third section
                this.thirdMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: '.third-scrollTrigger',
                        markers: true,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1, // animates with scroll
                        invalidateOnRefresh: true
                    }
                }).to(this.camera.orthographicCamera.position, {
                    // Relative to last ortho. camera position
                    x: -6.5, // positive=model moves left
                    y: 3.7 // positive=model moves up
                });
            },

            // Mobile. Should be the same max-width as media query in style.css
            '(max-width: 968px)': () => {},
            // all
            all: () => {}
        });
    }

    resize() {}

    update() {}
}
