document.addEventListener('DOMContentLoaded', () => {
    const audioUpload = document.getElementById('audioUpload');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const audioPreview = document.getElementById('audioPreview');
    const predictBtn = document.getElementById('predictBtn');
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');
    const emotionBadge = document.getElementById('emotionBadge');

    let selectedFile = null;

    audioUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            selectedFile = file;
            fileName.textContent = file.name;
            
            // Create object URL for preview
            const url = URL.createObjectURL(file);
            audioPreview.src = url;
            audioPreview.hidden = false;
            
            fileInfo.classList.remove('hidden');
            predictBtn.classList.remove('disabled');
            predictBtn.disabled = false;
            
            // Hide previous results
            result.classList.add('hidden');
        }
    });

    predictBtn.addEventListener('click', async () => {
        if (!selectedFile) return;

        // UI state: loading
        predictBtn.classList.add('hidden');
        loading.classList.remove('hidden');
        result.classList.add('hidden');

        const formData = new FormData();
        formData.append('audio', selectedFile);

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                emotionBadge.textContent = data.emotion;
                emotionBadge.classList.remove('error');
            } else {
                emotionBadge.textContent = data.error || 'Error occurred';
                emotionBadge.classList.add('error');
            }
        } catch (error) {
            console.error('Error during prediction:', error);
            emotionBadge.textContent = 'Server connection failed';
            emotionBadge.classList.add('error');
        } finally {
            // UI state: done
            loading.classList.add('hidden');
            predictBtn.classList.remove('hidden');
            result.classList.remove('hidden');
        }
    });
});
