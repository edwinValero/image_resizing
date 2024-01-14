# Image Resizer

This Node.js script allows you to resize images to a specified width and height using the `sharp` library.

## Prerequisites

- Node.js: This script requires Node.js version v18.17.0 or higher. You can download and install Node.js from [nodejs.org](https://nodejs.org/).

Additionally, you will need to install the `sharp` module if you haven't already. You can install it using npm:

```bash
$ npm install
```

## Usage

To use this script, run it from the command line and follow the prompts to enter the source file path, desired width and height, output format, and destination path.

The script will then process the image and save the resized version to the specified output path.

```bash
$ npm start
```

## Features

- Synchronous file reading for immediate processing.
- Supports `.jpg` and `.png` output formats.
- Command-line interface for easy interaction.
- Error handling for a smooth user experience.

## Contributing

Feel free to fork this repository and submit pull requests to contribute to this project.

## License

This project is open source and available under the [MIT License](LICENSE).
