// Load all resources and store it

import * as THREE from 'three';

import { EventEmitter } from 'events';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import Experience from '../Experience';

export default class Resources extends EventEmitter {
    constructor(assets) {
        super();
        this.experience = new Experience();
        this.renderer = this.experience.renderer;

        this.assets = assets;

        // Hold our loaded items, for access by other classes
        this.items = {};
        // Number of items in queue to be loaded
        this.queue = this.assets.length;
        // Number of loaded items
        this.loaded = 0;

        this.setLoaders();
        this.startLoading();
    }

    // Loads our room model
    setLoaders() {
        this.loaders = {};
        // Load GLTF models
        this.loaders.gltfLoader = new GLTFLoader();
        /* 
        Sets up DRACOLoader. Loads geometry compressed with Draco library. 
        Needed because we exported our gltf model with compression.
        */
        this.loaders.dracoLoader = new DRACOLoader();
        this.loaders.dracoLoader.setDecoderPath('/draco/');
        this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);
    }

    // Assigns an appropriate loader/method for each asset
    startLoading() {
        for (const asset of this.assets) {
            if (asset.type === 'glbModel') {
                this.loaders.gltfLoader.load(asset.path, (file) => {
                    this.singleAssetLoaded(asset, file);
                });
            } else if (asset.type === 'videoTexture') {
                this.video = {};
                this.videoTexture = {};

                // Video settings
                this.video[asset.name] = document.createElement('video');
                this.video[asset.name].src = asset.path;
                this.video[asset.name].playsInline = true;
                this.video[asset.name].autoplay = true;
                this.video[asset.name].loop = true;
                this.video[asset.name].play();

                // Video texture settings
                this.videoTexture[asset.name] = new THREE.VideoTexture(
                    this.video[asset.name]
                );
                this.videoTexture[asset.name].flipY = true; // note: might be false, see situation
                this.videoTexture[asset.name].minFilter = THREE.NearestFilter;
                this.videoTexture[asset.name].magFilter = THREE.NearestFilter;
                this.videoTexture[asset.name].generateMipmaps = false;
                this.videoTexture[asset.name].colorSpace = THREE.SRGBColorSpace;

                this.singleAssetLoaded(asset, this.videoTexture[asset.name]);
            }
        }
    }

    // Create key-value pairs for dict items
    singleAssetLoaded(asset, file) {
        this.items[asset.name] = file;
        this.loaded++;

        // Create world when all assets are loaded
        if (this.loaded == this.queue) {
            this.emit('ready');
        }
    }
}
