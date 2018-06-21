"use strict";

!function(global) {

    var options = {
        particleCount: 10000,
        range: 100
    };

    Physijs.scripts.worker = '/ThreejsPlayground/lib/physics/physijs_worker.js';
    Physijs.scripts.ammo = '/ThreejsPlayground/lib/physics/ammo.js';

    function updateMeshByOptions(scene) {
        var obj = scene.getObjectByName("mesh");
        if (!obj) {
            obj = new THREE.Group();
        }

        //plane
        var planeGeo = new THREE.PlaneGeometry(100, 100);
        var planeMat = Physijs.createMaterial(new THREE.MeshLambertMaterial({
            color: 0x003388,
            side: THREE.DoubleSide
        }), 0.5, 1);
        var plane = new Physijs.PlaneMesh(planeGeo, planeMat);
        plane.rotation.x = -Math.PI / 2;
        scene.add(plane);

        //dominos
        var interval = 4;
        var startX = -18;
        var boxGeo = new THREE.BoxGeometry(0.5, 5, 3);
        var boxMat = Physijs.createMaterial(new THREE.MeshPhongMaterial({
            color: 0x888888
        }), 0.2,1);
        for (var i = 0; i < 10; i++) {
            var box = new Physijs.BoxMesh(boxGeo, boxMat);
            box.position.set(startX + interval * i, 2.5, 0);
            scene.add(box);
        }

        //ball
        var ballGeo = new THREE.SphereGeometry(2, 30, 30);
        var ballMat = Physijs.createMaterial(new THREE.MeshPhongMaterial({
            color: 0x888800
        }), 0.1, 1);
        var ball = new Physijs.SphereMesh(ballGeo, ballMat);
        ball.position.set(startX - 1, 10, 0);
        scene.add(ball);

        obj.name = 'mesh';
        obj.scale.set(1.5, 1.5, 1.5);

        return obj;
    }

    var demo = global.Physics = function() {
        this.parentDom = null;
        this.stats = null;
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

        //stats
        this.stats = new Stats();
        this.stats.dom.style.position = "absolute";
        this.parentDom.appendChild(this.stats.dom);

        //scene
        this.scene = new Physijs.Scene();
        this.scene.background = new THREE.Color('#000000');

        //camera
        this.camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
        this.camera.position.z = 25;
        this.camera.position.y = 20;
        this.scene.add(this.camera);

        //renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize( width, height );
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.parentDom.appendChild(this.renderer.domElement);

        //mesh
        this.mesh = updateMeshByOptions(this.scene);

        //light
        var ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
        ambientLight.position.set(-30, 30, 0);
        this.scene.add(ambientLight);

        var light = new THREE.DirectionalLight('#ffffff', 1.5);
        light.position.set( 15, 15, 0 );
        light.name = 'light';
        this.scene.add(light);

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

                self.stats.begin();
                self.controls.update();
                self.scene.simulate();
                self.renderer.render(self.scene, self.camera);
                self.stats.end();
            }
        };

        animate();

        callback && callback();
    };

    demo.prototype.showGUI = function() {
        document.querySelectorAll('.dg.main.a').forEach(function(node) {
            node.remove();
        });
    };

    demo.prototype.dispose = function(callback) {

        if (this.parentDom) {
            this.parentDom.removeChild(this.renderer.domElement);
            this.parentDom.removeChild(this.stats.dom);
        }

        this.parentDom = null;
        this.stats = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.mesh = null;
        this.controls = null;

        callback && callback();
    };

}(window.DEMOS);