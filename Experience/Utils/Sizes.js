import { EventEmitter } from 'events';

export default class Sizes extends EventEmitter {
    constructor() {
        super();
        // Used window width/height because same as canvas size
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.aspect = this.width / this.height;
        /*
        devicePixelRatio tells browser how many of the screen's 
        actual pixels to use to draw a single CSS pixel 
        */
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);

        // frustrum = what is inside camera's field of vision
        this.frustrum = 5;
        this.device = this.width < 968 ? 'mobile' : 'desktop';

        // Update width/height if window resizes
        window.addEventListener('resize', () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.aspect = this.width / this.height;
            this.pixelRatio = Math.min(window.devicePixelRatio, 2);
            this.emit('resize');

            // Track if device changed mobile <-> desktop
            if (this.width < 968 && this.device !== 'mobile') {
                this.device = 'mobile';
                this.emit('switchdevice', this.device);
            } else if (this.width >= 968 && this.device !== 'desktop') {
                this.device = 'desktop';
                this.emit('switchdevice', this.device);
            }
        });
    }
}
