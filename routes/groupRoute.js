const express = require('express');
const router = express.Router();
const authentication = require('../middleware/auth');
const groupController = require('../controllers/groupController');

router.post('/createGroup', authentication.authenticated, groupController.createGroup);

router.get('/group-names', groupController.getGroupNames);

router.get('/group-chat/:id', groupController.groupChatPage);

router.get('/groupusers', groupController.groupUsers);

router.get('/groups/:groupId/members',groupController.getGroupMembers);

router.delete('/groups/:Group_Id/delete/:userId', groupController.deleteUser);

router.put('/groups/:Group_Id/makeAdmin/:userId', groupController.makeaAdmin);

router.post('/groups/:Group_Id/addUser',groupController.addNewUser);

// // Route to promote a user to admin within a group
// router.post('/groups/:groupId/makeAdmin/:userId', async (req, res) => {
//   const groupId = req.params.groupId;
//   const userId = req.params.userId;

//   try {
//     const group = await Group.findByPk(groupId);
//     const user = await User.findByPk(userId);

//     if (!group || !user) {
//       return res.status(404).json({ message: 'Group or user not found' });
//     }

//     // Check if the user is already an admin
//     const isAdmin = await GroupUser.findOne({
//       where: {
//         GroupId: groupId,
//         UserId: userId,
//         isAdmin: true,
//       },
//     });

//     if (isAdmin) {
//       return res.status(400).json({ message: 'User is already an admin of the group' });
//     }

//     // Update the GroupUser model to indicate the user's admin status
//     await GroupUser.update({ isAdmin: true }, {
//       where: {
//         GroupId: groupId,
//         UserId: userId,
//       },
//     });

//     res.status(200).json({ message: 'User promoted to admin successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

module.exports=router;
