'use strict';

import THREE from 'three';
import ColladaLoader from 'lib/ColladaLoader';

let baseUrl = 'undefined';

export default function init(colladas, json, textures, callback){

  let loader, iterator, model;

  if(colladas.size >= 1){
    loader = new THREE.ColladaLoader();
    iterator = colladas.entries();
    let parser = new DOMParser();
    let model = parser.parseFromString(iterator.next().value[1], 'text/xml');
    loadTextures(model, textures);

    loader.parse(model, function(model){
      model = model.scene;
      model.scale.set(1,1,1);
      fixTextures(model);
      callback(model);
    });
  }else if(json.size >= 1){
    console.log('json');
  }
}


function loadTextures(xml, textures){
  let results = xml.evaluate(
    '//dae:library_images/dae:image/dae:init_from/text()',
    xml,
    function(){
    return 'http://www.collada.org/2005/11/COLLADASchema';
  }, XPathResult.ANY_TYPE, null);

  let node;

  while((node = results.iterateNext()) !== null){
    let imageName = node.textContent;
    if(imageName.indexOf('/') !== -1){
      imageName = imageName.substring(imageName.lastIndexOf('/') + 1);
    }
    let img = document.createElement('img');
    img.src = textures.get(imageName);
    THREE.Cache.add(baseUrl + imageName, img);
  }
  //console.log(THREE.Cache);
}


function fixTextures(model){
  model.traverse(function(child){
    if(child.material && child.material.map) {
      child.material.emissive = new THREE.Color(0,0,0);
      child.material.map.wrapS = THREE.ClampToEdgeWrapping;
      child.material.map.wrapT = THREE.ClampToEdgeWrapping;
      child.material.map.minFilter = THREE.LinearFilter;
      child.material.needsUpdate = true;
    }
  });
}


