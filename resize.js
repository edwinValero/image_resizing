const sharp = require('sharp');
const fs = require('fs');
const path = require('path');



async function resizeImage(inputPath, outputPath, width, height) {
  let newOutputPath = outputPath;
  let statsFilePath = '';
  try {
    const startTime = process.hrtime.bigint();
    const imageBuffer = fs.readFileSync(inputPath);
    const outputFormat = path.extname(outputPath).slice(1);

    const outputBuffer = await sharp(imageBuffer)
      .resize(width, height)
      .toFormat(outputFormat)
      .toBuffer();
    
    let counter = 1;
    while (fs.existsSync(newOutputPath)) {
      newOutputPath = `${path.dirname(outputPath)}/${path.basename(outputPath, path.extname(outputPath))}_${counter}${path.extname(outputPath)}`;
      counter++;
    }
    fs.writeFileSync(newOutputPath, outputBuffer);
    
    const stats = fs.statSync(inputPath);
    const endTime = process.hrtime.bigint();
    const executionTimeInSeconds = Number(endTime - startTime) / 1e9;
    const statsInfo = `
File stats: 
  Size: ${stats.size} bytes
  Created at: ${new Date(stats.birthtime).toLocaleString()}
  Last modified at: ${new Date(stats.mtime).toLocaleString()}

Execution time: ${executionTimeInSeconds.toFixed(2)} seconds

Thank you for using our image resizing program!
    `;
    
    statsFilePath = `${path.dirname(newOutputPath)}/${path.basename(newOutputPath, path.extname(newOutputPath))}_stats.txt`;
    fs.writeFileSync(statsFilePath, statsInfo);

    console.log(`Resized image saved at: ${outputPath}`);
  } catch (err) {
    console.error('Error resizing the image:', err);
    rollBack(newOutputPath, statsFilePath);
  }
}

function rollBack(newOutputPath, statsFilePath) {
  try {
    if (newOutputPath && newOutputPath.trim() !== '' && fs.existsSync(newOutputPath)) {
      fs.unlinkSync(newOutputPath);
      console.log('Deleted the created file due to error.');
    }
    if (statsFilePath && statsFilePath.trim() !== '' && fs.existsSync(statsFilePath)) {
      fs.unlinkSync(statsFilePath);
      console.log('Deleted the created stats file due to error.');
    }
  } catch (deleteErr) {
    console.error('Error deleting the created files:', deleteErr);
  }
}

// Process command line arguments
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

async function getInputs() {
  const inputImagePath = await new Promise(resolve => readline.question('Please enter the source file path: ', resolve));
  let size;
  let width, height;
  do {
    size = await new Promise(resolve => readline.question('Enter width and height in pixels (format: width height): ', resolve));
    [width, height] = size.split(' ').map(Number);
  } while (isNaN(width) || isNaN(height));
  let format;
  do {
    format = await new Promise(resolve => readline.question('Enter output format (jpg, png): ', resolve));
  } while (!['jpg', 'png'].includes(format));
  const outputPath = await new Promise(resolve => 
    readline.question(
      'Enter destination path without name (press enter to use the same source path): ', 
      input => resolve(input || path.dirname(inputImagePath))
    )  
  );
  let newName;
  do {
    newName = await new Promise(resolve =>
      readline.question(
        'Enter a valid new name (press enter to use the default name): ', 
        input => resolve(input || `${path.basename(inputImagePath, path.extname(inputImagePath))}_resize`)
      )
    );
  } while (!/^[\w\-. ]+$/.test(newName));
  const outputImagePath = path.join(outputPath, `${newName}.${format}`);
  readline.close();
  return { inputImagePath, outputImagePath, width, height };
}

getInputs().then(({ inputImagePath, outputImagePath, width, height }) => {
  resizeImage(inputImagePath, outputImagePath, width, height);
});
