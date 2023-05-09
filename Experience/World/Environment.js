// Add lighting to scene
import * as THREE from 'three';
import Experience from '../Experience';

export default class Environment {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.setSunlight();
    }

    // Add light and shadow to scene
    setSunlight() {
        this.sunLight = new THREE.DirectionalLight('#ffffff', 1); // affects contrast
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.far = 20;
        this.sunLight.shadow.mapSize.set(2048, 2048); // sets shadow sharpness
        this.sunLight.shadow.normalBias = 0.05;
        this.sunLight.position.set(-0.5, 1.4, 0.9);

        // Set directional light to point to a specific point
        this.sunLightPoint = new THREE.Object3D();
        this.sunLightPoint.position.set(-1, 0, 0);
        this.scene.add(this.sunLightPoint);

        this.sunLight.target = this.sunLightPoint;
        this.scene.add(this.sunLight);

        // note: Help visualize directional light
        // const helper = new THREE.CameraHelper(this.sunLight.shadow.camera);
        // this.scene.add(helper);

        // Soften shadows
        this.ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
        this.scene.add(this.ambientLight);
    }

    resize() {}
    update() {}
}
