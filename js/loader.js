'use strict';

import createModels from 'models3d';

export default function init(callback){

  let textures;
  let colladaModels;
  let jsonModels;
  let loadData = document.getElementById('load-file');
  let loadButton = document.getElementById('load-button');
  let fileReader = new FileReader();
  let fileList, numFiles, currentIndex;
  let fileType, fileName;


createModels(null, null, null, callback);



  // drag and drop
  document.addEventListener('dragover', function(e){
    e.preventDefault();
  },false);

  document.addEventListener('dragenter', function(e){
    e.preventDefault();
  },false);

  document.addEventListener('dragleave', function(e){
    e.preventDefault();
  },false);

  document.addEventListener('drop', function(e){
    e.preventDefault();
    loadFiles(e.dataTransfer.files);
  }, false);

  // file menu
  loadData.addEventListener('change',function(e){
    e.preventDefault();
    loadFiles(e.target.files);
  },false);

  loadButton.addEventListener('click',function(){
    loadData.click();
  },false);

  fileReader.addEventListener('load', function(){
    if(fileType === 'image'){
      textures.set(fileName, fileReader.result);
    }else if(fileType === 'collada'){
      colladaModels.set(fileName, fileReader.result);
    }else if(fileType === 'json'){
      jsonModels.set(fileName, JSON.parse(fileReader.result));
    }
    loadFile();
  }, false);


  function loadFiles(files){
    textures = new Map();
    colladaModels = new Map();
    jsonModels = new Map();
    fileList = files;
    numFiles = fileList.length;
    currentIndex = -1;
    loadFile();
  }


  function loadFile(){
    if(++currentIndex >= numFiles){
      createModels(colladaModels, jsonModels, textures, callback);
      return;
    }

    let file = fileList[currentIndex];
    fileName = file.name;
    fileType = file.type || fileName.toLowerCase().substring(fileName.indexOf('.') + 1);
    //fileName = fileName.substring(0, fileName.indexOf('.'));
    console.log(fileName, fileType);

    if(fileType.indexOf('image') !== -1){
      fileType = 'image';
      fileReader.readAsDataURL(file);
    }else if(fileType === 'dae'){
      fileType = 'collada';
      fileReader.readAsText(file);
    }else if(fileType === 'json' || fileType === 'js' || fileType.indexOf('json') !== -1){
      fileType = 'json';
      fileReader.readAsText(file);
    }
  }
}