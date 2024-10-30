from flask import Flask, request, send_file, render_template
from PIL import Image
import io

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/merge', methods=['POST'])
def merge_photos():
    uploaded_files = request.files.getlist('photos')
    images = [Image.open(file.stream) for file in uploaded_files]

    if len(images) < 2:
        return "Please upload at least two images", 400

    # Calculate dimensions for merged image
    widths, heights = zip(*(i.size for i in images))
    total_width = sum(widths)
    max_height = max(heights)

    # Create a new blank image for the merged output
    merged_image = Image.new('RGB', (total_width, max_height))

    # Place each image side-by-side in the merged_image
    x_offset = 0
    for img in images:
        merged_image.paste(img, (x_offset, 0))
        x_offset += img.width

    # Save merged image to a bytes buffer
    img_io = io.BytesIO()
    merged_image.save(img_io, 'JPEG')
    img_io.seek(0)

    return send_file(img_io, mimetype='image/jpeg', download_name="merged_image.jpg")

if __name__ == '__main__':
    app.run(debug=True)
