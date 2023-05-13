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
        // note: should this be for the ortho camera?
        this.zoom = { zoomValue: this.camera.perspectiveCamera.zoom };

        console.log(this.sizes.width);

        // Register plugin
        GSAP.registerPlugin(ScrollTrigger);

        this.setScrollTrigger();
    }

    // Triggers animation
    setScrollTrigger() {
        ScrollTrigger.matchMedia({
            // Desktop
            '(min-width: 969px)': () => {
                // note: do we need this line to set ortho. camera position?
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
                    // todo: set position for small desktops
                    x: () => {
                        return this.sizes.width < 1024 ? 0.8 : -2.7;
                    },
                    y: () => {
                        return this.sizes.width < 1024 ? 0.8 : 4.5;
                    }
                });

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
                            // todo: set position for small desktops
                            x: () => {
                                return this.sizes.width < 1024 ? 0.8 : 1.1;
                            },
                            y: () => {
                                return this.sizes.width < 1024 ? 0.8 : 4.4;
                            }
                        },
                        'same'
                    )
                    // Don't scale room; distorted shadows from wrong light position
                    .to(
                        this.zoom,
                        {
                            // Zoom for perspective camera
                            zoomValue: () => {
                                return this.sizes.width < 1024 ? 2 : 2.6;
                            },
                            onUpdate: () => {
                                // note: why is the ortho. zoom same as perspective
                                this.camera.orthographicCamera.zoom =
                                    this.zoom.zoomValue;
                                this.camera.orthographicCamera.updateProjectionMatrix();
                            }
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
                    // x-positive=model moves left
                    // y-positive=model moves up
                    x: () => {
                        // fix: x position when screen > 1024 in width
                        return this.sizes.width < 1024 ? 0.8 : -2.4;
                    },
                    y: () => {
                        // fix: y position when screen > 1024 in width
                        return this.sizes.width < 1024 ? 0.8 : 3.4;
                    }
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
