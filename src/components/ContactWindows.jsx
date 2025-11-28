import React, { useState, useRef } from 'react';
import { Send, Paperclip, X, Minus, Square, Mail, Loader2, File } from 'lucide-react';
import '/src/styles/contact-window.css';

const ContactWindow = () => {
  const [status, setStatus] = useState(""); // "", "SENDING", "SUCCESS", "ERROR"
  const [attachment, setAttachment] = useState(null);
  const fileInputRef = useRef(null);

  // 1. Handle File Attachment Trigger
  const handleAttachClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setAttachment(e.target.files[0]);
    }
  };

  // 2. Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("SENDING"); // Show loading state immediately

    const form = e.target;
    const data = new FormData(form);
    
    // Connect to Formspree
const response = await fetch("/api/send_email", {
      method: "POST",
      body: data,
    });

    if (response.ok) {
      setStatus("SUCCESS");
      form.reset();
      setAttachment(null);
    } else {
      setStatus("ERROR");
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

      {/* Toolbar */}
      <div className="win11-toolbar">
        <button 
          className="send-btn" 
          form="email-form" 
          type="submit" 
          disabled={status === "SENDING"}
        >
          {status === "SENDING" ? (
            <><Loader2 size={16} className="spin" /> Sending...</>
          ) : (
            <><Send size={16} /> Send</>
          )}
        </button>

        <button className="attach-btn" onClick={handleAttachClick} type="button">
          <Paperclip size={16} /> Attach
        </button>
        
        {/* Hidden File Input */}
        <input 
          type="file" 
          name="attachment" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          style={{ display: 'none' }} 
        />
      </div>

      {/* Form Body */}
      <form id="email-form" className="win11-body" onSubmit={handleSubmit}>
        {status === "SUCCESS" ? (
          <div className="success-state">
            <div className="success-icon">✓</div>
            <h3>Sent Successfully</h3>
            <p>I'll get back to you shortly.</p>
            <button type="button" onClick={() => setStatus("")} className="reset-btn">
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

            {/* Attachment Indicator Area */}
            {attachment && (
              <div className="attachment-chip">
                <File size={14} /> 
                <span>{attachment.name}</span>
                <button type="button" onClick={() => setAttachment(null)}><X size={12} /></button>
              </div>
            )}

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
    </div>
  );
};

export default ContactWindow;