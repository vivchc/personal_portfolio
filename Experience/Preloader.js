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
        this.roomChildrenScale = this.experience.world.room.roomChildrenScale;

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
                    // Move preloader cup AND room to the left
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
                    // Center preloader cup AND room
                    .to(
                        this.room.position,
                        {
                            x: 0,
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

                    //---Enlarge preloader cup---
                    //Scale preloader cup to room size
                    .to(
                        this.roomChildren.cup_for_intro.scale,
                        {
                            x: 44,
                            y: 44,
                            z: 27
                        },
                        'scale_cup_bigger'
                    )
                    // Move cup up on screen
                    .to(
                        this.roomChildren.cup_for_intro.position,
                        {
                            y: 1
                        },
                        'scale_cup_bigger'
                    )

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
                        'scale_cup_room_together'
                    )
                    // Spin room model walls & floor while appearing
                    .to(
                        this.room.rotation,
                        {
                            y: 4 * Math.PI // note: do we have to change rotation; not centered?
                        },
                        'scale_cup_room_together'
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
                        'scale_cup_room_together'
                    )
                    // Spin preloader cup while disappearing
                    .to(
                        this.roomChildren.cup_for_intro.rotation,
                        {
                            z: 3 * Math.PI,
                            ease: 'quartic.out'
                        },
                        'scale_cup_room_together'
                    )
                    // Move preloader cup up on the screen
                    .to(
                        this.roomChildren.cup_for_intro.position,
                        {
                            y: 0.2,
                            ease: 'circular.out',
                            duration: 0.3
                        },
                        'scale_cup_room_together'
                    );

                //===UNHIDE ROOM OBJECTS===
                let shorten; // shorten declaration

                // Unhide group desk
                shorten = this.roomChildren.desk.children;
                for (const ind in shorten) {
                    this.secondTimeline.to(shorten[ind].scale, {
                        x: this.roomChildrenScale[shorten[ind].name][0],
                        y: this.roomChildrenScale[shorten[ind].name][1],
                        z: this.roomChildrenScale[shorten[ind].name][2],
                        ease: 'back.out(2.2)',
                        duration: 0.15
                    });
                }

                // Unhide group desk_stuff
                shorten = this.roomChildren.desk_stuff.children; // shorten declaration
                for (const ind in shorten) {
                    this.secondTimeline.to(shorten[ind].scale, {
                        x: this.roomChildrenScale[shorten[ind].name][0],
                        y: this.roomChildrenScale[shorten[ind].name][1],
                        z: this.roomChildrenScale[shorten[ind].name][2],
                        ease: 'back.out(2.2)',
                        duration: 0.2
                    });
                }

                // Unhide group bag_pets + fish + memoboard
                shorten = this.roomChildren.bag_pets.children; // shorten declaration
                for (const ind in shorten) {
                    this.secondTimeline.to(
                        shorten[ind].scale,
                        {
                            x: this.roomChildrenScale[shorten[ind].name][0],
                            y: this.roomChildrenScale[shorten[ind].name][1],
                            z: this.roomChildrenScale[shorten[ind].name][2],
                            ease: 'back.out(2.2)',
                            duration: 0.3
                        },
                        '<75%'
                    );
                }
                shorten = this.roomChildren.fish; // shorten declaration
                this.secondTimeline.to(
                    shorten.scale,
                    {
                        x: this.roomChildrenScale[shorten.name][0],
                        y: this.roomChildrenScale[shorten.name][1],
                        z: this.roomChildrenScale[shorten.name][2],
                        ease: 'back.out(2.2)',
                        duration: 0.3
                    },
                    '<25%'
                );
                shorten = this.roomChildren.memoboard.children; // shorten declaration
                for (const ind in shorten) {
                    this.secondTimeline.to(
                        shorten[ind].scale,
                        {
                            x: this.roomChildrenScale[shorten[ind].name][0],
                            y: this.roomChildrenScale[shorten[ind].name][1],
                            z: this.roomChildrenScale[shorten[ind].name][2],
                            ease: 'back.out(2.2)',
                            duration: 0.3
                        },
                        '<25%'
                    );
                }

                // Unhide group chair
                shorten = this.roomChildren.chair.children; // shorten declaration
                for (const ind in shorten) {
                    this.secondTimeline.to(
                        shorten[ind].scale,
                        {
                            x: this.roomChildrenScale[shorten[ind].name][0],
                            y: this.roomChildrenScale[shorten[ind].name][1],
                            z: this.roomChildrenScale[shorten[ind].name][2],
                            ease: 'back.out(2.2)',
                            duration: 0.3
                        },
                        '<25%'
                    );
                }

                // Unhide group drawer
                shorten = this.roomChildren.drawer.children; // shorten declaration
                for (const ind in shorten) {
                    this.secondTimeline.to(
                        shorten[ind].scale,
                        {
                            x: this.roomChildrenScale[shorten[ind].name][0],
                            y: this.roomChildrenScale[shorten[ind].name][1],
                            z: this.roomChildrenScale[shorten[ind].name][2],
                            ease: 'back.out(2.2)',
                            duration: 0.3
                        },
                        '<75%'
                    );
                }

                // Unhide group exercise_whiteboard
                shorten = this.roomChildren.exercise_whiteboard.children; // shorten declaration
                for (const ind in shorten) {
                    this.secondTimeline.to(
                        shorten[ind].scale,
                        {
                            x: this.roomChildrenScale[shorten[ind].name][0],
                            y: this.roomChildrenScale[shorten[ind].name][1],
                            z: this.roomChildrenScale[shorten[ind].name][2],
                            ease: 'back.out(2.2)',
                            duration: 0.3
                        },
                        '<25%'
                    );
                }

                // Unhide group floor_stuff + painting
                shorten = this.roomChildren.floor_stuff.children; // shorten declaration
                for (const ind in shorten) {
                    this.secondTimeline.to(
                        shorten[ind].scale,
                        {
                            x: this.roomChildrenScale[shorten[ind].name][0],
                            y: this.roomChildrenScale[shorten[ind].name][1],
                            z: this.roomChildrenScale[shorten[ind].name][2],
                            ease: 'back.out(2.2)',
                            duration: 0.3
                        },
                        '<25%'
                    );
                }
                shorten = this.roomChildren.painting; // shorten declaration
                this.secondTimeline.to(
                    shorten.scale,
                    {
                        x: this.roomChildrenScale[shorten.name][0],
                        y: this.roomChildrenScale[shorten.name][1],
                        z: this.roomChildrenScale[shorten.name][2],
                        ease: 'back.out(2.2)',
                        duration: 0.3
                    },
                    '<25%'
                );

                // Unhide group lamp
                shorten = this.roomChildren.lamp.children; // shorten declaration
                for (const ind in shorten) {
                    this.secondTimeline.to(
                        shorten[ind].scale,
                        {
                            x: this.roomChildrenScale[shorten[ind].name][0],
                            y: this.roomChildrenScale[shorten[ind].name][1],
                            z: this.roomChildrenScale[shorten[ind].name][2],
                            ease: 'back.out(2.2)',
                            duration: 0.3
                        },
                        '<25%'
                    );
                }

                // Unhide group wall_shelf
                shorten = this.roomChildren.wall_shelf.children; // shorten declaration
                for (const ind in shorten) {
                    this.secondTimeline.to(
                        shorten[ind].scale,
                        {
                            x: this.roomChildrenScale[shorten[ind].name][0],
                            y: this.roomChildrenScale[shorten[ind].name][1],
                            z: this.roomChildrenScale[shorten[ind].name][2],
                            ease: 'back.out(2.2)',
                            duration: 0.3
                        },
                        '<25%'
                    );
                }
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
