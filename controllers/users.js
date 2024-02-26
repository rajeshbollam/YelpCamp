const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username }); //we are not storing the password directly in the database.
    const registeredUser = await User.register(user, password); // here we are making use of the passport's register method to register a user. It takes the password, hashes it, adds salt and then stores the encrypted password in the database.
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to YelpCamp");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    // Instead of the default error that catchAsync method provides, we are over-writing that error to make it more user-friendly.
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  // made use of the passport's authenticate method to verify the user, here, we implement 'local' strategy in passport module and enabled flash error message if any errors and redirect page if error.
  req.flash("success", "welcome back!");
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    //logout method is provided by passport by default and is automatically added to the req object.
    if (err) {
      //in the recent upgrade, logout function requires a callback function, so added one.
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
};
