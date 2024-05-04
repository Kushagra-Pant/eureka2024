from flask import Flask, render_template, redirect, url_for, request
import tensorflow
from tensorflow import keras

app = Flask(__name__, template_folder='templates')

from keras.models import load_model  
from PIL import Image, ImageOps 
import numpy as np

foodList = [] #example usage: "Pork"
allergenList = [] #example usage: ["vegetarian", "halal"] (this should be the dietary restrictions that it violates)
textBlurbList = [] #TODO 
#@app.route('/')
def index():
	if request.method == 'POST':
		e = request.form['input']
		print("redirecting...")
		return redirect('/search/' + e + '/')
	return render_template('homepage.html')

#@app.route('/image_uploaded/<string:imagename>/')
@app.route('/')
def image_uploaded():
	imagename = "images.jpeg"
# TensorFlow is required for Keras to work
# Install pillow instead of PIL


	# Disable scientific notation for clarity
	np.set_printoptions(suppress=True)

	# Load the model
	model = load_model("keras_model.h5", compile=False)

	# Load the labels
	class_names = open("labels.txt", "r").readlines()

	# Create the array of the right shape to feed into the keras model
	# The 'length' or number of images you can put into the array is
	# determined by the first position in the shape tuple, in this case 1
	data = np.ndarray(shape=(1, 224, 224, 3), dtype=np.float32)

	# Replace this with the path to your image
	image = Image.open(imagename).convert("RGB")

	# resizing the image to be at least 224x224 and then cropping from the center
	size = (224, 224)
	image = ImageOps.fit(image, size, Image.Resampling.LANCZOS)

	# turn the image into a numpy array
	image_array = np.asarray(image)

	# Normalize the image
	normalized_image_array = (image_array.astype(np.float32) / 127.5) - 1

	# Load the image into the array
	data[0] = normalized_image_array

	# Predicts the model
	prediction = model.predict(data)
	index = np.argmax(prediction)
	class_name = class_names[index]
	confidence_score = prediction[0][index]

	# Print prediction and confidence score
	print("Class:", class_name[2:], end="")
	print("Confidence Score:", confidence_score)

	
	return class_name[2:]
if __name__ == '__main__':
	app.run(host = '0.0.0.0', port = 81, debug = True)
