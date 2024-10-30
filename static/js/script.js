// Select necessary elements
const photosInput = document.getElementById('photos');
const previewContainer = document.getElementById('preview');
const uploadForm = document.getElementById('uploadForm');

// Clear and preview selected images
photosInput.addEventListener('change', function() {
    previewContainer.innerHTML = ''; // Clear previous previews
    const files = Array.from(photosInput.files); // Ensure an array of files is created

    // Loop through each selected image
    files.forEach(file => {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file); // Create preview URL for each image
        img.classList.add('preview-image');
        img.style.width = '150px'; // Adjust size
        img.style.margin = '10px';
        previewContainer.appendChild(img); // Add image preview to the container
    });
});

// Submit form with selected images
uploadForm.addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent default form submission

    const formData = new FormData();
    const files = Array.from(photosInput.files); // Get array of files from input

    // Check if enough images are selected
    if (files.length < 2) {
        alert("Please select at least two images.");
        return;
    }

    // Add each selected file to FormData
    files.forEach((file) => {
        formData.append('photos', file); // Append each image to formData
    });

    // Send formData with images to backend
    try {
        const response = await fetch('/merge', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error("Server error occurred");

        // Display the merged result
        const blob = await response.blob();
        const imgURL = URL.createObjectURL(blob);

        previewContainer.innerHTML = ''; // Clear previews after merging
        const resultImg = document.createElement('img');
        resultImg.src = imgURL;
        resultImg.classList.add('merged-image');
        resultImg.style.width = '100%';
        previewContainer.appendChild(resultImg);
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while merging photos. Please try again.");
    }
});