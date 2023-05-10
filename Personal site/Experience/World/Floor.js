import * as THREE from 'three';
import Experience from '../Experience';

export default class Floor {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.setFloor();
    }

    setFloor() {
        // Create plane
        this.geometry = new THREE.PlaneGeometry(100, 100);
        this.material = new THREE.MeshStandardMaterial({
            color: '#cceaed',
            side: THREE.DoubleSide // show material on both sides of plane
        });
        this.plane = new THREE.Mesh(this.geometry, this.material);
        // Rotate plane so it's parallel with room model
        this.plane.rotation.x = Math.PI / 2;
        this.plane.receiveShadow = true;
        this.scene.add(this.plane);
    }

    resize() {}

    update() {
        this.lerp.current = GSAP.utils.interpolate(
            this.lerp.current,
            this.lerp.target,
            this.lerp.ease
        );
        // Rotate room based on cursor location
        this.actualRoom.rotation.y = this.lerp.current;
        // Set animation speed (larger value = faster)
        this.mixer.update(this.time.delta * 0.0008);
    }
}
