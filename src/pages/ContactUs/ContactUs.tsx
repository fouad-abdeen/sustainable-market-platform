import { useState } from "react";
import { AdminMessageRequest } from "../../types/api-requests";
import "./ContactUs.css";
import { messageApi } from "../../api-helpers";

function ContactUs() {
  const [formData, setFormData] = useState<AdminMessageRequest>({} as AdminMessageRequest);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const submitMessage = async (event: React.MouseEvent) => {
    event.preventDefault();

    if (!confirm("Are you sure you want to submit this message?")) {
      return;
    }

    try {
      await messageApi.submitMessage(formData);

      setFormData({} as AdminMessageRequest);

      alert("Message sent successfully!");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <>
      <div>
        <h2>Contact Us</h2>
        <form>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name ?? ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email ?? ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message ?? ""}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" onClick={submitMessage}>
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
export default ContactUs;
