const prisma = require("../../lib/prisma");

const saveProfilePhoto = async (userId, filePath) => {
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      profilePhotoUrl: filePath,
    },
  });

  return updatedUser;
};

module.exports = {
  saveProfilePhoto,
};