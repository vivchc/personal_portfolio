// Loading screen
import { EventEmitter } from 'events';
import Experience from './Experience';
import GSAP from 'gsap';

export default class Preloader extends EventEmitter {
    constructor() {
        super();
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.sizes = this.experience.sizes;
        this.camera = this.experience.camera;
        this.world = this.experience.world;

        this.device = this.sizes.device;
        this.sizes.on('switchdevice', (device) => {
            this.device = device;
        });

        this.world.on('world loaded', () => {
            this.setAssets();
            this.playIntro();
        });
    }

    setAssets() {
        this.room = this.experience.world.room.actualRoom;
        this.roomChildren = this.experience.world.room.roomChildren;
        console.log(this.roomChildren);
    }

    // Initial animation for preloader
    firstIntro() {
        return new Promise((resolve) => {
            this.firstTimeline = new GSAP.timeline();

            // Different preloader animations for desktop/mobile
            if (this.device === 'desktop') {
                this.firstTimeline
                    .to(this.roomChildren.cup_for_intro.scale, {
                        x: 5,
                        z: 5,
                        y: 5,
                        ease: 'back.out(2.5)',
                        duration: 0.7
                    })
                    // Move preloader cup to the left
                    .to(this.room.position, {
                        x: -2.5,
                        ease: 'power1.out',
                        duration: 0.7,
                        onComplete: resolve // signals end of animation
                    });
            } else {
                // Device is mobile
                this.roomChildren.cup_for_intro.position.set(0, -0.55, 0);
                this.firstTimeline
                    .to(this.roomChildren.cup_for_intro.scale, {
                        x: 7,
                        z: 7,
                        y: 7,
                        ease: 'back.out(2.5)',
                        duration: 0.7
                    })
                    // Move preloader cup up
                    .to(this.room.position, {
                        z: -2.5,
                        ease: 'power1.out',
                        duration: 0.7,
                        onComplete: resolve // signals end of animation
                    });
            }
        });
    }

    // Move preloader back to center (will then be replaced by room model)
    secondIntro() {
        return new Promise((resolve) => {
            this.secondTimeline = new GSAP.timeline();

            // Different preloader animations for desktop/mobile
            if (this.device === 'desktop') {
                this.secondTimeline
                    //===REPLACE PRELOADER WITH ROOM MODEL===

                    //---Spin, scale, and center preloader cup---
                    // Reset orthographic camera rotation
                    .to(
                        this.camera.orthographicCamera.rotation,
                        {
                            x: -Math.PI / 7
                        },
                        'spin_cup_room'
                    )
                    // Center preloader cup
                    .to(
                        this.roomChildren.cup_for_intro.position,
                        {
                            x: 3,
                            y: 0,
                            z: 0,
                            ease: 'power1.out'
                        },
                        'spin_cup_room'
                    )
                    // Spin preloader cup while centering
                    .to(
                        this.roomChildren.cup_for_intro.rotation,
                        {
                            z: Math.PI,
                            ease: 'Cubic.InOut'
                        },
                        'spin_cup_room'
                    )
                    // Center room model (appears from preloader cup later)
                    .to(
                        this.roomChildren.room_window.position,
                        {
                            x: 3 + 0.0026
                        },
                        'spin_cup_room'
                    )

                    // Scale preloader cup to room size
                    .to(this.roomChildren.cup_for_intro.scale, {
                        x: 44,
                        y: 44,
                        z: 27
                    })

                    //---Preloader cup disappears while room appears---
                    // Unhide room model walls & floor
                    .to(
                        this.roomChildren.room_window.scale,
                        {
                            x: 1,
                            y: 1,
                            z: 1,
                            duration: 0.7
                        },
                        'scale_together'
                    )
                    // Spin room model walls & floor while appearing
                    .to(
                        this.roomChildren.room_window.rotation,
                        {
                            y: 4 * Math.PI // note: do we have to change rotation; not centered?
                        },
                        'scale_together'
                    )
                    // Hide preloader cup
                    .to(
                        this.roomChildren.cup_for_intro.scale,
                        {
                            x: 0,
                            y: 0,
                            z: 0,
                            duration: 1
                        },
                        'scale_together'
                    )
                    // Spin preloader cup while disappearing
                    .to(
                        this.roomChildren.cup_for_intro.rotation,
                        {
                            z: 3 * Math.PI,
                            ease: 'quartic.out'
                        },
                        'scale_together'
                    );

                //===UNHIDE ROOM OBJECTS===
                
            } else {
                // Device is mobile
                this.roomChildren.cup_for_intro.position.set(0, -0.55, 0);
                this.secondTimeline
                    // Move preloader cup up
                    .to(this.room.position, {
                        x: 0,
                        z: 0,
                        y: 0,
                        ease: 'back.out(2.5)',
                        duration: 0.7
                    });
            }
        });
    }

    // Detects direction of scroll then plays animation
    onScroll(e) {
        // If user scrolls down
        if (e.deltaY > 0) {
            window.removeEventListener('wheel', this.scrollOnce);
            this.playSecondIntro();
        }
    }

    async playIntro() {
        // Wait until firstIntro is done before proceeding
        await this.firstIntro();
        this.scrollOnce = this.onScroll.bind(this); // allows instance of onScroll func to be removed
        window.addEventListener('wheel', this.scrollOnce);
    }

    async playSecondIntro() {
        // Wait until secondIntro is done before proceeding
        await this.secondIntro();
    }
}
