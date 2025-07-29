

function isInvalidBloodPressure(patient) {
  const bloodPressure = patient.blood_pressure;
  if (!bloodPressure || typeof bloodPressure !== 'string' || !bloodPressure.includes('/')) {
    return true;
  }
  const parts = bloodPressure.split('/');
  if (parts.length !== 2 || parts[0] === '' || parts[1] === '') {
    return true;
  }
  const systolic = parseInt(parts[0], 10);
  const diastolic = parseInt(parts[1], 10);
  if (isNaN(systolic) || isNaN(diastolic)) {
    return true;
  }
  
  return false;
}

function isInvalidTemperature(patient) {
  const temp = patient.temperature;

  return temp === null || temp === undefined || typeof temp === 'string' && temp.trim() === '' || isNaN(parseFloat(temp));
}

function isInvalidAge(patient) {
  const age = patient.age;

  return age === null || age === undefined || typeof age === 'string' && age.trim() === '' || isNaN(parseInt(age, 10));
}

function calculateBloodPressureScore(patient) {
  if (isInvalidBloodPressure(patient)) {
    return 0;
  }
  const parts = patient.blood_pressure.split('/');
  const systolic = parseInt(parts[0], 10);
  const diastolic = parseInt(parts[1], 10);

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
  if (isInvalidTemperature(patient)) {
    return 0;
  }

  const tempValue = parseFloat(patient.temperature);
  if (tempValue >= 101.0) {
    return 2;
  }
  if (tempValue >= 99.6) {
    return 1;
  }

  return 0;
}

function calculateAgeScore(patient) {
  if (isInvalidAge(patient)) {
    return 0;
  }

  const ageValue = parseInt(patient.age, 10);
  if (ageValue > 65) {
    return 2;
  }

  return 1;
}

function calculateTotalRisk(patient) {
  const bloodPressureScore = calculateBloodPressureScore(patient);
  const tempScore = calculateTemperatureScore(patient);
  const ageScore = calculateAgeScore(patient);
  return bloodPressureScore + tempScore + ageScore;
}

module.exports = {
  calculateTotalRisk,
  isInvalidBloodPressure,
  isInvalidTemperature,
  isInvalidAge
};

