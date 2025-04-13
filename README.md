# Watermarkey

A modern web application to add customizable diagonal text watermarks to images, similar to stock photo watermarks.

![Watermarkey Screenshot](https://github.com/AxIsCoder/watermarkey/raw/main/screenshot.png)

## Features

- Upload any image and apply customizable watermarks
- Dark mode support for comfortable editing in any environment
- Adaptive watermark sizing and placement based on image dimensions
- Customize watermark text and appearance:
  - Custom text with design elements between repetitions
  - Adjustable opacity, size, and color
  - Control watermark density and distribution
  - Rotation angle controls
  - Multiple design elements (bullets, stars, diamonds, etc.)
- Real-time preview of changes
- Download the watermarked image with one click
- Mobile-friendly responsive design

## How to Use

1. Visit the [live demo](https://axiscoder.github.io/watermarkey/) or open `index.html` locally
2. Click "Select Image" to choose an image from your device
3. Customize your watermark with the controls:
   - **Text**: Change the watermark text
   - **Design Between Text**: Choose symbols to appear between text (bullet, star, diamond, etc.)
   - **Text Spacing**: Adjust spacing between text and design elements
   - **Opacity**: Control transparency (10-50%)
   - **Text Size**: Adjust size of watermark text
   - **Density**: Control how many watermarks appear across the image
   - **Color**: Choose from preset colors for the watermark text
   - **Rotation**: Adjust the angle of the watermark pattern
4. Changes apply automatically in real-time
5. Click "Download Image" to save the watermarked image to your device

## Recent Updates

- Added dark mode support with theme toggle
- Improved watermark distribution algorithm for better coverage
- Enhanced color palette with a more intuitive interface
- Added visual grid background to distinguish image from preview area
- Fixed edge detection to ensure watermarks cover the entire image
- Optimized watermark density for a more balanced look
- Added GitHub button for easy access to source code
- Improved mobile responsiveness

## Technical Details

- Built with pure HTML, CSS, and JavaScript
- Uses HTML5 Canvas API for image manipulation
- No server-side processing required - all operations happen in your browser
- Adaptive algorithms that scale based on image dimensions
- Responsive design works on desktop and mobile devices

## Installation

No installation required! Simply clone the repository and open `index.html` in any modern browser:

```bash
git clone https://github.com/AxIsCoder/watermarkey.git
cd watermarkey
```

## License

Free to use for personal and commercial projects. 