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
            canvas: this.canvas,
            antialias: true
        });

        // note: originally this.renderer.physicallyCorrectLights = true;
        this.renderer.useLegacyLights = true;

        // Convert input color values from linear to sRGB color space
        // note: originally this.renderer.outputEncoding = THREE.sRGBEncoding;
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
        // note: main screen
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(this.sizes.pixelRatio);
    }

    update() {
        // this.renderer.setViewport(0, 0, this.sizes.width, this.sizes.height);
        this.renderer.render(this.scene, this.camera.orthographicCamera);
        // note: second screen
        // this.renderer.setScissorTest(true);
        // this.renderer.setViewport(
        //     this.sizes.width - this.sizes.width / 3,
        //     this.sizes.height - this.sizes.height / 3,
        //     this.sizes.width / 3,
        //     this.sizes.height / 3
        // );
        // this.renderer.setScissor(
        //     this.sizes.width - this.sizes.width / 3,
        //     this.sizes.height - this.sizes.height / 3,
        //     this.sizes.width / 3,
        //     this.sizes.height / 3
        // );

        // this.renderer.render(this.scene, this.camera.perspectiveCamera);

        // this.renderer.setScissorTest(false);
    }
}
