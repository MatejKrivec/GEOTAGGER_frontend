interface UserInterface {
    id: number;
    username: string;
    email: string;
    password?: string;
    profilePic?: string;
    points: number;
  }

  export default UserInterface;