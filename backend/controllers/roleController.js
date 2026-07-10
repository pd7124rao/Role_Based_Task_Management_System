import User from "../models/users.js";

const RoleHierarchy = {
  "employee": 1,
  "team-lead": 2,
  "manager": 3,
  "admin": 4
};

export const changeRole = async (req, res) => {
  const { user_id, newRole } = req.body;

  if (!user_id || !newRole) {
    return res.status(400).json({
      message: "Missing parameters: 'user_id' and 'newRole' are required.",
    });
  }

  try {
    const targetUser = await User.findById(user_id);
    const requestor = await User.findById(req.user.id);

    if (!targetUser || !requestor) {
      return res.status(404).json({ message: "User not found." });
    }

    const targetRole = targetUser.role;
    const requestorRole = requestor.role;

    const requestorRank = RoleHierarchy[requestorRole];
    const targetRank = RoleHierarchy[targetRole];
    const newRoleRank = RoleHierarchy[newRole];

    if (targetRole === "admin") {
      return res.status(403).json({ message: "Admin role cannot be changed." });
    }

    if (requestorRank <= targetRank) {
      return res.status(403).json({ message: "You can only change roles of users with lower authority." });
    }

    if (newRoleRank >= requestorRank) {
      return res.status(403).json({ message: "You can only assign roles lower than your own." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      { role: newRole },
      { new: true,runValidators:true }
    );

    res.status(200).json({
      message: "Role changed successfully.",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
};
