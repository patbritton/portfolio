import React, { useState, useRef } from 'react';
import { Send, X, Minus, Square, Mail, Loader2, RefreshCw } from 'lucide-react';
import '/src/styles/contact-window.css';

const ContactWindow = () => {
  const [status, setStatus] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const formRef = useRef(null);

  // Fetch CSRF token on component mount
  React.useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("/api/send_email");
        const data = await response.json();
        setCsrfToken(data.token);
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
        setErrorMessage("Security token failed to load. Please refresh the page.");
      }
    };
    fetchToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("SENDING");
    setErrorMessage("");

    const form = e.target;
    const data = new FormData(form);

    // Add CSRF token to form data
    data.append('csrf_token', csrfToken);

    const response = await fetch("/api/send_email", {
      method: "POST",
      body: data,
    });

    const result = await response.json();

    if (response.ok) {
      setStatus("SUCCESS");
      form.reset();
      // Fetch new CSRF token for next submission
      const tokenResponse = await fetch("/api/send_email");
      const tokenData = await tokenResponse.json();
      setCsrfToken(tokenData.token);
    } else {
      setStatus("ERROR");
      setErrorMessage(result.error || "Failed to send message. Please try again.");
    }
  };

  const handleReset = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  return (
    <div className="win11-window">

      {/* Header */}
      <div className="win11-header">
        <div className="win11-title">
          <Mail size={16} className="app-icon" />
          <span>New Message</span>
        </div>

        <div className="win11-controls">
          <div className="control-btn minimize"><Minus size={14} /></div>
          <div className="control-btn maximize"><Square size={12} /></div>
          <div className="control-btn close"><X size={14} /></div>
        </div>
      </div>

      {/* Form Body */}
      <form 
        id="email-form"
        className="win11-body"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        {status === "SUCCESS" ? (
          <div className="success-state">
            <div className="success-icon">✓</div>
            <h3>Sent Successfully</h3>
            <p>I'll get back to you shortly.</p>

            <button
              type="button"
              onClick={() => setStatus("")}
              className="reset-btn"
            >
              Write Another
            </button>
          </div>
        ) : (
          <>
            {errorMessage && (
              <div style={{
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: '#fee',
                border: '1px solid #fcc',
                borderRadius: '4px',
                color: '#c00'
              }}>
                {errorMessage}
              </div>
            )}

            <div className="input-group">
              <label>To:</label>
              <div className="fake-input">Patrick Britton &lt;patrick@mp.ls&gt;</div>
            </div>

            <div className="input-group">
              <label>From:</label>
              <input type="email" name="email" placeholder="your.email@example.com" required maxLength="254" />
            </div>

            <div className="input-group">
              <label>Subject:</label>
              <input type="text" name="subject" placeholder="Brief subject line" required maxLength="200" />
            </div>

            <div className="input-group">
              <label>Reason:</label>
              <select name="reason" required>
                <option value="" disabled selected>Choose a topic...</option>
                <option value="Job Opportunity">🚀 Job Opportunity</option>
                <option value="Project">💡 Project Inquiry</option>
                <option value="Collaboration">🤝 Collaboration</option>
                <option value="General">👋 General Inquiry</option>
                <option value="Other">💬 Other</option>
              </select>
            </div>

            <div className="editor-area">
              <textarea
                name="message"
                placeholder="Type your message here..."
                required
                maxLength="5000"
              ></textarea>
            </div>
          </>
        )}
      </form>

      {/* Bottom Toolbar */}
      <div className="win11-toolbar">
        <button className="reset-btn" onClick={handleReset} type="button">
          <RefreshCw size={16} /> Reset
        </button>

        <button 
          className="send-btn" 
          form="email-form" 
          type="submit" 
          disabled={status === "SENDING"}
        >
          {status === "SENDING" ? (
            <>
              <Loader2 size={16} className="spin" /> Sending...
            </>
          ) : (
            <>
              <Send size={16} /> Send
            </>
          )}
        </button>
      </div>

    </div>
  );
};

export default ContactWindow;
