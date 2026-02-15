import db from "../config/db.js";

// Initialize with default values (will be overwritten by DB on first load)
let maintenanceState = {
  isActive: false,
  message:
    "System is undergoing scheduled maintenance. We expect to be back online shortly.",
  updatedAt: null,
};

// Load initial state from database when module loads
const initializeMaintenanceState = async () => {
  try {
    // Check if settings exist
    const result = await db.query(
      "SELECT is_active, message, updated_at FROM maintenance_settings WHERE id = 1",
    );

    if (result.rows.length > 0) {
      // Update in-memory state from database
      maintenanceState = {
        isActive: result.rows[0].is_active,
        message: result.rows[0].message,
        updatedAt: result.rows[0].updated_at,
      };
    } else {
      // Insert default settings if not exists
      await db.query(
        "INSERT INTO maintenance_settings (id, is_active, message) VALUES (1, $1, $2)",
        [maintenanceState.isActive, maintenanceState.message],
      );
    }
  } catch (error) {
    console.error("Error initializing maintenance state:", error);
    // Keep default values if DB fails
  }
};

// Call initialization immediately
initializeMaintenanceState();

const maintenanceModel = async ({ isActive, message }) => {
  try {
    // Validate inputs
    if (typeof isActive !== "boolean") {
      throw new Error("isActive must be a boolean");
    }

    const updatedAt = new Date();

    // Update database first
    await db.query(
      `UPDATE maintenance_settings 
       SET is_active = $1, 
           message = COALESCE($2, message), 
           updated_at = $3 
       WHERE id = 1`,
      [isActive, message, updatedAt],
    );

    // Update the in-memory state (same as your original concept)
    maintenanceState = {
      isActive,
      message: message || maintenanceState.message,
      updatedAt: updatedAt,
    };

    return maintenanceState; // Return same format as your original
  } catch (error) {
    console.error("Maintenance error:", error);
    throw error;
  }
};

const maintenanceCheckerModel = async () => {
  try {
    // Optional: Refresh from DB to ensure latest data
    // You can comment this out if you want pure in-memory like your original
    const result = await db.query(
      "SELECT is_active, message, updated_at FROM maintenance_settings WHERE id = 1",
    );

    if (result.rows.length > 0) {
      maintenanceState = {
        isActive: result.rows[0].is_active,
        message: result.rows[0].message,
        updatedAt: result.rows[0].updated_at,
      };
    }

    return { ...maintenanceState }; // Same as your original - returns a copy
  } catch (error) {
    console.error("maintenanceCheckerModel error:", error);
    // Fallback to in-memory state if DB fails
    return { ...maintenanceState };
  }
};

export { maintenanceModel, maintenanceCheckerModel };
