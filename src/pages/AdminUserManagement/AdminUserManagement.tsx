import { useNavigate } from "react-router-dom";
import "./AdminUserManagement.css";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { userApi } from "../../api-helpers";
import { CustomerProfile, SellerProfile, User, UserRole } from "../../types/user";
import SellerInfoModal from "../../components/SellerInfoModal/SellerInfoModal";

function AdminUserManagement() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState("All");
  const [verificationStatusFilter, setVerificationStatusFilter] = useState("All");
  const [sellerModalOpen, setSellerModalOpen] = useState<{
    [sellerId: string]: boolean;
  }>({});

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      navigate("/");
      return;
    }

    if (user) {
      if (user.role !== UserRole.ADMIN) {
        navigate("/");
        return;
      }
    }

    (async () => {
      try {
        const response = await userApi.query(accessToken);

        if (!response.status) {
          navigate("/");
          return;
        }

        if (response.data) {
          setUsers(response.data);
          setFilteredUsers(response.data);
        }
      } catch (error) {
        alert(error);
      }
    })();
  }, [user]);

  const filterUsers = () => {
    let filteredUsers = [...users];

    if (roleFilter !== "All") {
      filteredUsers = filteredUsers.filter((user) => user.role === roleFilter);
    }

    if (verificationStatusFilter !== "All") {
      filteredUsers = filteredUsers.filter(
        (user) => user.verified === (verificationStatusFilter === "true")
      );
    }

    setFilteredUsers(filteredUsers);
  };

  const acknowledge = async (id: string) => {
    const accessToken = localStorage.getItem("accessToken") as string;

    if (!confirm("Are you sure you want to acknowledge this user?")) {
      return;
    }

    try {
      const response = await userApi.acknowledge(id, accessToken);

      if (!response.status) {
        navigate("/signin");
      }

      const verificationStatusElement = document.getElementById(
        `verification-status-${id}`
      ) as HTMLParagraphElement;
      const acknowledgeButtonElement = document.getElementById(
        `acknowledge-button-${id}`
      ) as HTMLButtonElement;
      const denyButtonElement = document.getElementById(`deny-button-${id}`) as HTMLButtonElement;

      verificationStatusElement.innerText = "Yes";
      acknowledgeButtonElement.style.display = "none";
      denyButtonElement.style.display = "block";
    } catch (error) {
      alert(error);
    }
  };

  const deny = async (id: string) => {
    const accessToken = localStorage.getItem("accessToken") as string;

    if (!confirm("Are you sure you want to deny this user?")) {
      return;
    }

    try {
      const response = await userApi.deny(id, accessToken);

      if (!response.status) {
        navigate("/signin");
      }

      const verificationStatusElement = document.getElementById(
        `verification-status-${id}`
      ) as HTMLTableCellElement;
      const acknowledgeButtonElement = document.getElementById(
        `acknowledge-button-${id}`
      ) as HTMLButtonElement;
      const denyButtonElement = document.getElementById(`deny-button-${id}`) as HTMLButtonElement;

      verificationStatusElement.innerText = "No";
      acknowledgeButtonElement.style.display = "block";
      denyButtonElement.style.display = "none";
    } catch (error) {
      alert(error);
    }
  };

  const openSellerInfoModal = (sellerId: string, userRole: UserRole) => {
    if (userRole === UserRole.SELLER && !sellerModalOpen[sellerId]) {
      const modal = document.getElementById(`M${sellerId}`) as HTMLDivElement;
      modal.style.display = "block";
      setSellerModalOpen({ ...sellerModalOpen, [sellerId]: true });
    }
  };

  const closeSellerInfoModal = (sellerId: string) => {
    const modal = document.getElementById(`M${sellerId}`) as HTMLDivElement;
    modal.style.display = "none";
    setSellerModalOpen({ ...sellerModalOpen, [sellerId]: false });
  };

  return (
    <div className="admin-user-management-container">
      <h2>Registered Users</h2>

      <div className="filter-options">
        <div className="filter">
          <label htmlFor="roleFilter">Filter by Role:</label>
          <select
            id="roleFilter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Customer">Customer</option>
            <option value="Seller">Seller</option>
          </select>
        </div>

        <div className="filter" style={{ marginLeft: "70px" }}>
          <label htmlFor="verifiedFilter">Filter by Verification:</label>
          <select
            id="verifiedFilter"
            value={verificationStatusFilter}
            onChange={(e) => setVerificationStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="true">Verified</option>
            <option value="false">Not Verified</option>
          </select>
        </div>

        <button onClick={filterUsers} className="filter-users">
          Apply Filters
        </button>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
            <th>Verified</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr
              key={user.id}
              style={{
                cursor: user.role === UserRole.SELLER ? "pointer" : "default",
              }}
            >
              <td
                onClick={() => openSellerInfoModal(user.id, user.role)}
                title={
                  user.role === UserRole.SELLER
                    ? "Click to view seller details and manage their categories"
                    : ""
                }
              >
                {user.id}
              </td>
              <td
                onClick={() => openSellerInfoModal(user.id, user.role)}
                title={
                  user.role === UserRole.SELLER
                    ? "Click to view seller details and manage their categories"
                    : ""
                }
              >
                {user.email}
              </td>
              <td
                onClick={() => openSellerInfoModal(user.id, user.role)}
                title={
                  user.role === UserRole.SELLER
                    ? "Click to view seller details and manage their categories"
                    : ""
                }
              >
                {user.role === UserRole.CUSTOMER ? (
                  `${(user.profile as CustomerProfile).firstName} ${
                    (user.profile as CustomerProfile).lastName
                  }`
                ) : (
                  <>
                    <SellerInfoModal
                      sellerId={user.id}
                      sellerInfo={user.profile as SellerProfile}
                      onClose={closeSellerInfoModal}
                    />
                    {(user.profile as SellerProfile).name}
                  </>
                )}
              </td>
              <td onClick={() => openSellerInfoModal(user.id, user.role)}>{user.role}</td>
              <td onClick={() => openSellerInfoModal(user.id, user.role)}>
                <span id={`verification-status-${user.id}`}>{user.verified ? "Yes" : "No"}</span>
              </td>
              <td>
                <button
                  id={`deny-button-${user.id}`}
                  className="toggle-verification deny"
                  style={{ display: user.verified ? "block" : "none" }}
                  onClick={() => deny(user.id)}
                >
                  Deny
                </button>
                <button
                  id={`acknowledge-button-${user.id}`}
                  className="toggle-verification acknowledge"
                  style={{ display: user.verified ? "none" : "block" }}
                  onClick={() => acknowledge(user.id)}
                >
                  Acknowledge
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUserManagement;
