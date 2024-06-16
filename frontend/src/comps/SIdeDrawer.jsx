import React from "react";

const SideDrawer = ({ users, setRecipientId }) => {
  return (
    <div
      style={{
        width: "250px",
        padding: "10px",
        borderRight: "1px solid #ccc",
        height: "100vh",
      }}
    >
      <h2>Online Users</h2>
      <ul>
        {users.map((user, index) => (
          <li
            key={index}
            onClick={() => setRecipientId(user)}
            style={{
              cursor: "pointer",
              padding: "5px",
              borderBottom: "1px solid #ccc",
            }}
          >
            {user}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideDrawer;
