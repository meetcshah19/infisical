const path = require('path');
const fs = require('fs');
const currentPath = process.cwd();
const {
	LINE
} = require('../variables');

/**
 * Return contents of the file called [fileName] where file
 * exists in the folder at [currentPath]
 * @param {String} fileName - file name
 * @return {String} file - file
*/
const read = (fileName) => {
	let file;
	try {
		file = fs.readFileSync(path.join(currentPath, fileName), 'utf8');
	} catch (err) {
		console.error(
			"Error: Failed to read file " 
			+ fileName 
		);
		process.exit(1);
	}
	
	return file;
}

/**
 * Write to file called [fileName] where file
 * exists in the folder at [currentPath]
 * @param {String} fileName - file name
 * @param {String} content - content to write to file
*/
const write = ({
	fileName,
	content
}) => {
	try {
		fs.writeFileSync(path.join(currentPath, fileName), content);
	} catch (err) {
		console.error("Error: Failed to write to file " + fileName)
		process.exit(1);
	}
}

/**
 * Return text that is the buffer parsed
 * @param {Buffer} src - source buffer
 * @returns {String} text - text of buffer
 */
function parse (src) {
    const obj = {}
  
    // Convert buffer to string
    let lines = src.toString()
  
    // Convert line breaks to same format
    lines = lines.replace(/\r\n?/mg, '\n')
  
    let match
    while ((match = LINE.exec(lines)) != null) {
      const key = match[1]
  
      // Default undefined or null to empty string
      let value = (match[2] || '')
  
      // Remove whitespace
      value = value.trim()
  
      // Check if double quoted
      const maybeQuote = value[0]
  
      // Remove surrounding quotes
      value = value.replace(/^(['"`])([\s\S]*)\1$/mg, '$2')
  
      // Expand newlines if double quoted
      if (maybeQuote === '"') {
        value = value.replace(/\\n/g, '\n')
        value = value.replace(/\\r/g, '\r')
      }
  
      // Add to object
      obj[key] = value
    }
  
    return obj
}

module.exports = {
    read,
		write,
    parse 
}
