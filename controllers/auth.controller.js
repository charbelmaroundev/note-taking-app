const signup = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const newUser = await User.create({
    role,
    name,
    email,
    password,
  });

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
};

module.exports = { signup };
