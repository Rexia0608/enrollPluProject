// Initialize with default values
let maintenanceState = {
  isActive: false, // Initialize as boolean, not Boolean constructor
  message:
    "System is undergoing scheduled maintenance. We expect to be back online shortly.",
  updatedAt: null,
};

const maintenanceModel = async ({ isActive, message }) => {
  try {
    // Validate inputs
    if (typeof isActive !== "boolean") {
      throw new Error("isActive must be a boolean");
    }

    // Update the maintenance state
    maintenanceState = {
      isActive,
      message: message || maintenanceState.message,
      updatedAt: new Date(),
    };

    console.log("Maintenance state updated:", maintenanceState);
    return maintenanceState;
  } catch (error) {
    console.error("Maintenance error:", error);
    throw error;
  }
};

const maintenanceCheckerModel = async () => {
  try {
    return { ...maintenanceState };
  } catch (error) {
    console.error("maintenanceCheckerModel error:", error);
    throw error;
  }
};

export { maintenanceModel, maintenanceCheckerModel };
