var scope = scope || {};


(function(){

	'use strict';

	var
		gui,
		gui2,
		
		rotationWorld = {
			'world rot x': 0,
			'world rot y': 0,
			'world rot z': 0			
		},
		positionLight = {
			'light pos x': 0,
			'light pos y': 0,
			'light pos z': 0			
		},
		positionCamera = {
			'camera pos x': 0,
			'camera pos y': 0,
			'camera pos z': 0			
		},
		positionModel = {
			'model pos x': 0,
			'model pos y': 0,
			'model pos z': 0			
		},
		rotationModel = {
			'model rot x': 0,
			'model rot y': 0,
			'model rot z': 0			
		},
		scaleModel = {
			'model scale': 1
		},
		resetSettingsModel = {
			'reset model': function(){
				resetModel();
			}
		},
		resetSettingsWorld = {
			'reset world': function(){
				resetWorld();
			}
		},

		ctrlWorldRotX,
		ctrlWorldRotY,
		ctrlWorldRotZ,

		ctrlCameraPosX,
		ctrlCameraPosY,
		ctrlCameraPosZ,

		ctrlLightPosX,
		ctrlLightPosY,
		ctrlLightPosZ,

		ctrlModelRotX,
		ctrlModelRotY,
		ctrlModelRotZ,

		ctrlModelPosX,
		ctrlModelPosY,
		ctrlModelPosZ,
		
		ctrlModelScale,

		plane,
		camera,
		light,
		model,

		degToRad = Math.degToRad,
		initControls,
		resetModel,
		resetWorld,
		resetControls;



	initControls = function(plane3D, light3D, camera3D){

		plane = plane3D;
		light = light3D;
		camera = camera3D;


		//controls for the scene
		gui = new dat.GUI();

		ctrlWorldRotX = gui.add(rotationWorld,'world rot x',-180,180);
		ctrlWorldRotX.onChange(function(value){
			plane.rotation.x = degToRad(value);
		});

		ctrlWorldRotY = gui.add(rotationWorld,'world rot y',-180,180);
		ctrlWorldRotY.onChange(function(value){
			plane.rotation.y = degToRad(value);
		});

		ctrlWorldRotZ = gui.add(rotationWorld,'world rot z',-180,180);
		ctrlWorldRotZ.onChange(function(value){
			plane.rotation.z = degToRad(value);
		});

		ctrlLightPosX = gui.add(positionLight,'light pos x',-1000,1000);
		ctrlLightPosX.onChange(function(value){
			light.position.x = value;
		});

		ctrlLightPosY = gui.add(positionLight,'light pos y',0,2000);
		ctrlLightPosY.onChange(function(value){
			light.position.y = value;
		});

		ctrlLightPosZ = gui.add(positionLight,'light pos z',-1000,1000);
		ctrlLightPosZ.onChange(function(value){
			light.position.z = value;
		});

		ctrlCameraPosX = gui.add(positionCamera,'camera pos x',-1000,1000);
		ctrlCameraPosX.onChange(function(value){
			camera.position.x = value;
		});

		ctrlCameraPosY = gui.add(positionCamera,'camera pos y',-1000,1000);
		ctrlCameraPosY.onChange(function(value){
			camera.position.y = value;
		});

		ctrlCameraPosZ = gui.add(positionCamera,'camera pos z',-1000,1000);
		ctrlCameraPosZ.onChange(function(value){
			camera.position.z = value;
		});

		gui.add(resetSettingsWorld,'reset world');

		
		//controls for the model		
		gui2 = new dat.GUI();		

		ctrlModelPosX = gui2.add(positionModel,'model pos x',-500,500);
		ctrlModelPosX.onChange(function(value){
			model.position.x = value;
			model.updateMatrix();
		});

		ctrlModelPosY = gui2.add(positionModel,'model pos y',-500,500);
		ctrlModelPosY.onChange(function(value){
			model.position.y = value;
			model.updateMatrix();
		});

		ctrlModelPosZ = gui2.add(positionModel,'model pos z',-500,500);
		ctrlModelPosZ.onChange(function(value){
			model.position.z = value;
			model.updateMatrix();
		});

		ctrlModelRotX = gui2.add(rotationModel,'model rot x',-180,180);
		ctrlModelRotX.step(90);
		ctrlModelRotX.onChange(function(value){
			model.rotation.x = degToRad(value);
			model.updateMatrix();
		});

		ctrlModelRotY = gui2.add(rotationModel,'model rot y',-180,180);
		ctrlModelRotY.step(90);
		ctrlModelRotY.onChange(function(value){
			model.rotation.y = degToRad(value);
			model.updateMatrix();
		});

		ctrlModelRotZ = gui2.add(rotationModel,'model rot z',-180,180);
		ctrlModelRotZ.step(90);
		ctrlModelRotZ.onChange(function(value){
			model.rotation.z = degToRad(value);
			model.updateMatrix();
		});

		ctrlModelScale = gui2.add(scaleModel,'model scale',1,20);
		ctrlModelScale.onChange(function(value){
			model.scale.x = value;
			model.scale.y = value;
			model.scale.z = value;
			model.updateMatrix();
		});

		gui2.add(resetSettingsModel,'reset model');

		resetControls(new THREE.Mesh());
	};


	resetControls = function(model3D){
		model = model3D;
		resetWorld();
		resetModel();
	};

	
	resetWorld = function(){
		ctrlWorldRotX.setValue(-114);
		ctrlWorldRotY.setValue(0);
		ctrlWorldRotZ.setValue(45);

		ctrlLightPosX.setValue(0);
		ctrlLightPosY.setValue(1000);
		ctrlLightPosZ.setValue(200);

		ctrlCameraPosX.setValue(0);
		ctrlCameraPosY.setValue(700);
		ctrlCameraPosZ.setValue(500);
	};


	resetModel = function(){
		ctrlModelPosX.setValue(0);
		ctrlModelPosY.setValue(0);
		ctrlModelPosZ.setValue(0);

		ctrlModelRotX.setValue(0);
		ctrlModelRotY.setValue(0);
		ctrlModelRotZ.setValue(0);

		ctrlModelScale.setValue(0);
	};

	
	scope.initControls = initControls;
	scope.resetControls = resetControls;

}());