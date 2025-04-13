// DOM Elements
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const watermarkedPreview = document.getElementById('watermarkedPreview');
const controls = document.getElementById('controls');
const applyWatermarkBtn = document.getElementById('applyWatermark');
const downloadBtn = document.getElementById('downloadBtn');
const watermarkTextInput = document.getElementById('watermarkText');
const designTypeSelect = document.getElementById('designType');
const customDesignGroup = document.getElementById('customDesignGroup');
const customDesignInput = document.getElementById('customDesign');
const textSpacingInput = document.getElementById('textSpacing');
const textSpacingValue = document.getElementById('textSpacingValue');
const watermarkOpacityInput = document.getElementById('watermarkOpacity');
const opacityValue = document.getElementById('opacityValue');
const textSizeInput = document.getElementById('textSize');
const textSizeValue = document.getElementById('textSizeValue');
const watermarkDensityInput = document.getElementById('watermarkDensity');
const densityValue = document.getElementById('densityValue');
const colorValue = document.getElementById('colorValue');
const colorPalette = document.getElementById('colorPalette');
const watermarkRotationInput = document.getElementById('watermarkRotation');
const rotationValue = document.getElementById('rotationValue');
const themeToggle = document.getElementById('themeToggle');

// Variables
let originalImage = null;
let isDarkMode = false;
let currentColor = "#00BCD4"; // Default color

// Event Listeners
imageInput.addEventListener('change', handleImageUpload);
applyWatermarkBtn.addEventListener('click', applyWatermark);
downloadBtn.addEventListener('click', downloadImage);
watermarkTextInput.addEventListener('input', applyWatermark);
designTypeSelect.addEventListener('change', handleDesignTypeChange);
customDesignInput.addEventListener('input', applyWatermark);
textSpacingInput.addEventListener('input', handleTextSpacingChange);
watermarkOpacityInput.addEventListener('input', handleOpacityChange);
textSizeInput.addEventListener('input', handleTextSizeChange);
watermarkDensityInput.addEventListener('input', handleDensityChange);
watermarkRotationInput.addEventListener('input', handleRotationChange);
themeToggle.addEventListener('click', toggleDarkMode);

// Set up color palette
document.querySelectorAll('.palette-color').forEach(colorEl => {
    colorEl.addEventListener('click', function() {
        // Remove active class from all colors
        document.querySelectorAll('.palette-color').forEach(el => {
            el.classList.remove('active');
        });
        
        // Add active class to clicked color
        this.classList.add('active');
        
        // Set current color and update display
        currentColor = this.getAttribute('data-color');
        updateColorDisplay();
        
        // Apply watermark with new color
        applyWatermark();
    });
});

// Dark mode functionality
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggle.title = "Toggle Light Mode";
    } else {
        document.body.classList.remove('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.title = "Toggle Dark Mode";
    }
    
    // Save preference to local storage
    localStorage.setItem('darkMode', isDarkMode);
}

// Load dark mode preference
function loadDarkModePreference() {
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedDarkMode === 'true') {
        isDarkMode = true;
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggle.title = "Toggle Light Mode";
    }
}

// Initialize value displays
function initializeValueDisplays() {
    handleTextSpacingChange();
    handleOpacityChange();
    handleTextSizeChange();
    handleDensityChange();
    updateColorDisplay();
    handleRotationChange();
}

// Value display handlers
function handleTextSpacingChange() {
    textSpacingValue.textContent = textSpacingInput.value;
    applyWatermark();
}

function handleOpacityChange() {
    opacityValue.textContent = `${watermarkOpacityInput.value}%`;
    applyWatermark();
}

function handleTextSizeChange() {
    textSizeValue.textContent = `${textSizeInput.value}px`;
    applyWatermark();
}

function handleDensityChange() {
    densityValue.textContent = watermarkDensityInput.value;
    applyWatermark();
}

function updateColorDisplay() {
    colorValue.textContent = currentColor.toUpperCase();
    colorValue.style.backgroundColor = currentColor;
    
    // Calculate text color based on brightness
    const hex = currentColor.substring(1);
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Change text color based on background brightness
    colorValue.style.color = brightness > 128 ? '#000' : '#fff';
}

function handleRotationChange() {
    rotationValue.textContent = `${watermarkRotationInput.value}°`;
    applyWatermark();
}

// Show/hide custom design input based on selection
function handleDesignTypeChange() {
    if (designTypeSelect.value === 'custom') {
        customDesignGroup.style.display = 'flex';
    } else {
        customDesignGroup.style.display = 'none';
    }
    applyWatermark();
}

// Functions
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            originalImage = img;
            
            // Display original image
            imagePreview.innerHTML = '';
            const displayImg = document.createElement('img');
            displayImg.src = e.target.result;
            imagePreview.appendChild(displayImg);
            
            // Show controls
            controls.style.display = 'block';
            
            // Initialize value displays
            initializeValueDisplays();
            
            // Apply watermark
            applyWatermark();
        };
        img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
}

function getDesignSymbol() {
    const designType = designTypeSelect.value;
    switch(designType) {
        case 'none':
            return '';
        case 'bullet':
            return ' • ';
        case 'star':
            return ' ★ ';
        case 'diamond':
            return ' ◆ ';
        case 'hearts':
            return ' ❤ ';
        case 'line':
            return ' ― ';
        case 'custom':
            return ` ${customDesignInput.value || '•'} `;
        default:
            return '';
    }
}

function calculateAdaptiveFontSize(imageWidth, imageHeight, density) {
    // Calculate a base font size that scales with the image dimensions
    const smallerDimension = Math.min(imageWidth, imageHeight);
    
    // The base size is influenced by the density (more watermarks = smaller text)
    let adaptiveSize = smallerDimension / (10 + density * 5);
    
    // Apply the user's size preference as a percentage adjustment
    const userSizePercentage = textSizeInput.value / 30; // Normalize around the middle value
    adaptiveSize = adaptiveSize * userSizePercentage;
    
    // Ensure a reasonable minimum and maximum size
    adaptiveSize = Math.max(adaptiveSize, 12);
    adaptiveSize = Math.min(adaptiveSize, smallerDimension / 4);
    
    return Math.round(adaptiveSize);
}

function applyWatermark() {
    if (!originalImage) return;

    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match image
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    
    // Draw original image
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    
    // Get watermark settings
    const watermarkText = watermarkTextInput.value || 'WATERMARK';
    const designSymbol = getDesignSymbol();
    const userTextSpacing = parseInt(textSpacingInput.value);
    const opacity = watermarkOpacityInput.value / 100;
    const density = parseInt(watermarkDensityInput.value);
    const color = currentColor;
    const rotation = parseInt(watermarkRotationInput.value);
    
    // Calculate adaptive font size based on image dimensions
    const adaptiveFontSize = calculateAdaptiveFontSize(canvas.width, canvas.height, density);
    
    // Calculate adaptive spacing based on image size and font size
    const adaptiveSpacing = Math.max(1, Math.floor(userTextSpacing * (adaptiveFontSize / 20)));
    
    // Format the watermark with design
    let formattedText = watermarkText;
    if (designSymbol && designTypeSelect.value !== 'none') {
        // Create text with design and spacing
        const spaces = ' '.repeat(adaptiveSpacing);
        formattedText = `${watermarkText}${spaces}${designSymbol}${spaces}`;
    }
    
    // Apply watermark pattern
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.font = `${adaptiveFontSize}px Arial`;
    
    // Calculate the number of watermarks needed to cover the image
    // This is affected by density but ensures proper coverage regardless of image size
    const rows = Math.ceil((density + 1) * 1.5);
    const cols = Math.ceil((density + 1) * 1.5);
    
    // Calculate the gap between watermarks
    const xGap = canvas.width / cols;
    const yGap = canvas.height / rows;
    
    // Create diagonal pattern of watermarks
    for (let y = -1; y <= rows; y++) {
        for (let x = -1; x <= cols; x++) {
            const xPos = x * xGap;
            const yPos = y * yGap;
            
            ctx.save();
            ctx.translate(xPos, yPos);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.fillText(formattedText, 0, 0);
            ctx.restore();
        }
    }
    
    ctx.restore();
    
    // Display watermarked image
    watermarkedPreview.innerHTML = '';
    watermarkedPreview.appendChild(canvas);
    
    // Show download button
    downloadBtn.style.display = 'inline-block';
}

function downloadImage() {
    if (!watermarkedPreview.querySelector('canvas')) return;
    
    const canvas = watermarkedPreview.querySelector('canvas');
    const image = canvas.toDataURL('image/png');
    
    const link = document.createElement('a');
    link.download = 'watermarked-image.png';
    link.href = image;
    link.click();
}

// Initialize app
function init() {
    // Load dark mode preference
    loadDarkModePreference();
    
    // Set initial value displays
    initializeValueDisplays();
    
    // Custom watermark behavior
    handleDesignTypeChange();
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', init); 