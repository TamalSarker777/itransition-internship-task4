import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import {
  BsFillLockFill,
  BsFillUnlockFill,
  BsCheckCircleFill,
} from "react-icons/bs";
import { RiDeleteBinFill } from "react-icons/ri";

function HomePage() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");

  const navigate = useNavigate();

  //--------------------------------Handle Logout---------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
    axios
      .get("http://localhost:5000/homepage", {
        headers: { authorization: token },
      })
      .then((response) => {
        setName(response.data.name);
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/table")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  });

  //Operations  , Handle checkbox
  const [selectedUsers, setSelectedUsers] = useState([]);
  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter((id) => id !== userId);
      } else {
        return [...prevSelected, userId];
      }
    });
  };

  ///----------------------------------Handle delete--------------------------------
  const handleDelete = async () => {
    try {
      await axios.post("http://localhost:5000/deleteUsers", {
        userids: selectedUsers,
      });
      alert("Users deleted successfully!");

      //Update with new users and remove previous selected users
      const newUsers = users.filter((user) => !selectedUsers.includes(user.id));
      setUsers(newUsers);
      setSelectedUsers([]);
    } catch (error) {
      alert("!..Failed to delete users..!");
    }
  };

  //--------------------------Handle Block----------------------------------

  const handleBlock = async () => {
    try {
      await axios.post("http://localhost:5000/blockUsers", {
        userids: selectedUsers,
      });
      alert("Users Blocked Successfully!");

      //remove previous selected users
      setSelectedUsers([]);
    } catch (error) {
      alert("!..Failed to block users..!");
    }
  };
  //--------------------------Handle Active----------------------------------

  const handleActive = async () => {
    try {
      await axios.post("http://localhost:5000/activeUsers", {
        userids: selectedUsers,
      });
      alert("Users Activated Successfully!");

      //remove previous selected users
      setSelectedUsers([]);
    } catch (error) {
      alert("!..Failed to Active users..!");
    }
  };

  return (
    <div>
      <Navbar className="bg-body-tertiary" bg="dark">
        <Container>
          <Navbar.Brand href="">
            <h2>
              <strong>Admin Panel</strong>
            </h2>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-center">
            <Navbar.Text>
              Hello, <strong>{name}!</strong>
            </Navbar.Text>
          </Navbar.Collapse>
          <Button
            className="justify-content-end"
            variant="primary"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Container>
      </Navbar>

      <div className="container mt-5">
        <div>
          <Button
            className="btn btn-warning mx-2"
            disabled={selectedUsers.length === 0}
            onClick={handleBlock}
          >
            <BsFillLockFill />
            Block
          </Button>
          <Button
            variant="success"
            className="mx-2"
            disabled={selectedUsers.length === 0}
            onClick={handleActive}
          >
            <BsFillUnlockFill />
            Active
          </Button>
          <Button
            className="btn btn-danger mx-2"
            onClick={handleDelete}
            disabled={selectedUsers.length === 0}
          >
            <RiDeleteBinFill />
          </Button>
        </div>
        <br />
        <table className="table table-bordered">
          <thead>
            <tr>
              <th
                style={{
                  backgroundColor: "green",
                }}
              >
                <BsCheckCircleFill />
              </th>
              <th
                style={{
                  backgroundColor: "black",
                  color: "white",
                }}
              >
                Name
              </th>
              <th
                style={{
                  backgroundColor: "black",
                  color: "white",
                }}
              >
                Email
              </th>
              <th
                style={{
                  backgroundColor: "black",
                  color: "white",
                }}
              >
                Last Login
              </th>
              <th
                style={{
                  backgroundColor: "black",
                  color: "white",
                }}
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleCheckboxChange(user.id)}
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{new Date(user.last_login_time).toLocaleString()}</td>
                <td
                  style={{
                    backgroundColor:
                      user.status === "blocked" ? "red" : "powderblue",
                  }}
                >
                  {user.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HomePage;
