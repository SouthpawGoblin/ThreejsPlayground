"use strict";

!function(global) {

    var SimpleCube = global.SimpleCube = function() {
        this.options = null;
        this.parentDom = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.mesh = null;
    };

    SimpleCube.prototype.init = function(parentDom, options, callback) {

        var width = Math.floor(parentDom.clientWidth);
        var height = Math.floor(parentDom.clientHeight);

        this.parentDom = parentDom;
        this.options = options || {};

        //scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#aaaaaa');

        //camera
        this.camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
        this.camera.position.z = 5;

        //renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( width, height );
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.parentDom.appendChild(this.renderer.domElement);

        //mesh
        var cubeGeo = new THREE.BoxGeometry(2, 2, 2);
        var wireGeo = new THREE.WireframeGeometry(cubeGeo);

        var cubeMat = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            transparent: true,
            opacity: 0.5
        });
        var lineMat = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            transparent: true,
            opacity: 0.9
        });

        this.mesh = new THREE.Mesh(cubeGeo, cubeMat);
        var lineSegs = new THREE.LineSegments(wireGeo, lineMat);
        this.mesh.add(lineSegs);
        this.scene.add(this.mesh);

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

    SimpleCube.prototype.render = function(callback) {
        var self = this;

        var animate = function () {
            if (self.mesh) {
                requestAnimationFrame( animate );

                self.mesh.rotation.x += 0.01;
                self.mesh.rotation.y += 0.01;

                self.renderer.render(self.scene, self.camera);
            }
        };

        animate();

        callback && callback();
    };

    SimpleCube.prototype.dispose = function(callback) {

        this.parentDom && this.parentDom.removeChild(this.renderer.domElement);

        this.options = null;
        this.parentDom = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.mesh = null;

        callback && callback();
    };

}(window.DEMOS);