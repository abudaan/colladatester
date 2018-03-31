import createScene3D from './scene3d';
import createLoader from './loader';

let scene3d;

const resize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  scene3d.resize(width, height);
};

window.onload = () => {
  scene3d = createScene3D();
  document.body.appendChild(scene3d.domElement);
  createLoader((model) => {
    // console.log(model);
    scene3d.add(model);
    setTimeout(() => {
      scene3d.render();
    }, 0);
  });

  resize();
  window.onresize = resize;
};
