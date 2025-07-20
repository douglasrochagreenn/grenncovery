export const routes = {
  getMe: () => "user/get-me",
  profilePicture: () => "user/profile-picture",
  editProfile: (user_id: string) => `user/edit-profile/${user_id}`,
};
