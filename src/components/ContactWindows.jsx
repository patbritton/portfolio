import React, { useState, useRef } from 'react';
import { Send, X, Minus, Square, Mail, Loader2, RefreshCw } from 'lucide-react';
import '/src/styles/contact-window.css';

const ContactWindow = () => {
  const [status, setStatus] = useState(""); 
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("SENDING");

    const form = e.target;
    const data = new FormData(form);
    
    const response = await fetch("/api/send_email", {
      method: "POST",
      body: data,
    });

    if (response.ok) {
      setStatus("SUCCESS");
      form.reset();
    } else {
      setStatus("ERROR");
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
            <div className="input-group">
              <label>To:</label>
              <div className="fake-input">Patrick Britton &lt;patrick@mp.ls&gt;</div>
            </div>

            <div className="input-group">
              <label>From:</label>
              <input type="email" name="email" placeholder="your.email@example.com" required />
            </div>

            <div className="input-group">
              <label>Subject:</label>
              <select name="subject" required>
                <option value="" disabled selected>Choose a topic...</option>
                <option value="Hiring">🚀 Job Opportunity</option>
                <option value="Project">💡 Project Inquiry</option>
                <option value="Coffee">☕ Virtual Coffee</option>
                <option value="Other">👋 Just saying hi</option>
              </select>
            </div>

            <div className="editor-area">
              <textarea 
                name="message" 
                placeholder="Type your message here..." 
                required
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
