import React from "react";

const SideDrawer = ({ users, setRecipientId }) => {
  return (
    <div className="side-drawer">
      <h2>Online Users</h2>
      <ul>
        {users.map((user, index) => (
          <li
            key={index}
            onClick={() => setRecipientId(user.userId)}
            style={{
              cursor: "pointer",
              padding: "5px",
              borderBottom: "1px solid #ccc",
            }}
          >
            {user.userName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideDrawer;
