"use strict";

!function(global) {

    var options = {
        particleCount: 10000,
        range: 100
    };

    function updateMeshByOptions(scene) {
        var obj = scene.getObjectByName("mesh");

        var geo = new THREE.BufferGeometry();
        var vertices = [];
        var colors = [];
        for (var i = 0; i < options.particleCount * 3; i++) {
            vertices.push((Math.random() * 2 - 1) * options.range);
            colors.push(Math.random());
        }
        geo.addAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        geo.addAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

        if (obj) {
            obj.geometry.copy(geo);
        } else {
            var mat = new THREE.PointsMaterial({
                vertexColors: true
            });
            obj = new THREE.Points(geo, mat);
            scene.add(obj);
        }
        obj.name = 'mesh';
        obj.scale.set(1.5, 1.5, 1.5);

        return obj;
    }

    var demo = global.Particles = function() {
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
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#000000');

        //camera
        this.camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
        this.camera.position.z = 20;
        this.camera.position.y = 10;

        //renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( width, height );
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.parentDom.appendChild(this.renderer.domElement);

        //mesh
        this.mesh = updateMeshByOptions(this.scene);

        //light
        var ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
        ambientLight.position.set(-30, 30, 0);
        this.scene.add(ambientLight);

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

        var self = this;

        var gui = new dat.GUI();

        gui.add(options, 'particleCount', 5000, 20000).onChange(function() {
            self.mesh.copy(updateMeshByOptions(self.scene));
        });

        gui.add(options, 'range', 50, 200).onChange(function() {
            self.mesh.copy(updateMeshByOptions(self.scene));
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