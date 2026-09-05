export const MODULES = {
  PATIENT_MANAGEMENT: "Patient Management",
  STAFF_MANAGEMENT: "Staff Management",
  APPOINTMENT_SCHEDULING: "Appointment Scheduling",
  TOKEN_MANAGEMENT: "Token Management",
  REPORTS_ANALYTICS: "Reports & Analytics",
};

export const MODULE_DEPENDENCIES = {
  [MODULES.PATIENT_MANAGEMENT]: [],

  [MODULES.STAFF_MANAGEMENT]: [],

  [MODULES.APPOINTMENT_SCHEDULING]: [
    MODULES.PATIENT_MANAGEMENT,
    MODULES.STAFF_MANAGEMENT,
  ],

  [MODULES.TOKEN_MANAGEMENT]: [
    MODULES.PATIENT_MANAGEMENT,
    MODULES.STAFF_MANAGEMENT,
  ],

  [MODULES.REPORTS_ANALYTICS]: [],
};

export const resolveModules = (requestedModules = []) => {
  const resolved = new Set();

  const addModule = (moduleName) => {
    // Ignore unknown modules.
    if (!MODULE_DEPENDENCIES[moduleName]) {
      return;
    }

    resolved.add(moduleName);

    const dependencies =
      MODULE_DEPENDENCIES[moduleName] || [];

    dependencies.forEach((dependency) => {
      addModule(dependency);
    });
  };

  requestedModules.forEach((moduleName) => {
    addModule(moduleName);
  });

  return Array.from(resolved);
};