import "./Orders.css";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { orderApi } from "../../api-helpers";
import { useNavigate } from "react-router-dom";
import { OrderResponse } from "../../types/api-responses";
import { OrderStatus } from "../../types/order";
import { timestampToDate } from "../../utility-functions";
import OrderDetailsModal from "../../components/OrderDetailsModal/OrderDetailsModal";
import { UserContext } from "../../contexts/UserContext";
import { UserRole } from "../../types/user";

function CustomerOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderResponse[]>([]);
  const [statusFilter, setFilter] = useState<string>("All");
  const [updatedStatus, setUpdatedStatus] = useState<{
    [orderId: string]: OrderStatus;
  }>({});
  const { user } = useContext(UserContext);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      navigate("/");
      return;
    }

    if (user) {
      if (user.role !== UserRole.CUSTOMER && user.role !== UserRole.SELLER) {
        navigate("/");
      }
    }

    (async () => {
      if (orders.length === 0) {
        try {
          const response = await orderApi.getListOfOrders({}, accessToken);

          if (!response.status) {
            navigate("/");
            return;
          }

          if (response.data) {
            setOrders(response.data);
            setFilteredOrders(response.data);
          }
        } catch (error) {
          return;
        }
      }
    })();
  }, [user]);

  const filterOrders = (event: ChangeEvent<HTMLSelectElement>) => {
    const newStatusFilter = event.target.value;
    setFilter(newStatusFilter);
    setFilteredOrders(
      newStatusFilter === "All"
        ? orders
        : orders.filter((order) => order.status === newStatusFilter)
    );
  };

  const openOrderDetailsModal = (orderId: string) => {
    const modal = document.getElementById(`M${orderId}`) as HTMLDivElement;
    modal.style.display = "block";
  };

  const cancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      const response = await orderApi.cancelOrder(
        orderId,
        localStorage.getItem("accessToken") as string
      );

      if (!response.status) {
        navigate("/");
        return;
      }

      setOrders(
        orders.map((order) => {
          if (order.id === orderId) {
            return { ...order, status: OrderStatus.CANCELLED };
          }
          return order;
        })
      );

      setFilteredOrders(
        filteredOrders.map((order) => {
          if (order.id === orderId) {
            return { ...order, status: OrderStatus.CANCELLED };
          }
          return order;
        })
      );
    } catch (error) {
      alert(error);
    }
  };

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>, orderId: string) => {
    setUpdatedStatus({
      ...updatedStatus,
      [orderId]: event.target.value as OrderStatus,
    });
  };

  const handleStatusUpdate = (orderId: string) => {
    const statusElement = document.getElementById(`S${orderId}`) as HTMLTableCellElement;
    const statusDropdown = document.getElementById(`SD${orderId}`) as HTMLTableCellElement;
    const updateButton = document.getElementById(`update-${orderId}`) as HTMLButtonElement;
    const submitButton = document.getElementById(`submit-${orderId}`) as HTMLButtonElement;

    statusElement.style.display = "none";
    statusDropdown.style.display = "block";
    updateButton.style.display = "none";
    submitButton.style.display = "block";
  };

  const updateStatus = async (orderId: string) => {
    const confirmationMessage =
      updatedStatus[orderId] === OrderStatus.CANCELLED
        ? "Are you sure you want to cancel this order? A cancelled order cannot be updated."
        : updatedStatus[orderId] === OrderStatus.COMPLETED
        ? "Are you sure you want to mark this order as completed? A completed order cannot be updated."
        : "";

    if (confirmationMessage) {
      if (!confirm(confirmationMessage)) {
        return;
      }
    }

    if (!updatedStatus[orderId]) {
      return;
    }

    try {
      await orderApi.updateOrder(
        { id: orderId, status: updatedStatus[orderId] },
        localStorage.getItem("accessToken") as string
      );

      setOrders(
        orders.map((order) => {
          if (order.id === orderId) {
            return { ...order, status: updatedStatus[orderId] };
          }
          return order;
        })
      );

      setFilteredOrders(
        filteredOrders.map((order) => {
          if (order.id === orderId) {
            return { ...order, status: updatedStatus[orderId] };
          }
          return order;
        })
      );

      const statusElement = document.getElementById(`S${orderId}`) as HTMLTableCellElement;
      const statusDropdown = document.getElementById(`SD${orderId}`) as HTMLTableCellElement;
      const updateButton = document.getElementById(`update-${orderId}`) as HTMLButtonElement;
      const submitButton = document.getElementById(`submit-${orderId}`) as HTMLButtonElement;

      statusElement.style.marginTop = "35px";
      statusElement.style.display = "block";
      statusDropdown.style.display = "none";
      updateButton.style.display = "block";
      submitButton.style.display = "none";
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="orders-container">
      <h2 className="orders-title">Orders</h2>
      <div className="statusFilter-dropdown">
        <div className="filter">
          <label htmlFor="statusFilter-select">Filter by Status:</label>
          <select
            id="statusFilter-select"
            name="statusFilter"
            value={statusFilter}
            onChange={filterOrders}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Placed At</th>
              <th>Updated At</th>
              <th>Status</th>
              <th>Details</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{timestampToDate(order.createdAt as number)}</td>
                <td>{timestampToDate((order.updatedAt ?? order.createdAt) as number)}</td>
                <td id={`S${order.id}`}>{order.status}</td>
                <td id={`SD${order.id}`} style={{ display: "none" }}>
                  <select
                    id={"status-select"}
                    name="status"
                    value={updatedStatus[order.id] ?? order.status}
                    onChange={(e) => handleStatusChange(e, order.id)}
                    style={{ marginTop: "25px" }}
                  >
                    <option value={order.status}>{order.status}</option>
                    {order.status === OrderStatus.PENDING && (
                      <option value={OrderStatus.PROCESSING}>Processing</option>
                    )}
                    <option value={OrderStatus.CANCELLED}>Cancelled</option>
                    <option value={OrderStatus.COMPLETED}>Completed</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => openOrderDetailsModal(order.id)} className="view-button">
                    View
                  </button>
                  <OrderDetailsModal order={order} />
                </td>
                {order.status === OrderStatus.PENDING &&
                  (user ?? {}).role === UserRole.CUSTOMER && (
                    <td>
                      <button className="cancel-button" onClick={() => cancelOrder(order.id)}>
                        Cancel
                      </button>
                    </td>
                  )}
                {(order.status === OrderStatus.PENDING ||
                  order.status === OrderStatus.PROCESSING) &&
                  (user ?? {}).role === UserRole.SELLER && (
                    <td>
                      <button
                        id={`update-${order.id}`}
                        className="update-button"
                        onClick={() => handleStatusUpdate(order.id)}
                      >
                        Update Status
                      </button>
                      <button
                        id={`submit-${order.id}`}
                        className="update-button"
                        style={{ display: "none" }}
                        onClick={() => updateStatus(order.id)}
                      >
                        Submit
                      </button>
                    </td>
                  )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomerOrders;
