import { checkIfTheUserExist } from "./usersModel.js";

const verifyingOtpModel = async (data) => {
  try {
    const result = await checkIfTheUserExist(data.email);

    if (!result.length > 1) {
      return { error: "Otp not matched" };
    }

    if (result.email == data.email && result.email_otp == data.otp) {
      return {
        message: `Email verified will proceed to login page ${data.email}`,
        email: data.email,
      };
    }
  } catch (error) {
    console.error("Verifying OTP error:", error);
    throw error;
  }
};

export { verifyingOtpModel };
