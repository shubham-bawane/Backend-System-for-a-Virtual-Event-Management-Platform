const sendRegistrationEmail = async (email, name) => {
  return Promise.resolve({
    to: email,
    subject: 'Registration successful',
    message: `Welcome ${name}! Your account has been created successfully.`,
  });
};

module.exports = {
  sendRegistrationEmail,
};
