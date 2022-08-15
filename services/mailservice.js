const mail = require('../config/mail');

exports.sendEmail = async (options) => {
  let res = await mail.sendMail(options, (error, info) => {
    if (error) {
      return error;
    }
    return info;
  });
  return res;
};
