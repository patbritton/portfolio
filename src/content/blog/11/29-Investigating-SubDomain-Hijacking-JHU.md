---
title: "Apparent Subdomain Hijacking of Stripe.JHU.edu: A Case Study in DNS Vulnerability"
description: "Analysis of the technical indicators suggesting that the stripe.jhu.edu subdomain has been compromised and redirected to an unassociated spam blog."
pubDate: 2025-11-28
tags: ["Cybersecurity", "DNS", "Subdomain Hijacking", "Web Security"]
---

# Subdomain Hijacking of Stripe.JHU.edu

The subdomain **`stripe.jhu.edu`**, previously hosting an institutional page, appears to have been compromised and redirected to an unauthorized external spam blog. This incident serves as a critical case study in how simple misconfigurations or breaches in DNS records can lead to serious security and reputational risks for large organizations.

### *Investigating the source of the compromised site:*

Tracing the current location of `stripe.jhu.edu` reveals that the content is being served from an external server at `134.122.123.175` not affiliated with JHU. This new website is being hosted on a DigitalOcean droplet, a common hosting provider for personal and small business websites.

Performing a deep network scan confirmed a Subdomain Takeover vulnerability on stripe.jhu.edu, categorized as a high-severity security issue. The domain, historically tied to the JHU Synthesis and Translation of Research and Innovations in Polio Eradication project, currently resolves to an IP address (134.122.123.175) belonging to DigitalOcean, LLC (ASN 14061). This confirms that a Dangling DNS Record exists in the JHU DNS zone.

The vulnerability occurred because the original cloud server (a DigitalOcean droplet) associated with that IP was decommissioned, but the corresponding A record was never removed from the JHU DNS server. An external attacker was able to claim the newly available IP address and point it to their own server, effectively hijacking the trusted stripe.jhu.edu domain name. This allows the unauthorized party to host malicious or misleading content, such as the unrelated blog content currently being served, leveraging the established trust of the Johns Hopkins University brand. The immediate remediation is to delete the stripe.jhu.edu DNS record from the JHU authoritative name servers.


### Original Site (March 2025)

As recently as March of this year, the subdomain hosted the expected, older institutional page:
Original Site (March 2025):
![Screenshot of original stripe.jhu.edu site](https://mp.ls/patrick/stripe.png)

### Current Compromised Site

The current destination for `stripe.jhu.edu` is a poorly structured, unrelated spam blog. The content, aesthetics, and theme are completely inconsistent with JHU’s branding or technical infrastructure.

![Screenshot of original stripe.jhu.edu site](https://mp.ls/patrick/fakestripe.png)


## The Technical Mechanism: DNS Record Vulnerability

The appearance of entirely new content (a spam blog) strongly suggests that the issue is not malicious code *on* a JHU server, but rather a change in the public DNS records.


The likely scenario is:

1. **Original Provisioning:** The subdomain (formerly used for the JHU STRIPE project) originally pointed to a legitimate server IP address: `134.122.123.175`, which is owned by **DigitalOcean, LLC (ASN 14061)**.
2. **IP Reallocation:** JHU decommissioned the associated DigitalOcean server (the droplet) but **failed to delete the corresponding DNS record** from the `jhu.edu` zone file.
3. **Hacker Claim:** A malicious actor bought a new droplet on DigitalOcean that was subsequently assigned the now-available IP address (`134.122.123.175`).
4. **Content Hijack:** Because the DNS record still exists, the trusted **`stripe.jhu.edu`** name now resolves directly to the attacker's server, allowing them to host unauthorized content (spam/phishing) under the university's domain.

This requires **immediate remediation** by permanently deleting the outdated DNS record from the JHU authoritative name servers.