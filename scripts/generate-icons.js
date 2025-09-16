const fs = require('fs');
const path = require('path');

// Simple PNG icon generator
function createSimplePNG(size) {
  // Create a simple 1x1 pixel PNG data URL and convert to buffer
  // This is a minimal PNG with purple background
  const canvas = Buffer.alloc(size * size * 4);
  
  // Fill with purple color (139, 92, 246, 255)
  for (let i = 0; i < canvas.length; i += 4) {
    canvas[i] = 139;     // R
    canvas[i + 1] = 92; // G  
    canvas[i + 2] = 246; // B
    canvas[i + 3] = 255; // A
  }
  
  // Create a simple PNG header
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 dimensions
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, // RGBA, no compression
    0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41, // IDAT chunk
    0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00, // Compressed data
    0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, // CRC
    0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, // IEND chunk
    0x42, 0x60, 0x82
  ]);
  
  return Buffer.concat([pngHeader, canvas]);
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
  
  // Create a simple colored square as PNG
  const iconData = createSimplePNG(size);
  fs.writeFileSync(filepath, iconData);
  
  console.log(`Generated ${filename}`);
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
