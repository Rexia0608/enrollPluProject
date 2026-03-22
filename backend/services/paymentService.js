const paymentService = async (data) => {
  try {
    let pass = data;
    return pass;
  } catch (error) {
    console.error("setPayment error:", error);
    throw error;
  }
};

export { paymentService };
