"use strict";

!function(global) {

    var options = {
        geometryType: '长方体-Box',
        showWireframe: true
    };

    function updateMeshByOptions(scene) {
        var obj = scene.getObjectByName("mesh");
        obj && scene.remove(obj);

        var geo = new THREE[options.geometryType.split('-')[1] + 'BufferGeometry']();
        var mat = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.5
        });
        var mesh = new THREE.Mesh(geo, mat);
        mesh.name = 'mesh';

        if (options.showWireframe) {
            var wireGeo = new THREE.WireframeGeometry(geo);
            var wireMat = new THREE.LineBasicMaterial({
                color: 0xffffff,
                linewidth: 3
            });
            var wireframe = new THREE.LineSegments(wireGeo, wireMat);
            mesh.add(wireframe);
        }

        mesh.scale.set(1.5, 1.5, 1.5);

        scene.add(mesh);

        return mesh;
    }

    var demo = global.OrbitControls = function() {
        this.parentDom = null;
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

        //scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#000000');

        //camera
        this.camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
        this.camera.position.z = 5;

        //renderer
        this.renderer = new THREE.WebGLRenderer();
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

        callback && callback();
    };

    demo.prototype.render = function(callback) {
        var self = this;

        var animate = function () {
            if (self.mesh) {
                requestAnimationFrame( animate );

                self.controls.update();
                self.renderer.render(self.scene, self.camera);
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
        gui.add(options, 'geometryType',
            ['圆形-Circle',
                '环形-Ring',
                '平面-Plane',
                '长方体-Box',
                '球体-Sphere',
                '圆柱体-Cylinder',
                '圆环-Torus',
                '环状扭结-TorusKnot',
                '二十面体-Icosahedron',
                '八面体-Octahedron',
                '四面体-Tetrahedron',
                '十二面体-Dodecahedron']).onChange(function() {
            self.mesh = updateMeshByOptions(self.scene);
        });

        gui.add(options, 'showWireframe').onChange(function() {
            self.mesh = updateMeshByOptions(self.scene);
        })
    };

    demo.prototype.dispose = function(callback) {

        this.parentDom && this.parentDom.removeChild(this.renderer.domElement);

        this.parentDom = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.mesh = null;
        this.controls = null;

        callback && callback();
    };

}(window.DEMOS);