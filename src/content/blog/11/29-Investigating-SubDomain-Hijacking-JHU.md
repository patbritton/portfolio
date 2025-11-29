---
title: "Apparent Subdomain Hijacking of Stripe.JHU.edu: A Case Study in DNS Vulnerability"
description: "Analysis of the technical indicators suggesting that the stripe.jhu.edu subdomain has been compromised and redirected to an unassociated spam blog."
pubDate: 2025-11-28
tags: ["Cybersecurity", "DNS", "Subdomain Hijacking", "Web Security"]
---

# 🚨 Apparent Subdomain Hijacking of Stripe.JHU.edu

The subdomain **`stripe.jhu.edu`**, previously hosting an expected institutional page, appears to have been compromised and redirected to an unauthorized external spam blog. This incident serves as a critical case study in how simple misconfigurations or breaches in DNS records can lead to serious security and reputational risks for large organizations.

### *Investigating the source of the compromised site:*

Tracing the current location of `stripe.jhu.edu` reveals that the content is being served from an external server at `134.122.123.175` not affiliated with JHU. This new website is being hosted on a DigitalOcean droplet, a common hosting provider for personal and small business websites.

## 1. The Core Problem: Unauthorized Redirection

The danger here is not simply defacement, but **Subdomain Hijacking**. This occurs when an unauthorized party gains control over the DNS settings for a specific subdomain, allowing them to point the traffic to a server they control.

For Johns Hopkins University (JHU), this specific compromise carries three major risks:
1.  **Reputation Damage:** The association of an institutional name with a spam/scam site.
2.  **Trust Erosion:** Diminishing trust in JHU’s ability to secure its core web presence.
3.  **Phishing Vector:** The trusted `jhu.edu` URL could be used to host malicious content or phishing pages targeted at students or staff.

## 2. The Evidence: Legitimate Site vs. Spam Blog

The contrast between the intended content and the compromised content is stark, pinpointing the change in server control.

### Original Site (March 2025)

As recently as March of this year, the subdomain hosted the expected, older institutional page:
Original Site (March 2025):
![Screenshot of original stripe.jhu.edu site](https://mp.ls/patrick/stripe.png)

### Current Compromised Site

The current destination for `stripe.jhu.edu` is a poorly structured, unrelated spam blog. The content, aesthetics, and theme are completely inconsistent with JHU’s branding or technical infrastructure.

![Screenshot of original stripe.jhu.edu site](https://mp.ls/patrick/fakestripe.png)


## 3. The Technical Mechanism: DNS Record Vulnerability

The appearance of entirely new content (a spam blog) strongly suggests that the issue is not malicious code *on* a JHU server, but rather a change in the public DNS records.

The likely scenario is:
1.  **Unauthorized Access:** An external party gained login credentials to a **DNS registrar** or **JHU’s internal DNS zone file**.
2.  **Record Modification:** The attacker changed the **A record** or **CNAME record** for `stripe.jhu.edu` to point to a server IP address that they rent or control.
3.  **Content Serving:** The attacker then hosts their spam content on that external server, allowing them to effectively hijack the trusted JHU domain name for their own purposes.

The final site served is hosted on a server **not associated with JHU**, confirming a redirection event rather than an internal server breach.

## 4. Key Takeaways & Conclusion

This incident highlights the importance of securing external-facing infrastructure records, not just web application code.

* **DNS Protection:** All organizational DNS records require **Two-Factor Authentication (2FA)** for account access, strong, unique passwords, and stringent permission auditing.
* **Asset Inventory:** This is a classic example of an **unmonitored or forgotten subdomain** (an asset that fell outside the primary security scope), which is a common vector for attackers.