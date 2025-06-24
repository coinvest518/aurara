# Frontend Design and Layout Documentation

## Overview
This document captures the design and layout principles for the Aurarora AI Companion frontend. It serves as a reference to ensure consistency and to document what is working well.

---

## General Layout Principles
- **Root Container**:
  - Use `min-h-screen` for the root container to ensure it spans at least the full viewport height.
  - Avoid using `h-screen` unless the content must strictly fit within the viewport.
  - Use `bg-gradient-to-br` for a smooth background gradient.

- **Flexbox and Grid**:
  - Use `flex` and `flex-col` for vertical stacking of elements.
  - Use `grid` for complex layouts requiring multiple columns.

- **Overflow Handling**:
  - Avoid `overflow-hidden` unless necessary to prevent content clipping.

---

## Header and Footer
- **Header**:
  - Sticky header with `sticky top-0 z-50` to keep it visible during scrolling.
  - Use `bg-white/80` and `backdrop-blur-sm` for a translucent effect.
  - Include navigation links and a settings button.

- **Footer**:
  - Positioned at the bottom using `mt-auto`.
  - Use `bg-white/80` and `backdrop-blur-sm` for consistency with the header.

---

## Main Content
- **Landing Page**:
  - Ensure it occupies the full screen using `h-screen`.
  - Center content with `flex` and `justify-center`.

- **Dashboard**:
  - Use `flex-1` for the main content area to share space with sidebars.
  - Limit width with `max-w-7xl` and center using `mx-auto`.

- **Video Screen**:
  - Ensure the `VideoAgent` component can expand fully by using `h-full` and `w-full`.
  - Avoid unnecessary constraints like `overflow-hidden`.

---

## Modals
- **Settings Modal**:
  - Use `fixed inset-0 z-50` for full-screen overlay.
  - Center the modal with `flex items-center justify-center`.
  - Use `bg-black bg-opacity-40` for a translucent background.

- **Companions Modal**:
  - Similar to the settings modal but with a larger width (`max-w-4xl`).

---

## Sidebars
- **Left Sidebar**:
  - Use `flex` for vertical stacking of persona selection.
  - Highlight the selected persona with `bg-blue-200`.

- **Right Sidebar**:
  - Display mood history and user information.
  - Use `space-y-6` for consistent spacing between sections.

---

## Components
- **VideoAgent**:
  - Handles video and audio toggles, fullscreen mode, and end call functionality.
  - Ensure it integrates seamlessly with the `ConversationInterface`.

- **MoodTracker**:
  - Positioned above the video agent.
  - Use `flex justify-center` for alignment.

- **StatusIndicator**:
  - Display connection and conversation status.
  - Use `text-sm` for compact information display.

---

## Styling
- **Colors**:
  - Use Tailwind's `bg-gradient-to-br` for backgrounds.
  - Text colors: `text-slate-800` for headings, `text-slate-600` for descriptions.

- **Spacing**:
  - Use `px-4`, `py-8`, and `space-y-6` for consistent padding and spacing.

- **Typography**:
  - Headings: `text-2xl font-bold`.
  - Descriptions: `text-sm` with `opacity-75`.

---

## Working Features
- **Landing Page**:
  - Full-screen layout with centered content.

- **Dashboard**:
  - Responsive layout with sidebars and main content.

- **Modals**:
  - Properly centered and responsive.

- **VideoAgent**:
  - Fully functional with video, audio, and fullscreen controls.

---

## Notes
- Avoid unnecessary constraints like `overflow-hidden` unless required.
- Ensure all components are responsive and adapt to different screen sizes.
- Use Tailwind's utility classes for consistent styling.

---

This document should be updated whenever significant changes are made to the frontend design or layout.
