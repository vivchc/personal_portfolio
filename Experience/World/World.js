import * as THREE from 'three';
import { EventEmitter } from 'events';

import Experience from '../Experience';
import Environment from './Environment';

import Room from './Room';
import Controls from '../Controls';
import Floor from './Floor';

export default class World extends EventEmitter {
    constructor() {
        super();
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera;
        this.resources = this.experience.resources;

        // Creates our room model when resources all loaded
        this.resources.on('ready', () => {
            this.environment = new Environment();
            // Floor must come before Room; Controls init. circles from Floor
            this.floor = new Floor();
            this.room = new Room();
            // this.controls = new Controls();
            this.emit('world loaded');
        });
    }

    resize() {}
    update() {
        // Once room is loaded, update room
        if (this.room) {
            this.room.update();
        }
        if (this.controls) {
            this.controls.update();
        }
    }
}
