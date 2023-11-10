import "./AdminMessages.css";
import { useEffect, useState } from "react";
import { messageApi } from "../../api-helpers";
import { useNavigate } from "react-router-dom";
import { AdminMessageResponse } from "../../types/api-responses";

const AdminMessages = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<AdminMessageResponse[]>([]);

  const deleteMessage = async (messageId: string) => {
    if (!confirm("Are you sure you want to delete this message?")) {
      return;
    }

    try {
      const response = await messageApi.deleteMessage(
        messageId,
        localStorage.getItem("accessToken") as string
      );

      if (!response.status) {
        throw new Error("Server is not responding. Please try again later.");
      }

      setMessages(messages.filter((message) => message.id !== messageId));
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await messageApi.getMessages(
          localStorage.getItem("accessToken") as string
        );

        if (!response.status) {
          navigate("/");
        }

        if (!response.data) {
          throw new Error("Server is not responding. Please try again later.");
        }

        setMessages(response.data);
      } catch (error) {
        alert(error);
      }
    })();
  }, []);

  return (
    <div className="admin-messages">
      <h1>Contact Form Messages</h1>
      <div className="message-list">
        {messages.map((message) => (
          <div className="message" key={message.id}>
            <div>
              <h3>Name: {message.name}</h3>
              <p>Email: {message.email}</p>
              <p>Message: {message.message}</p>
            </div>
            <h3 className="delete-message" onClick={() => deleteMessage(message.id)}>
              &times;
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMessages;
