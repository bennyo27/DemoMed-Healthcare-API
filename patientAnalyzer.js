
const { calculateTotalRisk, isInvalidBloodPressure, isInvalidTemperature, isInvalidAge } = require('./riskScorer');

function analyzePatients(patients) {
  const highRiskPatients = [];
  const feverPatients = [];
  const dataQualityIssues = [];

  patients.forEach(patient => {
    const totalRisk = calculateTotalRisk(patient);
    if (totalRisk >= 4) {
      highRiskPatients.push(patient.patient_id);
    }

    if (patient.temperature && parseFloat(patient.temperature) >= 99.6) {
      feverPatients.push(patient.patient_id);
    }

    if (isInvalidBloodPressure(patient) || isInvalidTemperature(patient) || isInvalidAge(patient)) {
      dataQualityIssues.push(patient.patient_id);
    }
  });

  return {
    highRiskPatients,
    feverPatients,
    dataQualityIssues
  };
}

module.exports = { analyzePatients };
