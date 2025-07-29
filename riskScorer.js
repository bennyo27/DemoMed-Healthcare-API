
function calculateBloodPressureScore(patient) {
  const bloodPressure = patient.blood_pressure;
  if (!bloodPressure || typeof bloodPressure !== 'string' || !bloodPressure.includes('/')) {
    return 0;
  }

  const parts = bloodPressure.split('/');
  if (parts.length !== 2) {
    return 0;
  }

  const systolic = parseInt(parts[0], 10);
  const diastolic = parseInt(parts[1], 10);

  if (isNaN(systolic) || isNaN(diastolic)) {
    return 0;
  }

  if (systolic >= 140 || diastolic >= 90) {
    return 4;
  }
  if (systolic >= 130 || diastolic >= 80) {
    return 3;
  }
  if (systolic >= 120 && diastolic < 80) {
    return 2;
  }
  if (systolic < 120 && diastolic < 80) {
    return 1;
  }

  return 0;
}

function calculateTemperatureScore(patient) {
  const temp = patient.temperature;
  if (temp === null || temp === undefined || isNaN(parseFloat(temp))) {
    return 0;
  }

  const tempValue = parseFloat(temp);
  if (tempValue >= 101.0) {
    return 2;
  }
  if (tempValue >= 99.6) {
    return 1;
  }
  
  return 0;
}

function calculateAgeScore(patient) {
  const age = patient.age;
  if (age === null || age === undefined || isNaN(parseInt(age, 10))) {
    return 0;
  }

  const ageValue = parseInt(age, 10);
  if (ageValue > 65) {
    return 2;
  }
  if (ageValue >= 40 || ageValue < 40) {
    return 1;
  }
  
  return 0;
}

function calculateTotalRisk(patient) {
  const bloodPressureScore = calculateBloodPressureScore(patient);
  const tempScore = calculateTemperatureScore(patient);
  const ageScore = calculateAgeScore(patient);
  return bloodPressureScore + tempScore + ageScore;
}

module.exports = {
  calculateTotalRisk,
  calculateBloodPressureScore,
  calculateTemperatureScore,
  calculateAgeScore
};
