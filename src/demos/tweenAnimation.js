"use strict";

!function(global) {

    var vars = {
        width: 1,
        height: 1,
        depth: 1
    };

    function updateMeshByOptions(scene) {
        var obj = scene.getObjectByName("mesh");
        obj && scene.remove(obj);

        var geo = new THREE.BoxBufferGeometry(vars.width, vars.height);
        var mat = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            transparent: true,
            opacity: 0.5
        });
        var mesh = new THREE.Mesh(geo, mat);
        mesh.name = 'mesh';

        var wireGeo = new THREE.WireframeGeometry(geo);
        var wireMat = new THREE.LineBasicMaterial({
            color: 0xffffff,
            linewidth: 3
        });
        var wireframe = new THREE.LineSegments(wireGeo, wireMat);
        wireframe.name = "wire";
        mesh.add(wireframe);

        mesh.scale.set(1.5, 1.5, 1.5);

        scene.add(mesh);

        return mesh;
    }

    var demo = global.TweenAnimation = function() {
        this.parentDom = null;
        this.stats = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.mesh = null;
        this.controls = null;
        this.tween = null;
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
        this.scene.background = new THREE.Color(0x000000);

        //camera
        this.camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
        this.camera.position.set(-4, 6, 5);

        //renderer
        this.renderer = new THREE.WebGLRenderer({alpha: true});
        this.renderer.setSize( width, height );
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.parentDom.appendChild(this.renderer.domElement);

        //mesh
        this.mesh = updateMeshByOptions(this.scene);

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

            var width = Math.floor(parentDom.clientWidth);
            var height = Math.floor(parentDom.clientHeight);

            self.camera.aspect = width / height;
            self.camera.updateProjectionMatrix();
            self.renderer.setSize( width, height );

        }, false);

        //animation
        var tweenX = new TWEEN.Tween(vars)
        .to({width: 3, height: 1, depth: 1}, 2000)
        .easing(TWEEN.Easing.Bounce.Out);
        var tweenY = new TWEEN.Tween(vars)
        .to({width: 3, height: 3, depth: 1}, 2000)
        .easing(TWEEN.Easing.Elastic.Out);
        var tweenZ = new TWEEN.Tween(vars)
        .to({width: 3, height: 3, depth: 3}, 2000)
        .easing(TWEEN.Easing.Exponential.Out);
        var tweenReset = new TWEEN.Tween(vars)
        .to({width: 1, height: 1, depth: 1}, 2000)
        .easing(TWEEN.Easing.Sinusoidal.Out);

        tweenX.chain(tweenY);
        tweenY.chain(tweenZ);
        tweenZ.chain(tweenReset);
        tweenReset.chain(tweenX);

        tweenX.onUpdate(onTweenUpdate);
        tweenY.onUpdate(onTweenUpdate);
        tweenZ.onUpdate(onTweenUpdate);
        tweenReset.onUpdate(onTweenUpdate);

        function onTweenUpdate() {
            if (self.mesh) {
                var newGeo = new THREE.BoxBufferGeometry(this.width, this.height, this.depth);
                self.mesh.geometry.copy(newGeo);
                self.mesh.getObjectByName("wire").geometry.copy(new THREE.WireframeGeometry(newGeo));
            }
        }

        this.tween = tweenX;

        callback && callback();
    };

    demo.prototype.render = function(callback) {
        var self = this;

        var animate = function () {
            if (self.mesh) {
                requestAnimationFrame( animate );

                self.stats.begin();
                TWEEN.update();
                self.controls.update();
                self.renderer.render(self.scene, self.camera);
                self.stats.end();
            }
        };

        animate();

        this.tween.start();

        callback && callback();
    };

    demo.prototype.getMesh = function() {
        return this.mesh;
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
        this.tween.stopChainedTweens();

        this.parentDom = null;
        this.stats = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.mesh = null;
        this.controls = null;
        this.tween = null;

        callback && callback();
    };

}(window.DEMOS);