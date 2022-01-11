import readImageDICOMFileSeries from 'itk/readImageDICOMFileSeries';
import Viewer from './viewer';

// Setup viewer with DOM
const viewerContainer = document.getElementById('viewer');
const topLabel = document.getElementById('top');
const bottomLabel = document.getElementById('bottom');
const leftLabel = document.getElementById('left');
const rightLabel = document.getElementById('right');
const viewer = new Viewer(
  viewerContainer,
  { topLabel, bottomLabel, leftLabel, rightLabel },
);

// Files
const fileInput = document.querySelector('input');
fileInput.addEventListener('change', async (event) => {

  // Get files
  const { dataTransfer } = event;
  const files = event.target.files || dataTransfer.files;

  fileInput.setAttribute("hidden", "");

  // Read series
  viewer.maxConcurrentFiles = 9;
  viewer.currFileStartIndex = 0;
  viewer.inputFiles = files;
  const currFiles = Array.from(files).slice(viewer.currFileStartIndex, viewer.currFileStartIndex + viewer.maxConcurrentFiles);
  // const currFileList = FileList(currFiles);
  const itkReader = await readImageDICOMFileSeries(currFiles);

  // Load in viewer
  const selector = document.getElementById('slicingModeSelector')
  viewer.load(itkReader.image, parseInt(selector.value));

  selector.removeAttribute("hidden");
  selector.onchange = () => {
    viewer.load(itkReader.image, parseInt(selector.value));
  }
});
