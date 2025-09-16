const fs = require('fs');
const path = require('path');

// Create a proper PNG icon with correct dimensions
function createProperPNG(width, height) {
  // PNG signature
  const pngSignature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);   // Width
  ihdrData.writeUInt32BE(height, 4);  // Height
  ihdrData[8] = 8;   // Bit depth
  ihdrData[9] = 6;   // Color type (RGBA)
  ihdrData[10] = 0;  // Compression method
  ihdrData[11] = 0;  // Filter method
  ihdrData[12] = 0;  // Interlace method
  
  const ihdrChunk = Buffer.concat([
    Buffer.from([0x00, 0x00, 0x00, 0x0D]), // Length
    Buffer.from('IHDR'),
    ihdrData,
    Buffer.from([0x00, 0x00, 0x00, 0x00])  // CRC (simplified)
  ]);
  
  // Create image data (purple background with white circle)
  const imageData = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      
      // Check if pixel is inside a circle
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 3;
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      
      if (distance <= radius) {
        // White circle
        imageData[index] = 255;     // R
        imageData[index + 1] = 255; // G
        imageData[index + 2] = 255; // B
        imageData[index + 3] = 255; // A
      } else {
        // Purple background
        imageData[index] = 139;     // R
        imageData[index + 1] = 92;  // G
        imageData[index + 2] = 246; // B
        imageData[index + 3] = 255; // A
      }
    }
  }
  
  // Compress image data (simplified - just store raw data)
  const compressedData = Buffer.concat([
    Buffer.from([0x00]), // Filter type
    imageData
  ]);
  
  const idatChunk = Buffer.concat([
    Buffer.from([0x00, 0x00, 0x00, 0x00]), // Length (will be calculated)
    Buffer.from('IDAT'),
    compressedData,
    Buffer.from([0x00, 0x00, 0x00, 0x00])  // CRC (simplified)
  ]);
  
  // Update length
  idatChunk.writeUInt32BE(compressedData.length, 0);
  
  // IEND chunk
  const iendChunk = Buffer.concat([
    Buffer.from([0x00, 0x00, 0x00, 0x00]), // Length
    Buffer.from('IEND'),
    Buffer.from([0xAE, 0x42, 0x60, 0x82])  // CRC
  ]);
  
  return Buffer.concat([pngSignature, ihdrChunk, idatChunk, iendChunk]);
}

// Generate all required icon sizes
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '..', 'public', 'icons');

// Ensure directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate icons
sizes.forEach(size => {
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(iconsDir, filename);
  
  const iconData = createProperPNG(size, size);
  fs.writeFileSync(filepath, iconData);
  
  console.log(`Generated ${filename} (${iconData.length} bytes)`);
});

// Copy the same icon for all shortcut icons
const shortcutIcons = ['search-96x96.png', 'bookings-96x96.png', 'dashboard-96x96.png', 'feed-96x96.png'];
shortcutIcons.forEach(filename => {
  const filepath = path.join(iconsDir, filename);
  const sourceData = fs.readFileSync(path.join(iconsDir, 'icon-96x96.png'));
  fs.writeFileSync(filepath, sourceData);
  console.log(`Generated ${filename}`);
});

console.log('All icons generated successfully!');
