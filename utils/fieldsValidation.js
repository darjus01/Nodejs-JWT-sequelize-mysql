exports.isEmail = (emailString) => {
  let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(emailString);
};

exports.isLtPhone = (phone) => {
  const phoneRegex = new RegExp(/^[\+]?86|3706[0-9]{2}[0-9]{4,6}$/im);
  return phoneRegex.test(phone);
};
