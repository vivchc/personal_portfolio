// Loading screen
import { EventEmitter } from 'events';
import Experience from './Experience';

export default class Preloader extends EventEmitter {
    constructor() {
        super();
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.sizes = this.experience.sizes;
        this.camera = this.experience.camera;
        this.world = this.experience.world;

        this.world.on('world loaded', () => {
            this.playIntro();
        });
    }

    playIntro() {}
}
