"use strict";

!function(global) {

    var demo = global.SpotLight = function() {
        this.options = null;
        this.parentDom = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.mesh = null;
        this.controls = null;
    };

    demo.prototype.init = function(parentDom, options, callback) {

        var width = Math.floor(parentDom.clientWidth);
        var height = Math.floor(parentDom.clientHeight);

        this.parentDom = parentDom;
        this.options = options || {};

        //scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#000000');

        //camera
        this.camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
        this.camera.position.z = 10;
        this.camera.position.y = 5;

        //renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( width, height );
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;
        this.parentDom.appendChild(this.renderer.domElement);

        //mesh
        var cubeGeo = new THREE.SphereBufferGeometry(2, 30, 30);
        var cubeMat = new THREE.MeshPhongMaterial({
            color: 0xaa0000,
            dithering: true
        });

        var planeGeo = new THREE.PlaneBufferGeometry(300, 300);
        var planeMat = new THREE.MeshPhongMaterial({
            color: 0x000033,
            dithering: true
        });
        var plane = new THREE.Mesh(planeGeo, planeMat);
        plane.receiveShadow = true;
        plane.position.y = -10;
        plane.rotation.x = -Math.PI / 2;
        this.scene.add(plane);

        this.mesh = new THREE.Mesh(cubeGeo, cubeMat);
        this.mesh.castShadow = true;
        this.scene.add(this.mesh);
        this.camera.lookAt(this.mesh.position);

        //light
        var ambientLight = new THREE.AmbientLight('#ffffff', 0.1);
        ambientLight.position.set(-30, 30, 0);
        this.scene.add(ambientLight);

        var spotLight = new THREE.SpotLight('#ffffff', 1);
        spotLight.position.set( 15, 15, 0 );
        spotLight.angle = Math.PI / 6;
        spotLight.castShadow = true;
        spotLight.target = this.mesh;
        spotLight.penumbra = 0.05;
        spotLight.decay = 1;
        spotLight.distance = 100;

        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;
        spotLight.shadow.camera.near = 1;
        spotLight.shadow.camera.far = 100;
        this.scene.add(spotLight);
        this.spotLightHelper = new THREE.SpotLightHelper(spotLight);
        // this.scene.add(this.spotLightHelper);

        //controls
        this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
        this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        this.controls.dampingFactor = 1;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 50;
        this.controls.maxPolarAngle = Math.PI * 2;

        //events
        var self = this;
        window.addEventListener( 'resize', function() {

            var width = Math.floor(parentDom.clientWidth);
            var height = Math.floor(parentDom.clientHeight);

            self.camera.aspect = width / height;
            self.camera.updateProjectionMatrix();
            self.renderer.setSize( width, height );

        }, false );

        callback && callback();
    };

    demo.prototype.render = function(callback) {
        var self = this;

        var animate = function () {
            if (self.mesh) {
                requestAnimationFrame( animate );

                self.spotLightHelper.update();
                self.controls.update();
                self.renderer.render(self.scene, self.camera);
            }
        };

        animate();

        callback && callback();
    };

    demo.prototype.dispose = function(callback) {

        this.parentDom.removeChild(this.renderer.domElement);

        this.options = null;
        this.parentDom = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.mesh = null;
        this.controls = null;

        callback && callback();
    };

}(window.DEMOS);