var scope = scope || {};


(function () {

	'use strict';

	var divDrop,
		divInstruction,

		msg = {
			init: 'drop your collada and texture files here',
			processing: 'processing collada',
			error: 'something went wrong'
		},

		plane,
		model,

		fileList,
		numFiles,
		currentIndex,

		fileName,
		fileType,

		textures,
		colladaXml,
		colladaString,

		colladaLoader,
		fileReader,
		xmlParser,

		parseCollada,
		loadFiles,
		loadFile,
		init;


	init = function (parent3D) {

		plane = parent3D;

		var loadData = document.getElementById('load-file'),
			loadButton = document.getElementById('load-button');

		divDrop = document.getElementById('drop');
		divInstruction = document.getElementById('instruction');
		divInstruction.innerHTML = msg.init;


		// drag and drop
		divDrop.addEventListener('dragover', function (e) {
			e.preventDefault();
			divDrop.style.backgroundColor = '#5e79d3';
			divDrop.style.color = '#ffffff';
		}, false);

		divDrop.addEventListener('dragenter', function (e) {
			e.preventDefault();
			divDrop.style.backgroundColor = '#5e79d3';
			divDrop.style.color = '#ffffff';
		}, false);

		divDrop.addEventListener('dragleave', function (e) {
			e.preventDefault();
			divDrop.style.backgroundColor = '#ffffff';
			divDrop.style.color = '#5e79d3';
		}, false);

		divDrop.addEventListener('drop', function (e) {
			e.preventDefault();
			divDrop.style.backgroundColor = '#F18C73';
			divInstruction.innerHTML = msg.processing;
			loadFiles(e.dataTransfer.files);
		}, false);


		// file menu
		loadData.addEventListener('change', function (e) {
			e.preventDefault();
			loadFiles(loadData.files);
		}, false);

		loadButton.addEventListener('click', function (e) {
			loadData.click();
		}, false);


		//colladaLoader = new THREE.ColladaLoader();
		fileReader = new FileReader();
		xmlParser = new DOMParser();

		fileReader.addEventListener('load', function (e) {

			if (fileType === 'image') {
				textures[fileName] = fileReader.result;
			} else {
				colladaString = fileReader.result;
				colladaXml = xmlParser.parseFromString(fileReader.result, 'application/xml');
			}

			loadFile();

		}, false);
	};


	loadFiles = function (files) {

		textures = {};
		fileList = files;
		numFiles = files.length;
		currentIndex = -1;

		//remove currently loaded model
		plane.children.forEach(function (child) {
			plane.remove(child);
		});

		loadFile();
	};


	loadFile = function () {
		var file;

		if (++currentIndex >= numFiles) {
			parseCollada();
			return;
		}

		file = fileList[currentIndex];
		fileName = file.name;
		fileType = file.type;

		if (fileType.indexOf('image') !== -1) {
			fileType = 'image';
			fileReader.readAsDataURL(file);
		} else if (fileName.toLowerCase().indexOf('dae') !== -1) {
			fileType = 'xml';
			fileReader.readAsText(file);
		}

		fileName = fileName.substring(0, fileName.indexOf('.'));
	};


	parseCollada = function () {

		var results = colladaXml.evaluate('//dae:library_images/dae:image/dae:init_from/text()', colladaXml, function () {
			return 'http://www.collada.org/2005/11/COLLADASchema';
		}, XPathResult.ANY_TYPE, null),
			node,
			nodes = {},
			imageName;

		while ((node = results.iterateNext()) !== null) {
			imageName = node.textContent;
			if (imageName.indexOf('/') !== -1) {
				imageName = imageName.substring(imageName.lastIndexOf('/') + 1, imageName.indexOf('.'));
			} else {
				imageName = imageName.substring(0, imageName.indexOf('.'));
			}
			nodes[imageName] = node;
		}

		for (imageName in nodes) {
			if (nodes.hasOwnProperty(imageName)) {
				nodes[imageName].textContent = textures[imageName];
				THREE.Cache.add(imageName, textures[imageName]);
				// console.log(THREE.Cache);
			}
		}
		// colladaLoader needs to be instantiated every time you load a model
		colladaLoader = new THREE.ColladaLoader();

		const collada = colladaLoader.parse(colladaString);
		model = collada.scene;
		divDrop.style.backgroundColor = '#ffffff';
		divDrop.style.color = '#5e79d3';
		divInstruction.innerHTML = msg.init;
		fixTextures(model);
		plane.add(model);
		scope.resetControls(model);

		// colladaLoader.parse(colladaXml, (collada) => {
		// 	model = collada.scene;
		// 	divDrop.style.backgroundColor = '#ffffff';
		// 	divDrop.style.color = '#5e79d3';
		// 	divInstruction.innerHTML = msg.init;
		// 	fixTextures(model);
		// 	plane.add(model);
		// 	scope.resetControls(model);
		// });
	};


	scope.initLoader = init;

}());


function fixTextures(model) {
	model.traverse(function (child) {
		// console.log(child.material);
		if (child.material && child.material.map) {
			child.material.emissive = new THREE.Color(0, 0, 0);
			// child.material.map.wrapS = THREE.ClampToEdgeWrapping;
			// child.material.map.wrapT = THREE.ClampToEdgeWrapping;
			// child.material.map.minFilter = THREE.LinearFilter;
			child.material.needsUpdate = true;
		}
	});
}