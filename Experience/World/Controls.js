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
        console.log(this.sizes.aspect);

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
                // Camera positions found via Firefox's res. design mode 1920x1080
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
                            x: () => {
                                // margin of error 0.1
                                if (Math.abs(this.sizes.aspect - 1.33) <= 0.1) {
                                    // For 4:3 aspect ratios
                                    return -2.1;
                                } else if (
                                    Math.abs(this.sizes.aspect - 1.6) <= 0.1
                                ) {
                                    // For 16:10 aspect ratios
                                    return -2.2;
                                }
                                return -2.4; // For 16:9 aspect ratios, 1.7:1
                            },
                            y: 4.5
                        },
                        'same'
                    )
                    // Don't scale room; distorted shadows from wrong light position
                    .to(
                        this.zoom,
                        {
                            zoomValue: () => {
                                // margin of error 0.1
                                if (Math.abs(this.sizes.aspect - 1.33) <= 0.1) {
                                    // For 4:3 aspect ratios
                                    return 0.8;
                                } else if (
                                    Math.abs(this.sizes.aspect - 1.6) <= 0.1
                                ) {
                                    // For 16:10 aspect ratios
                                    return 0.9;
                                }
                                return 1; // For 16:9 aspect ratios, 1.7:1
                            },
                            onUpdate: () => {
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
                            x: 1.1,
                            y: 4.4
                        },
                        'same'
                    )
                    // Don't scale room; distorted shadows from wrong light position
                    .to(
                        this.zoom,
                        {
                            zoomValue: 2,
                            onUpdate: () => {
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
                    // Relative to last ortho. camera position
                    .to(
                        this.camera.orthographicCamera.position,
                        {
                            y: 3.8
                        },
                        'same'
                    )
                    // Don't scale room; distorted shadows from wrong light position
                    .to(
                        this.zoom,
                        {
                            // Zoom for perspective camera, default 1
                            zoomValue: 1.8,
                            onUpdate: () => {
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
                        x: -1,
                        y: 3.3
                    });
            },
            // all
            all: () => {
                // Animate mailbox platform
                this.mailboxTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: '.third-scrollTrigger',
                        markers: true,
                        start: 'center center'
                    }
                });

                // Loop through children; this.room.children may render in arbitrary order
                this.room.children.forEach((roomChild) => {
                    if (roomChild.name === 'mailbox') {
                        roomChild.children.forEach((child) => {
                            // Animate mailbox floor extending out
                            if (child.name.includes('floor')) {
                                this.one = GSAP.to(child.position, {
                                    // Final position relative to starting position in model
                                    x: 0,
                                    z: 0, // equi. to y in Blender
                                    // note: adjust duration
                                    duration: 0.3 // lower = faster
                                });
                            }

                            // Animate steps (3 total)
                            if (child.name.includes('step_01')) {
                                this.two = GSAP.to(child.scale, {
                                    // Final size relative to WITHIN the scene
                                    x: 5.1,
                                    y: 5.1,
                                    z: 5.1,
                                    ease: 'back.out(2)', // obj expands then shrinks to actual size
                                    duration: 0.5 // lower = faster
                                });
                            }
                            if (child.name.includes('step_02')) {
                                this.three = GSAP.to(child.scale, {
                                    // Final size relative to WITHIN the scene
                                    x: 5.1,
                                    y: 5.1,
                                    z: 5.1,
                                    ease: 'back.out(2)', // obj expands then shrinks to actual size
                                    duration: 0.5 // lower = faster
                                });
                            }
                            if (child.name.includes('step_03')) {
                                this.four = GSAP.to(child.scale, {
                                    // Final size relative to WITHIN the scene
                                    x: 5.1,
                                    y: 5.1,
                                    z: 5.1,
                                    ease: 'back.out(2)', // obj expands then shrinks to actual size
                                    duration: 0.5 // lower = faster
                                });
                            }

                            // Animate mailbox itself
                            if (child.name.includes('stand')) {
                                this.five = GSAP.to(child.scale, {
                                    // Final size relative to WITHIN the scene
                                    x: 5.1,
                                    y: 5.1,
                                    z: 5.1,
                                    ease: 'back.out(2)', // obj expands then shrinks to actual size
                                    duration: 0.5 // lower = faster
                                });
                            }
                            if (child.name.includes('body')) {
                                this.six = GSAP.to(child.scale, {
                                    // Final size relative to WITHIN the scene
                                    x: 5.1,
                                    y: 5.1,
                                    z: 5.1,
                                    ease: 'back.out(2)', // obj expands then shrinks to actual size
                                    duration: 0.5 // lower = faster
                                });
                            }
                        });

                        // Animate children in order
                        this.mailboxTimeline.add(this.one); // floor
                        this.mailboxTimeline.add(this.two, '-=0.2'); // step1
                        this.mailboxTimeline.add(this.three, '-=0.2'); // step2
                        this.mailboxTimeline.add(this.four, '-=0.2'); // step3
                        this.mailboxTimeline.add(this.five, '-=0.2'); // mailbox stand
                        this.mailboxTimeline.add(this.six, '-=0.2'); // mailbox body
                    }
                });
            }
        });
    }

    resize() {}

    update() {}
}
