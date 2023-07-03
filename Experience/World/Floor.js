import * as THREE from 'three';
import Experience from '../Experience';

export default class Floor {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.setFloor();
        this.setCircles();
    }

    setFloor() {
        // Create plane (this is the background during preloader)
        this.geometry = new THREE.PlaneGeometry(100, 100);
        this.material = new THREE.MeshStandardMaterial({
            color: '#e8e8e8', // note: color of overall background for site
            side: THREE.DoubleSide // show material on both sides of plane
        });
        this.plane = new THREE.Mesh(this.geometry, this.material);
        // Rotate plane so it's parallel with room model
        this.plane.rotation.x = Math.PI / 2;
        this.plane.position.y = -0.3; // needed for circle animation to show
        this.plane.receiveShadow = true;
        this.scene.add(this.plane);
    }

    // Animates expanding circle from model in the background
    setCircles() {
        const geometry = new THREE.CircleGeometry(5, 64);
        // Create a circle for each section
        const material1 = new THREE.MeshStandardMaterial({ color: '#85E0CF' });
        this.circle1 = new THREE.Mesh(geometry, material1);

        const material2 = new THREE.MeshStandardMaterial({ color: '#d88c91' });
        this.circle2 = new THREE.Mesh(geometry, material2);

        const material3 = new THREE.MeshStandardMaterial({ color: '#93B5ED' });
        this.circle3 = new THREE.Mesh(geometry, material3);

        // Make circles not overlap each other
        this.circle1.position.y = -0.29;
        this.circle2.position.y = -0.28;
        this.circle3.position.y = -0.27;

        // Initialize starting size
        this.circle1.scale.set(0, 0, 0);
        this.circle2.scale.set(0, 0, 0);
        this.circle3.scale.set(0, 0, 0);

        // Rotate circle 180 deg so material shows (material only on one side)
        this.circle1.rotation.x =
            this.circle2.rotation.x =
            this.circle3.rotation.x =
                -Math.PI / 2;

        // Add shadows from model to circles
        this.circle1.receiveShadow =
            this.circle2.receiveShadow =
            this.circle3.receiveShadow =
                true;

        this.scene.add(this.circle1);
        this.scene.add(this.circle2);
        this.scene.add(this.circle3);
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
