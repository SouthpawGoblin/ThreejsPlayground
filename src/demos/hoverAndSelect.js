"use strict";

!function(global) {

    var options = {
    };

    function updateMeshByOptions(scene) {
        var obj = scene.getObjectByName("mesh");
        obj && scene.remove(obj);

        var planeGeo = new THREE.PlaneBufferGeometry(300, 300);
        var planeMat = new THREE.MeshPhongMaterial({
            color: 0x000033,
            dithering: true
        });
        var plane = new THREE.Mesh(planeGeo, planeMat);
        plane.receiveShadow = true;
        plane.position.y = -10;
        plane.rotation.x = -Math.PI / 2;

        var objMat = new THREE.MeshPhongMaterial({
            color: 0xaa0000,
            transparent: true,
            opacity: 0.5,
            dithering: true
        });

        var ball = new THREE.Mesh();
        ball.geometry = new THREE.SphereBufferGeometry(2, 30, 30);
        ball.material = objMat.clone();
        ball.castShadow = true;
        ball.name = "ball";
        ball.userData.selected = false;

        var cube = new THREE.Mesh();
        cube.geometry = new THREE.BoxBufferGeometry(2, 2);
        cube.material = objMat.clone();
        cube.position.x -= 5;
        cube.name = "cube";
        cube.userData.selected = false;

        var octa = new THREE.Mesh();
        octa.geometry = new THREE.OctahedronBufferGeometry(2);
        octa.material = objMat.clone();
        octa.position.x += 5;
        octa.name = "octa";
        octa.userData.selected = false;

        var mesh = new THREE.Group();
        mesh.add(ball);
        mesh.add(cube);
        mesh.add(octa);
        mesh.name = 'mesh';

        mesh.scale.set(1.5, 1.5, 1.5);

        scene.add(plane);
        scene.add(mesh);

        return mesh;
    }

    function updateLightByOptions(scene) {
        var obj = scene.getObjectByName("light");
        obj && scene.remove(obj);

        var light = new THREE.DirectionalLight('#ffffff', 2);
        light.position.set( 15, 15, 0 );
        light.castShadow = true;
        light.name = 'light';

        scene.add(light);

        return light;
    }

    var demo = global.HoverAndSelect = function() {
        this.parentDom = null;
        this.stats = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.mesh = null;
        this.controls = null;
    };

    demo.prototype.init = function(parentDom, callback) {

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
        var ambientLight = new THREE.AmbientLight('#ffffff', 1);
        ambientLight.position.set(-30, 30, 0);
        this.scene.add(ambientLight);

        updateLightByOptions(this.scene);

        //controls
        this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
        this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        this.controls.dampingFactor = 1;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 30;
        this.controls.maxPolarAngle = Math.PI * 2;

        //events
        var self = this;
        window.addEventListener('resize', function() {

            var width = Math.floor(self.parentDom.clientWidth);
            var height = Math.floor(self.parentDom.clientHeight);

            self.camera.aspect = width / height;
            self.camera.updateProjectionMatrix();
            self.renderer.setSize( width, height );

        }, false);

        var rayCaster = new THREE.Raycaster();
        this.renderer.domElement.addEventListener('mousemove', function(event) {
            event.preventDefault();

            var mouse = new THREE.Vector2();
            mouse.x = ( event.offsetX / Math.floor(self.parentDom.clientWidth) ) * 2 - 1;
            mouse.y = - ( event.offsetY / Math.floor(self.parentDom.clientHeight) ) * 2 + 1;

            rayCaster.setFromCamera(mouse, self.camera);
            var intersects = rayCaster.intersectObjects(self.mesh.children);
            for (var i = 0; i < self.mesh.children.length; i++) {
                var obj = self.mesh.children[i];
                if (intersects.length && obj.name === intersects[0].object.name) {
                    obj.material.opacity = 1;
                } else {
                    obj.material.opacity = 0.5;
                }
            }
        }, false);
        this.renderer.domElement.addEventListener('mousedown', function(event) {
            event.preventDefault();

            var mouse = new THREE.Vector2();
            mouse.x = ( event.offsetX / Math.floor(self.parentDom.clientWidth) ) * 2 - 1;
            mouse.y = - ( event.offsetY / Math.floor(self.parentDom.clientHeight) ) * 2 + 1;

            rayCaster.setFromCamera(mouse, self.camera);
            var intersects = rayCaster.intersectObjects(self.mesh.children);
            if (intersects.length) {
                for (var i = 0; i < self.mesh.children.length; i++) {
                    var obj = self.mesh.children[i];
                    if (obj.name === intersects[0].object.name) {
                        obj.userData.selected = !obj.userData.selected;
                        obj.material.color.set(obj.userData.selected ? 0xffff00 : 0xff0000);
                    }
                }
            }
        }, false);

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