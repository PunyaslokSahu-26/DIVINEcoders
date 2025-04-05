from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # So React can call it

model = joblib.load("model/performance_model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    features = np.array([[data["progress"], data["daysRemaining"], data["daysWorked"], data["avgRating"]]])
    prediction = model.predict(features)[0]
    return jsonify({"predictedRating": round(prediction, 2)})

if __name__ == "__main__":
    app.run(debug=True)
