// Handles all the controls for the camera/room (?)
import * as THREE from 'three';
import Experience from './Experience';
import GSAP from 'gsap';
import ASScroll from '@ashthornton/asscroll';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import { EventEmitter } from 'events';

export default class Controls extends EventEmitter {
    constructor() {
        super();
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.sizes = this.experience.sizes;
        this.time = this.experience.time;
        this.camera = this.experience.camera;
        this.room = this.experience.world.room;
        this.actualRoom = this.experience.world.room.actualRoom;
        this.zoom = { zoomValue: this.camera.orthographicCamera.zoom };

        this.circle1 = this.experience.world.floor.circle1;
        this.circle2 = this.experience.world.floor.circle2;
        this.circle3 = this.experience.world.floor.circle3;

        // To animate mailbox objects
        this.roomChildren = this.room.roomChildren;
        this.roomChildrenScale = this.room.roomChildrenScale;

        // Register plugin
        GSAP.registerPlugin(ScrollTrigger);

        // Make touch scrolling in mobile. Reenables overflow because hidden in style.css
        // note: Needed because of assScroll or gsap
        document.querySelector('.page').style.overflow = 'visible';

        this.setSmoothScroll();
        this.setScrollTrigger();
    }

    // https://github.com/ashthornton/asscroll
    setupASScroll() {
        const asscroll = new ASScroll({
            ease: 0.3, // lerp
            disableRaf: true
        });

        GSAP.ticker.add(asscroll.update);

        ScrollTrigger.defaults({
            scroller: asscroll.containerElement
        });

        ScrollTrigger.scrollerProxy(asscroll.containerElement, {
            scrollTop(value) {
                if (arguments.length) {
                    asscroll.currentPos = value;
                    return;
                }
                return asscroll.currentPos;
            },
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight
                };
            },
            fixedMarkers: true
        });

        asscroll.on('update', ScrollTrigger.update);
        ScrollTrigger.addEventListener('refresh', asscroll.resize);

        requestAnimationFrame(() => {
            asscroll.enable({
                newScrollElements: document.querySelectorAll(
                    '.GSAP-marker-start, .GSAP-marker-end, [asscroll]'
                )
            });
        });
        return asscroll;
    }

    // Use ASScroll for smooth scrolling
    setSmoothScroll() {}

    // Triggers animation
    setScrollTrigger() {
        ScrollTrigger.matchMedia({
            //===DESKTOP===
            '(min-width: 969px)': () => {
                //---LANDING PAGE---
                this.camera.orthographicCamera.position.set(-0.2, 4.5, 6.5);
                // Final room model size
                this.actualRoom.scale.set(0.8, 0.8, 0.8);

                //---FIRST SECTION---
                // Camera positions found via Firefox's res. design mode 1920x1080
                this.firstMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: '.first-scrollTrigger',
                        // note: comment start/end markers in Controls.js, then comment all markers when done
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1, // animates with scroll
                        invalidateOnRefresh: true,
                        markers: true
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
                                return -2.2; // For 16:9 aspect ratios, 1.7:1
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

                //---SECOND SECTION---
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: '.second-scrollTrigger',
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1, // animates with scroll
                        invalidateOnRefresh: true,
                        markers: true
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

                //---THIRD SECTION---
                this.thirdMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: '.third-scrollTrigger',
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1, // animates with scroll
                        invalidateOnRefresh: true,
                        markers: true
                    }
                })
                    // Relative to last ortho. camera position
                    .to(this.camera.orthographicCamera.position, {
                        x: -2.4,
                        y: 3.4
                    });
            },

            //===MOBILE===
            // Same max-width as media query in style.css
            '(max-width: 968px)': () => {
                //---LANDING PAGE---
                this.camera.orthographicCamera.position.set(-0.04, 4, 6.5);
                // Final room model size
                this.actualRoom.scale.set(0.45, 0.45, 0.45);

                //---FIRST SECTION (MOBILE)----
                this.firstMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: '.first-scrollTrigger',
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1, // animates with scroll
                        invalidateOnRefresh: true,
                        markers: true
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

                ///---SECOND SECTION (MOBILE)---
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: '.second-scrollTrigger',
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1, // animates with scroll
                        invalidateOnRefresh: true,
                        markers: true
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

                //---THIRD SECTION (MOBILE)---
                this.thirdMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: '.third-scrollTrigger',
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1, // animates with scroll
                        invalidateOnRefresh: true,
                        markers: true
                    }
                })
                    // Relative to last ortho. camera position
                    .to(this.camera.orthographicCamera.position, {
                        x: -1,
                        y: 3.3
                    });
            },

            // All screen sizes
            all: () => {
                //===PROGRESS BARS===
                this.sections = document.querySelectorAll('.section');
                this.sections.forEach((section) => {
                    this.progressWrapper =
                        section.querySelector('.progress-wrapper');
                    this.progressBar = section.querySelector('.progress-bar');

                    // Tween to animate section edges; transition from large to small border radius
                    if (section.classList.contains('right')) {
                        GSAP.to(section, {
                            borderTopLeftRadius: 10,
                            scrollTrigger: {
                                trigger: section,
                                // When top of the trigger hits the bottom of viewport
                                start: 'top bottom',
                                // When top of section hits top of viewport
                                end: 'top top',
                                scrub: 0.8,
                                markers: true
                            }
                        });
                        GSAP.to(section, {
                            borderBottomLeftRadius: 700,
                            scrollTrigger: {
                                trigger: section,
                                start: 'bottom bottom',
                                end: 'bottom top',
                                scrub: 0.8,
                                markers: true
                            }
                        });
                    } else if (section.classList.contains('left')) {
                        GSAP.to(section, {
                            borderTopRightRadius: 10,
                            scrollTrigger: {
                                trigger: section,
                                // When top of the trigger hits the bottom of viewport
                                start: 'top bottom',
                                // When top of section hits top of viewport
                                end: 'top top',
                                scrub: 0.8,
                                markers: true
                            }
                        });
                        GSAP.to(section, {
                            borderBottomRightRadius: 700,
                            scrollTrigger: {
                                trigger: section,
                                // When bottom of trigger hits bottom of viewport
                                start: 'bottom bottom',
                                // When bottom of trigger gits top of viewport
                                end: 'bottom top',
                                scrub: 0.8,
                                markers: true
                            }
                        });
                    }

                    // Animate progress bar moving along with viewport
                    GSAP.from(this.progressBar, {
                        scaleY: 0,
                        scrollTrigger: {
                            trigger: section,
                            start: 'top top',
                            end: 'bottom bottom',
                            scrub: 0.4,
                            pin: this.progressWrapper,
                            pinSpacing: false
                        }
                    });
                });

                //===CIRCLE BACKGROUND ANIMATIONS===
                //---FIRST SECTION---
                this.firstMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: '.first-scrollTrigger',
                        // note: comment start/end markers in Controls.js, then comment all markers when done
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1, // animates with scroll
                        invalidateOnRefresh: true,
                        markers: true
                    }
                }).to(this.circle1.scale, {
                    x: 3,
                    y: 3,
                    z: 3
                });

                //---SECOND SECTION---
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: '.second-scrollTrigger',
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1, // animates with scroll
                        invalidateOnRefresh: true,
                        markers: true
                    }
                }).to(this.circle2.scale, {
                    x: 3,
                    y: 3,
                    z: 3
                });

                //---THIRD SECTION---
                this.thirdMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: '.third-scrollTrigger',
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1, // animates with scroll
                        invalidateOnRefresh: true,
                        markers: true
                    }
                }).to(this.circle3.scale, {
                    x: 3,
                    y: 3,
                    z: 3
                });

                //===ANIMATE MAILBOX PLATFORM===
                this.mailboxTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: '.third-scrollTrigger',
                        start: 'center center'
                        // markers: true
                    }
                });

                // Unhide mailbox objects from roomChildren
                this.roomChildren['mailbox'].children.forEach((child) => {
                    // Animate mailbox floor extending out
                    if (child.name.includes('floor')) {
                        this.mailboxTimeline
                            .to(child.scale, {
                                x: this.roomChildrenScale[child.name][0],
                                y: this.roomChildrenScale[child.name][1],
                                z: this.roomChildrenScale[child.name][2]
                            })
                            .to(child.position, {
                                x: this.roomChildrenScale[child.name][3],
                                y: this.roomChildrenScale[child.name][4],
                                z: this.roomChildrenScale[child.name][5],
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
                // this.mailboxTimeline.add(this.one); // floor
                this.mailboxTimeline.add(this.two, '-=0.2'); // step1
                this.mailboxTimeline.add(this.three, '-=0.2'); // step2
                this.mailboxTimeline.add(this.four, '-=0.2'); // step3
                this.mailboxTimeline.add(this.five, '-=0.2'); // mailbox stand
                this.mailboxTimeline.add(this.six, '-=0.2'); // mailbox body
            }
        });
    }

    resize() {}

    update() {}
}
