'use strict';

import createScene3D from './scene3d';
import createLoader from './loader';

let scene3d;

window.onload = function () {
  // console.log(THREE);
  scene3d = createScene3D();
  document.body.appendChild(scene3d.domElement);
  createLoader(scene3d, function (model) {
    //console.log(model);
    scene3d.add(model);
  });

  resize();
  window.onresize = resize;
};


function resize() {
  let width = window.innerWidth;
  let height = window.innerHeight;
  scene3d.resize(width, height);
}