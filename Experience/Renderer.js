import * as THREE from 'three';
import Experience from './Experience';

export default class Renderer {
    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera;

        this.setRenderer();
    }

    // Renders scene
    setRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            // Default sortObjects true
            canvas: this.canvas,
            antialias: true
        });

        this.renderer.useLegacyLights = true;

        // Convert input color values from linear to sRGB color space
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;

        // Approx. HDR view on a low dynamic range screen (eg. PC, mobile)
        this.renderer.toneMapping = THREE.CineonToneMapping;
        this.renderer.toneMappingExposure = 1.75;

        // Render shadows
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Resizes the output canvas and pixels
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(this.sizes.pixelRatio);
    }

    resize() {
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(this.sizes.pixelRatio);
    }

    update() {
        this.renderer.render(this.scene, this.camera.orthographicCamera);
    }
}
