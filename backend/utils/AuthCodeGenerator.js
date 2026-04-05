const authCodeGenerator = async () => {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  return { otp, otpExpires };
};

export default authCodeGenerator;
