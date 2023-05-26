// This is the singleton class
import * as THREE from 'three';

// From Utils folder
import Sizes from './Utils/Sizes';
import Time from './Utils/Time';
import Resources from './Utils/Resources';
import assets from './Utils/assets';

// From World folder
import World from './World/World';

import Camera from './Camera';
import Renderer from './Renderer';
import Preloader from './Preloader';
import Controls from './Controls';

export default class Experience {
    static instance;
    constructor(canvas) {
        if (Experience.instance) {
            return Experience.instance;
        }
        Experience.instance = this;
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.time = new Time();
        this.sizes = new Sizes();
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.resources = new Resources(assets);
        this.world = new World(); // order matters; only call after everything loads for World
        this.preloader = new Preloader();

        this.preloader.on('enablecontrols', () => {
            this.controls = new Controls();
        });

        // Updates other classes' update functions when SIZE updates
        this.sizes.on('resize', () => {
            this.resize();
        });
        // Updates other classes' update functions when TIME updates
        this.time.on('update', () => {
            this.update();
        });
    }

    // Resize functions from other classes
    resize() {
        this.camera.resize();
        this.world.resize();
        this.renderer.resize();
    }

    // Update functions from other classes
    update() {
        this.camera.update();
        this.world.update();
        this.renderer.update();
    }
}
