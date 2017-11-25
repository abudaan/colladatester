var scope = scope || {};


window.onload = function () {

	'use strict';

	THREE.Cache.enabled = true;

	var
		camera,
		scene,
		renderer,
		light,

		plane,

		width,
		height;


	function render() {
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}


	function onWindowResize(event) {
		width = window.innerWidth;
		height = window.innerHeight;

		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		renderer.setSize(width, height);
	}


	function initialize() {
		var hemisphere, ambient;

		width = window.innerWidth;
		height = window.innerHeight;

		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 10000);
		camera.position.set(0, 700, 500);
		camera.lookAt(scene.position);
		scene.add(camera);

		//Add a hemisphere light as 'secondary' lightsource
		// hemisphere = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
		// hemisphere.position.set(0, 0, 50000);
		// hemisphere.color.setHSL(0.6, 1, 0.6);
		// hemisphere.groundColor.setHSL(0.095, 1, 0.75);
		// scene.add(hemisphere);

		ambient = new THREE.AmbientLight(0xffffff);
		scene.add(ambient);

		light = new THREE.DirectionalLight(0xffffff);
		light.position.set(0, 1000, 200);
		//light.castShadow = true;
		//light.shadowCameraVisible = true;

		scene.add(light);

		plane = new THREE.Mesh(
			new THREE.PlaneGeometry(800, 800, 10, 10),
			//new THREE.MeshBasicMaterial({color:0xa7f0d8, opacity: 0.5, wireframe:false, side:THREE.DoubleSide, transparent: true})
			new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0.5, wireframe: true, side: THREE.DoubleSide })
		);
		plane.name = 'plane';
		scene.add(plane);


		try {
			renderer = new THREE.WebGLRenderer({ antialias: true });
		} catch (e) {
			renderer = new THREE.CanvasRenderer({ antialias: true });
		}

		renderer.setSize(width, height);
		renderer.setClearColor(0xffffff, 1);
		document.body.appendChild(renderer.domElement);

		window.addEventListener('resize', onWindowResize, false);
		scope.initControls(plane, light, camera);
		scope.initLoader(plane);
	}

	initialize();
	render();
};