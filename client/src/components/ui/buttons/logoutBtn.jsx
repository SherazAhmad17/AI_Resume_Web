import { useAuth } from "../../../hooks/authContext";
import { UserApi } from "../../../api/UserApi";

const LogoutButton = () => {

  const { setUser, setAccessToken } = useAuth();

  const handleLogout = async () => {
    try {
      await UserApi.logout();

      setUser(null);
      setAccessToken(null);

      console.log("Logged out ✅");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;