"use strict";

!function(global) {

    var options = {
        showLightHelper: false,
        lightType: '聚光灯-SpotLight',
        ballMaterial: 'Lambert材质-Lambert',
        planeMaterial: 'Phong材质-Phong'
    };

    function updateMeshByOptions(scene) {
        var obj = scene.getObjectByName("mesh");
        obj && scene.remove(obj);

        var ballGeo = new THREE.SphereBufferGeometry(2, 30, 30);
        var ballMat = new THREE['Mesh' + options.ballMaterial.split('-')[1] + 'Material']({
            color: 0xaa0000,
            dithering: true
        });

        var planeGeo = new THREE.PlaneBufferGeometry(300, 300);
        var planeMat = new THREE['Mesh' + options.planeMaterial.split('-')[1] + 'Material']({
            color: 0x000033,
            dithering: true
        });
        var plane = new THREE.Mesh(planeGeo, planeMat);
        plane.receiveShadow = true;
        plane.position.y = -10;
        plane.rotation.x = -Math.PI / 2;

        var ball = new THREE.Mesh(ballGeo, ballMat);
        ball.castShadow = true;

        var mesh = new THREE.Group();
        mesh.add(plane);
        mesh.add(ball);
        mesh.name = 'mesh';

        mesh.scale.set(1.5, 1.5, 1.5);

        scene.add(mesh);

        return mesh;
    }

    function updateLightByOptions(scene) {
        var obj = scene.getObjectByName("light");
        obj && scene.remove(obj);

        var light = new THREE[options.lightType.split('-')[1]]('#ffffff', 2);
        light.position.set( 15, 15, 0 );
        light.castShadow = true;
        light.name = 'light';

        if (options.showLightHelper) {
            var lightHelper = new THREE[options.lightType.split('-')[1] + 'Helper'](light);
            light.add(lightHelper);
        }

        scene.add(light);

        return light;
    }

    var demo = global.LightAndMaterial = function() {
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
        this.camera.position.z = 20;
        this.camera.position.y = 10;

        //renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( width, height );
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.parentDom.appendChild(this.renderer.domElement);

        //mesh
        this.mesh = updateMeshByOptions(this.scene);

        //light
        var ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
        ambientLight.position.set(-30, 30, 0);
        this.scene.add(ambientLight);

        updateLightByOptions(this.scene);

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
        gui.add(options, 'showLightHelper').onChange(function() {
            updateLightByOptions(self.scene);
        });

        gui.add(options, 'lightType',
            ['平行光-DirectionalLight',
            '半球光-HemisphereLight',
            '点光源-PointLight',
            '聚光灯-SpotLight']).onChange(function() {
            updateLightByOptions(self.scene);
        });

        gui.add(options, 'ballMaterial',
            ['Lambert材质-Lambert',
            'Phong材质-Phong']).onChange(function() {
            this.mesh = updateMeshByOptions(self.scene);
        });

        gui.add(options, 'planeMaterial',
            ['Lambert材质-Lambert',
            'Phong材质-Phong']).onChange(function() {
            this.mesh = updateMeshByOptions(self.scene);
        })
    };

    demo.prototype.dispose = function(callback) {

        this.parentDom.removeChild(this.renderer.domElement);

        this.parentDom = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.mesh = null;
        this.controls = null;

        callback && callback();
    };

}(window.DEMOS);