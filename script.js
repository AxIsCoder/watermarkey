document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const imageInput = document.getElementById('imageInput');
    const originalPreview = document.getElementById('originalPreview');
    const originalImage = document.getElementById('originalImage');
    const watermarkedPreview = document.getElementById('watermarkedPreview');
    const watermarkCanvas = document.getElementById('watermarkCanvas');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');
    const watermarkText = document.getElementById('watermarkText');
    const fontFamily = document.getElementById('fontFamily');
    const colorPalette = document.getElementById('colorPalette');
    const selectedColorDisplay = document.getElementById('selectedColor');
    const opacitySlider = document.getElementById('opacityRange');
    const opacityValue = document.getElementById('opacityValue');
    const textSizeSlider = document.getElementById('textSizeRange');
    const textSizeValue = document.getElementById('textSizeValue');
    const textSpacingSlider = document.getElementById('spacingRange');
    const textSpacingValue = document.getElementById('spacingValue');
    const densitySlider = document.getElementById('densityRange');
    const densityValue = document.getElementById('densityValue');
    const rotationSlider = document.getElementById('rotationRange');
    const rotationValue = document.getElementById('rotationValue');
    const githubLink = document.getElementById('githubLink');

    // Global variables
    let originalImageObj = null;
    let watermarkedImage = null;
    let currentColor = '#ffffff';  // Set to default white color from HTML
    let isDarkMode = localStorage.getItem('darkMode') === 'true';

    // Apply saved dark mode on load
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Theme Toggle
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    // Color Palette Selection
    colorPalette.addEventListener('click', function(e) {
        if (e.target.classList.contains('palette-color')) {
            // Remove active class from all colors
            document.querySelectorAll('.palette-color').forEach(color => {
                color.classList.remove('active');
            });
            
            // Add active class to selected color
            e.target.classList.add('active');
            
            // Update selected color
            currentColor = e.target.dataset.color;
            selectedColorDisplay.textContent = currentColor;
            
            if (originalImageObj) {
                applyWatermark();
            }
        }
    });

    // Update Range Slider Values
    function updateRangeValue(slider, valueDisplay, suffix = '') {
        valueDisplay.textContent = slider.value + suffix;
        if (originalImageObj) {
            applyWatermark();
        }
    }

    // Setup event listeners for sliders
    textSpacingSlider.addEventListener('input', () => updateRangeValue(textSpacingSlider, textSpacingValue, 'px'));
    opacitySlider.addEventListener('input', () => updateRangeValue(opacitySlider, opacityValue, '%'));
    textSizeSlider.addEventListener('input', () => updateRangeValue(textSizeSlider, textSizeValue, 'px'));
    densitySlider.addEventListener('input', () => updateRangeValue(densitySlider, densityValue));
    rotationSlider.addEventListener('input', () => updateRangeValue(rotationSlider, rotationValue, '°'));

    // Input Change Handlers
    watermarkText.addEventListener('input', function() {
        if (originalImageObj) {
            applyWatermark();
        }
    });

    fontFamily.addEventListener('change', function() {
        if (originalImageObj) {
            applyWatermark();
        }
    });

    // Image Upload Handler
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                // Create new image from file
                const img = new Image();
                img.onload = function() {
                    originalImageObj = img;
                    displayOriginalImage();
                    applyWatermark();
                    // Enable reset button
                    resetBtn.disabled = false;
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Display Original Image
    function displayOriginalImage() {
        if (!originalImageObj) return;
        
        // Show the original image and hide placeholder
        const placeholder = originalPreview.querySelector('.preview-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }
        
        originalImage.src = originalImageObj.src;
        originalImage.style.display = 'block';
        
        // Set max dimensions to maintain aspect ratio within container
        originalImage.style.maxWidth = '100%';
        originalImage.style.maxHeight = '300px';
        originalImage.style.objectFit = 'contain';
    }

    // Apply Watermark
    function applyWatermark() {
        if (!originalImageObj) return;

        // Set canvas dimensions to match original image
        watermarkCanvas.width = originalImageObj.width;
        watermarkCanvas.height = originalImageObj.height;
        
        // Get context
        const ctx = watermarkCanvas.getContext('2d');
        
        // Draw original image
        ctx.drawImage(originalImageObj, 0, 0);
        
        // Get watermark settings
        const text = watermarkText.value || 'WatermarKey';
        const font = fontFamily.value;
        const color = currentColor;
        const opacity = parseInt(opacitySlider.value) / 100;
        const fontSize = parseInt(textSizeSlider.value);
        const spacing = parseInt(textSpacingSlider.value);
        const density = parseInt(densitySlider.value);
        const rotation = parseInt(rotationSlider.value);
        
        // Watermark styling
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;
        ctx.font = `${fontSize}px ${font}`;
        
        // Save the context state
        ctx.save();
        
        // Rotate canvas
        ctx.translate(watermarkCanvas.width / 2, watermarkCanvas.height / 2);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.translate(-watermarkCanvas.width / 2, -watermarkCanvas.height / 2);
        
        // Get text metrics for spacing
        const textWidth = ctx.measureText(text).width;
        
        // Calculate rows and columns based on density
        const rowSpacing = spacing + fontSize;
        const rowCount = Math.ceil(watermarkCanvas.height / rowSpacing) * density;
        const colCount = Math.ceil(watermarkCanvas.width / (textWidth + spacing)) * density;
        
        // Calculate offset to center the watermark grid
        const xOffset = -textWidth;
        const yOffset = -fontSize * 2;
        
        // Draw the watermark pattern
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                const x = j * (textWidth + spacing) + xOffset;
                const y = i * rowSpacing + yOffset;
                ctx.fillText(text, x, y);
            }
        }
        
        // Restore the context
        ctx.restore();
        
        // Hide placeholder and show canvas
        const placeholder = watermarkedPreview.querySelector('.preview-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }
        
        watermarkCanvas.style.display = 'block';
        
        // Set consistent display size for the canvas (same as original)
        watermarkCanvas.style.maxWidth = '100%';
        watermarkCanvas.style.maxHeight = '300px';
        watermarkCanvas.style.objectFit = 'contain';
        
        // Store watermarked image for download
        watermarkedImage = watermarkCanvas.toDataURL('image/png');
        
        // Enable download button
        downloadBtn.disabled = false;
    }

    // Download Button
    downloadBtn.addEventListener('click', function() {
        if (watermarkedImage) {
            const link = document.createElement('a');
            link.download = 'watermarked-image.png';
            link.href = watermarkedImage;
            link.click();
        }
    });

    // Reset Button
    resetBtn.addEventListener('click', function() {
        // Reset form elements
        imageInput.value = '';
        watermarkText.value = 'WatermarKey';
        fontFamily.value = "'Roboto', sans-serif";
        
        // Reset sliders
        opacitySlider.value = 50;
        opacityValue.textContent = '50%';
        textSizeSlider.value = 24;
        textSizeValue.textContent = '24px';
        textSpacingSlider.value = 120;
        textSpacingValue.textContent = '120px';
        densitySlider.value = 2;
        densityValue.textContent = '2';
        rotationSlider.value = -30;
        rotationValue.textContent = '-30°';
        
        // Reset color palette
        document.querySelectorAll('.palette-color').forEach(color => {
            color.classList.remove('active');
        });
        document.querySelector('.palette-color[data-color="#ffffff"]').classList.add('active');
        currentColor = '#ffffff';
        selectedColorDisplay.textContent = '#ffffff';
        
        // Clear the canvas
        if (watermarkCanvas.width) {
            const ctx = watermarkCanvas.getContext('2d');
            ctx.clearRect(0, 0, watermarkCanvas.width, watermarkCanvas.height);
        }
        
        // Reset image previews
        originalImageObj = null;
        watermarkedImage = null;
        
        // Hide images and show placeholders
        originalImage.style.display = 'none';
        watermarkCanvas.style.display = 'none';
        
        const originalPlaceholder = originalPreview.querySelector('.preview-placeholder');
        const watermarkedPlaceholder = watermarkedPreview.querySelector('.preview-placeholder');
        
        if (originalPlaceholder) originalPlaceholder.style.display = 'flex';
        if (watermarkedPlaceholder) watermarkedPlaceholder.style.display = 'flex';
        
        // Disable buttons
        downloadBtn.disabled = true;
        resetBtn.disabled = true;
    });

    // Style the GitHub link
    if (githubLink) {
        // The floating GitHub button is now styled via CSS
        // No need for inline styles
    }

    // Initialize with default values for range displays
    opacityValue.textContent = opacitySlider.value + '%';
    textSizeValue.textContent = textSizeSlider.value + 'px';
    textSpacingValue.textContent = textSpacingSlider.value + 'px';
    densityValue.textContent = densitySlider.value;
    rotationValue.textContent = rotationSlider.value + '°';
}); 