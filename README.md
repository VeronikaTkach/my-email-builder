# My Email Builder

A visual drag-and-drop email template editor built with Puck, React, and NestJS.

## Project Overview

**My Email Builder** allows users to assemble responsive email layouts by dragging and dropping preconfigured blocks (text, images, buttons, dividers) into a canvas. You can export the result as HTML and send a test email via SMTP (e.g., Mailtrap) directly from the interface.

### Key Features

* **Visual editor** with drag‑and‑drop support powered by Puck
* **Configurable properties** for each block (text content, image URL & alt text, button link)
* **Export clean HTML** optimized for email clients
* **Send test emails** through a NestJS backend and Mailtrap

## Technology Stack

* **Frontend**

  * React 18 & TypeScript
  * Vite
  * Tailwind CSS v4 (zero‑config)
  * Consta UI for layout and controls
  * Puck Editor (v0.17) for block composition

* **Backend**

  * NestJS (TypeScript)
  * @nestjs-modules/mailer & Nodemailer
  * SMTP (Mailtrap sandbox for testing)

## Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/my-email-builder.git
   cd my-email-builder
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Start the NestJS server** (in one terminal)

   ```bash
   npx ts-node server.ts
   ```
4. **Start the frontend** (in another terminal)

   ```bash
   npm run dev
   ```
5. **Open the editor**
   Navigate to [http://localhost:5173](http://localhost:5173) in your browser.

## Usage Guide

1. **Drag blocks** from the left panel onto the canvas.
2. **Edit properties** of each block in the right panel.
3. Click **Publish** to commit your changes into JSON state.
4. Click **Get HTML** to generate and preview the final HTML.
5. In the modal, enter a **recipient email** (any address) and click **Send** to test via Mailtrap.

## Future Roadmap

* Multi‑column and grid layouts for advanced designs
* Social media block with configurable icons and links
* Template management (save, load, delete) via backend API
* Integration with mass‑mailing services (SendGrid, Mailgun)
* Enhanced mobile responsiveness and testing views
* Support for Markdown and plain‑text export


