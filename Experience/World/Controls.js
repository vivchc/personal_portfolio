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
        this.zoom = { zoomValue: this.camera.orthographicCamera.zoom };

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
                // note: do we need to set ortho. camera and room scale here?
                // Landing page
                this.camera.orthographicCamera.position.set(-0.2, 4.5, 6.5);
                this.room.scale.set(0.8, 0.8, 0.8);

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
                })
                    // Relative to last ortho. camera position
                    .to(
                        this.camera.orthographicCamera.position,
                        {
                            // x: () => {
                            //     return this.sizes.width <= 1024 ? -2.7 : -2.2;
                            // },
                            x: -2.7,
                            y: 4.5
                        },
                        'same'
                    );

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
                    // Relative to last ortho. camera position
                    .to(
                        this.camera.orthographicCamera.position,
                        {
                            // x: () => {
                            //     return this.sizes.width <= 1024 ? 1.1 : 1;
                            // },
                            x: 1.1,
                            y: 4.4
                        },
                        'same'
                    )
                    // Don't scale room; distorted shadows from wrong light position
                    .to(
                        this.zoom,
                        {
                            zoomValue: () => {
                                // Zoom for perspective camera
                                // todo: haven't checked if the ternary operator is needed
                                return this.sizes.width <= 1024 ? 2 : 2.6;
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
                })
                    // Relative to last ortho. camera position
                    .to(this.camera.orthographicCamera.position, {
                        x: -2.4,
                        y: 3.4
                    });
            },

            // Mobile. Should be the same max-width as media query in style.css
            '(max-width: 968px)': () => {
                // Landing page
                this.camera.orthographicCamera.position.set(-0.04, 4, 6.5);
                this.room.scale.set(0.45, 0.45, 0.45);

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
                })
                    // Don't scale room; distorted shadows from wrong light position
                    .to(
                        this.zoom,
                        {
                            // Zoom for perspective camera, default 1
                            zoomValue: 1.8,
                            onUpdate: () => {
                                // note: why is the ortho. zoom same as perspective
                                this.camera.orthographicCamera.zoom =
                                    this.zoom.zoomValue;
                                this.camera.orthographicCamera.updateProjectionMatrix();
                            }
                        },
                        'same'
                    );

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
                    // Relative to last ortho. camera position
                    .to(
                        this.camera.orthographicCamera.position,
                        {
                            x: 0.1,
                            y: 3.85
                        },
                        'same'
                    )
                    // Don't scale room; distorted shadows from wrong light position
                    .to(
                        this.zoom,
                        {
                            // Zoom for perspective camera, +0.5
                            zoomValue: 2.5,
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
                })
                    // Relative to last ortho. camera position
                    .to(
                        this.camera.orthographicCamera.position,
                        {
                            x: -1,
                            y: 3.5
                        },
                        'same'
                    );
            },
            // all
            all: () => {}
        });
    }

    resize() {}

    update() {}
}
