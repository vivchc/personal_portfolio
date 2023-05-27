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
    }

    // Initial animation for preloader
    firstIntro() {
        return new Promise((resolve) => {
            this.firstTimeline = new GSAP.timeline();

            //===ANIMATE PRELOADER CUP===
            // Different preloader animations for desktop/mobile
            this.roomChildren.cup_for_intro.position.set(
                -0.0026,
                -0.27,
                0.120295
            );
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
                this.roomChildren.cup_for_intro.position.set(
                    -0.0026,
                    -0.27,
                    0.120295
                );
                this.camera.orthographicCamera.rotation.set(-Math.PI / 7, 0, 0);
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
            //===REPLACE PRELOADER WITH ROOM MODEL===
            // Same preloader animations for desktop/mobile
            this.secondTimeline = new GSAP.timeline();

            //---Spin, scale, center preloader cup---
            this.secondTimeline
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
                        y: 4 * Math.PI
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
                    '<50%'
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
                '<15%'
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
                    '<15%'
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
                        duration: 0.3
                    },
                    '<15%'
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
                    '<15%'
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
                    '<15%'
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
                '<15%'
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
                    '<15%'
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
                    '<15%'
                );
            }

            //---Unhide group chair---
            shorten = this.roomChildren.chair.children; // shorten declaration
            // Unhide chair legs
            this.secondTimeline
                .to(
                    shorten[0].scale,
                    {
                        x: this.roomChildrenScale[shorten[0].name][0],
                        y: this.roomChildrenScale[shorten[0].name][1],
                        z: this.roomChildrenScale[shorten[0].name][2],
                        ease: 'back.out(2.2)',
                        duration: 0.3
                    },
                    '<15%'
                )
                // Unhide chair seat and spin
                .to(
                    shorten[1].scale,
                    {
                        x: this.roomChildrenScale[shorten[1].name][0],
                        y: this.roomChildrenScale[shorten[1].name][1],
                        z: this.roomChildrenScale[shorten[1].name][2],
                        ease: 'power2.out',
                        duration: 0.3
                    },
                    'chair_seat'
                )
                .to(
                    shorten[1].rotation,
                    {
                        z: 4 * Math.PI,
                        onComplete: resolve // signals end of animation
                    },
                    '<15%'
                );
        });
    }

    // Detects direction of scroll then plays animation
    onScroll(e) {
        // If user scrolls down
        if (e.deltaY > 0) {
            this.removeEventListeners();
            this.playSecondIntro();
        }
    }

    // Get user's current touch
    onTouch(e) {
        this.initialY = e.touches[0].clientY;
    }

    // Move screen if user swipes up
    onTouchMove(e) {
        let currentY = e.touches[0].clientY;
        let diff = this.initialY - currentY;
        // If user swipes up, play second intro
        if (diff > 0) {
            this.removeEventListeners();
            this.playSecondIntro();
        }
        // Resets user's touch
        this.initialY = null;
    }

    removeEventListeners() {
        window.removeEventListener('wheel', this.scrollOnce);
        window.removeEventListener('touchstart', this.touchStart);
        window.removeEventListener('touchmove', this.touchMove);
    }

    async playIntro() {
        // Wait until firstIntro is done before proceeding
        await this.firstIntro();
        this.moveFlag = true;
        this.scrollOnce = this.onScroll.bind(this); // allows instance of onScroll func to be removed
        this.touchStart = this.onTouch.bind(this);
        this.touchMove = this.onTouchMove.bind(this);
        window.addEventListener('wheel', this.scrollOnce);
        window.addEventListener('touchstart', this.touchStart);
        window.addEventListener('touchmove', this.touchMove);
    }

    async playSecondIntro() {
        this.moveFlag = false;
        // Wait until secondIntro is done before proceeding
        await this.secondIntro();
        this.emit('enablecontrols');
    }

    move() {
        if (this.device === 'desktop') {
            this.room.position.set(-2.5, 0, 0);
        } else {
            this.room.position.set(0, 0, -1.5); // for mobile
        }
    }

    update() {
        if (this.moveFlag) {
            this.move();
        }
    }
}
