import createModels from './models3d';

export default function init(callback) {
  let textures;
  let colladaModels;
  let jsonModels;
  const loadData = document.getElementById('load-file');
  const loadButton = document.getElementById('load-button');
  const fileReader = new FileReader();
  let fileList;
  let numFiles;
  let currentIndex;
  let fileType;
  let fileName;


  // drag and drop
  document.addEventListener('dragover', (e) => {
    e.preventDefault();
  }, false);

  document.addEventListener('dragenter', (e) => {
    e.preventDefault();
  }, false);

  document.addEventListener('dragleave', (e) => {
    e.preventDefault();
  }, false);

  document.addEventListener('drop', (e) => {
    e.preventDefault();
    loadFiles(e.dataTransfer.files);
  }, false);

  // file menu
  loadData.addEventListener('change', (e) => {
    e.preventDefault();
    loadFiles(e.target.files);
  }, false);

  loadButton.addEventListener('click', () => {
    loadData.click();
  }, false);

  fileReader.addEventListener('load', () => {
    console.log('loaded', fileType);
    if (fileType === 'image') {
      textures.set(fileName, fileReader.result);
    } else if (fileType === 'collada') {
      colladaModels.set(fileName, fileReader.result);
    } else if (fileType === 'json') {
      jsonModels.set(fileName, JSON.parse(fileReader.result));
    }
    loadFile();
  }, false);


  function loadFiles(files) {
    textures = new Map();
    colladaModels = new Map();
    jsonModels = new Map();
    fileList = files;
    numFiles = fileList.length;
    currentIndex = -1;
    loadFile();
  }


  function loadFile() {
    // THREE.Cache.clear();
    if (++currentIndex >= numFiles) {
      createModels(colladaModels, jsonModels, textures, callback);
      console.log('loading done');
      return;
    }

    const file = fileList[currentIndex];
    fileName = file.name;
    fileType = file.type || fileName.toLowerCase().substring(fileName.indexOf('.') + 1);
    // fileName = fileName.substring(0, fileName.indexOf('.'));
    console.log(fileName, fileType);

    if (fileType.indexOf('image') !== -1) {
      fileType = 'image';
      fileReader.readAsDataURL(file);
    } else if (fileType === 'dae' || fileType.indexOf('collada') !== -1) {
      // MIME: model/vnd.collada+xml
      fileType = 'collada';
      fileReader.readAsText(file);
    } else if (fileType === 'json' || fileType === 'js' || fileType.indexOf('json') !== -1) {
      fileType = 'json';
      fileReader.readAsText(file);
    }
  }
}
