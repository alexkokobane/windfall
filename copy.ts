import shell from 'shelljs'

const buildFolder = './dist/'

const files = new Set(['package.json', 'package-lock.json'])
const folders = new Set(['./src/views', './src/public', './src/files'])

// Copy Folders
folders.forEach((folder) => {
  shell.cp('-R', folder, buildFolder)
});