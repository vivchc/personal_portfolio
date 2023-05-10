import * as THREE from 'three';
import Experience from './Experience';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class Camera {
    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;

        this.createPerspectiveCamera();
        this.createOrthographicCamera();
        this.setOrbitControls();
    }

    createPerspectiveCamera() {
        this.perspectiveCamera = new THREE.PerspectiveCamera(
            35,
            this.sizes.aspect,
            0.1,
            1000
        );

        this.perspectiveCamera.position.x = 30;
        this.perspectiveCamera.position.y = 14;
        this.perspectiveCamera.position.z = 12;

        this.scene.add(this.perspectiveCamera);
    }

    createOrthographicCamera() {
        this.orthographicCamera = new THREE.OrthographicCamera(
            (-this.sizes.aspect * this.sizes.frustrum) / 2,
            (this.sizes.aspect * this.sizes.frustrum) / 2,
            this.sizes.frustrum / 2,
            -this.sizes.frustrum / 2,
            -40,
            40
        );

        this.orthographicCamera.position.y = 4.6;
        this.orthographicCamera.position.z = 6.5;
        this.orthographicCamera.rotation.x = -Math.PI / 7;

        this.scene.add(this.orthographicCamera);

        // this.helper = new THREE.CameraHelper(this.orthographicCamera);
        // this.scene.add(this.helper);

        // Creates axes in viewport
        const size = 20;
        const divisions = 20;

        // note: gridHelper
        // const gridHelper = new THREE.GridHelper(size, divisions);
        // this.scene.add(gridHelper);

        // note: axesHelper
        // const axesHelper = new THREE.AxesHelper(10);
        // this.scene.add(axesHelper);
    }

    // Enables orbit in web browser
    setOrbitControls() {
        this.controls = new OrbitControls(this.perspectiveCamera, this.canvas);
        this.controls.enableDamping = true;
        this.controls.enableZoom = false; // note: set to false later
    }

    // Updating persepctive & orthographic camera on resize
    resize() {
        // Perspective camera
        this.perspectiveCamera.aspect = this.sizes.aspect;
        this.perspectiveCamera.updateProjectionMatrix();

        // Orthographic camera
        this.orthographicCamera.left =
            (-this.sizes.aspect * this.sizes.frustrum) / 2;
        this.orthographicCamera.right =
            (this.sizes.aspect * this.sizes.frustrum) / 2;
        this.orthographicCamera.top = this.sizes.frustrum / 2;
        this.orthographicCamera.bottom = -this.sizes.frustrum / 2;
        this.orthographicCamera.near = this.sizes.frustrum / 2;
        this.othographicCamera.far = this.sizes.frustrum / 2;
        this.orthographicCamera.updateProjectionMatrix();
    }

    update() {
        this.controls.update();

        // note: setting gridHelper
        // this.helper.matrixWorldNeedsUpdate = true;
        // this.helper.update();
        // this.helper.position.copy(this.orthographicCamera.position);
        // this.helper.rotation.copy(this.orthographicCamera.rotation);
    }
}
