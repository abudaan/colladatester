'use strict';

import * as THREE from 'three';
import ColladaLoader from 'lib/ColladaLoader';
// import ColladaLoader from 'three-collada-loader';
import ObjectLoader2 from 'lib/ObjectLoader2';

// let baseUrl = 'undefined';
let baseUrl = '';
THREE.Cache.clear();
THREE.Cache.enabled = true;

export default function init(colladasModels, jsonModels, textures, callback) {

  let loader, iterator, model, hasTextures;

  if (colladasModels.size >= 1) {
    loader = new THREE.ColladaLoader();
    // loader = new ColladaLoader();
    iterator = colladasModels.entries();
    let parser = new DOMParser();
    const colladaString = iterator.next().value[1];
    model = parser.parseFromString(colladaString, 'text/xml');
    hasTextures = getTexturesFromCollada(model, textures);
    loader.load(colladaString, function (model) {
      model = model.scene;
      model.scale.set(1, 1, 1);
      if (hasTextures) {
        fixTextures(model);
      }
      callback(model);
    });
  } else if (jsonModels.size >= 1) {
    iterator = jsonModels.entries();
    model = iterator.next().value[1];
    console.log(model);
    hasTextures = getTexturesFromJsonModel(model, textures);
    if (model.object !== undefined) {
      loader = new THREE.ObjectLoader2();
      model = loader.parse(model);
      if (model instanceof THREE.Scene) {
        let group = new THREE.Group();
        model.children.forEach(function (child) {
          if (hasTextures) {
            fixTextures(child);
          }
          child.scale.set(1, 1, 1);
          group.add(child);
          //model.remove(child);
        });
        model = group;
      } else {
        //console.log('no object');
        if (hasTextures) {
          fixTextures(model);
        }
        model.scale.set(1, 1, 1);
      }
      //console.log(model);
      callback(model);
    }
  }
}


function getTexturesFromCollada(xml, textures) {
  let results = xml.evaluate(
    '//dae:library_images/dae:image/dae:init_from/text()',
    xml,
    function () {
      return 'http://www.collada.org/2005/11/COLLADASchema';
    }, XPathResult.ANY_TYPE, null);

  // console.log(results);

  let node;
  let hasTextures;

  while ((node = results.iterateNext()) !== null) {
    let imageName = node.textContent;
    if (imageName.indexOf('/') !== -1) {
      baseUrl += imageName.substring(0, imageName.lastIndexOf('/') + 1);
      imageName = imageName.substring(imageName.lastIndexOf('/') + 1);
    }
    // console.log(baseUrl);
    let img = document.createElement('img');
    img.src = textures.get(imageName);
    THREE.Cache.add(baseUrl + imageName, img);
    hasTextures = true;
  }
  console.log(THREE.Cache);
  return hasTextures;
}


function getTexturesFromJsonModel(json, textures) {
  if (json.images === undefined) {
    return false;
  }
  json.images.forEach(function (image) {
    let img = document.createElement('img');
    img.src = textures.get(image.url);
    THREE.Cache.add(image.url, img);
    // if(image.uuid){
    //   console.log(image.uuid);
    //   delete image.uuid;
    // }
  });
  //console.log(THREE.Cache);
  return true;
}


function fixTextures(model) {
  model.traverse(function (child) {
    if (child.material && child.material.map) {
      //console.log(child.material.map);
      child.material.emissive = new THREE.Color(0, 0, 0);
      // child.material.map.wrapS = THREE.ClampToEdgeWrapping;
      // child.material.map.wrapT = THREE.ClampToEdgeWrapping;
      // child.material.map.minFilter = THREE.LinearFilter;
      child.material.needsUpdate = true;
    }
  });
}

