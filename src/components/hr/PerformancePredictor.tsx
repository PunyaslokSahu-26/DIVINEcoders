import React, { useState } from "react";
import { predictRating } from "@/lib/mlApi";

type Props = {
  progress: number;
  deadline: string;
  started: string;
  avgRating: number;
};

function calcDays(date1: string, date2: string) {
  return Math.ceil(
    (new Date(date1).getTime() - new Date(date2).getTime()) / (1000 * 3600 * 24)
  );
}

const PerformancePredictor: React.FC<Props> = ({ progress, deadline, started, avgRating }) => {
  const [predictedRating, setPredictedRating] = useState<number | null>(null);

  const handlePredict = async () => {
    const daysRemaining = calcDays(deadline, new Date().toISOString());
    const daysWorked = calcDays(new Date().toISOString(), started);

    const prediction = await predictRating({ progress, daysRemaining, daysWorked, avgRating });
    setPredictedRating(prediction);
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-lg font-semibold">Predict Performance</h2>
      <button
        onClick={handlePredict}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Predict
      </button>
      {predictedRating !== null && (
        <p className="mt-4 text-green-600 font-medium">
          Predicted Rating: ⭐ {predictedRating}
        </p>
      )}
    </div>
  );
};

export default PerformancePredictor;
