import axios from "axios";
import { useEffect, useState } from "react";

const Sidebar = ({ onClick }) => {
  const [activeUsers, setActiveUsers] = useState([]);
  const currentUser = localStorage.getItem("userId");
  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/users/active/${currentUser}`
        );
        setActiveUsers(response.data);
      } catch (error) {
        console.error("Error fetching active users", error);
      }
    };

    fetchActiveUsers();
  }, [currentUser]);

  return (
    <div className="side-drawer">
      <h2>Active Users</h2>
      <ul>
        {activeUsers.map((user) => (
          <li key={user.userId}>{user.userId}</li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
