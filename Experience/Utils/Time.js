import { EventEmitter } from 'events';

export default class Time extends EventEmitter {
    constructor() {
        super();
        this.start = Date.now();
        // Time when Experience starts
        this.current = this.start;
        // Time since Experience started
        this.elapsed = 0;
        /* 
        Time between each frame (seconds). 
        16 is ~approx. ms at each frame at 60 fps 
        */
        this.delta = 16;

        this.update();
    }

    update() {
        // Start counting time 1 frame after this.start
        const currentTime = Date.now();
        // Duration of 1 frame
        this.delta = currentTime - this.current;
        // Update this.current
        this.current = currentTime;
        // note: can use this to delay animation, 2:14:02
        this.elapsed = this.current - this.start;

        this.emit('update');
        // Browser calls function arg to update animation right before next repaint
        window.requestAnimationFrame(() => this.update()); // or this.update.bind(this)
    }
}
