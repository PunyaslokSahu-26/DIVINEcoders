import joblib
from sklearn.ensemble import RandomForestRegressor

# Dummy training data (replace with real data)
X = [[75, 10, 30, 4.5], [50, 20, 15, 3.8]]
y = [4.6, 4.1]

model = RandomForestRegressor()
model.fit(X, y)

joblib.dump(model, "model/performance_model.pkl")
