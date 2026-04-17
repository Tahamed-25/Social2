# **App Name**: Social-fit

## Core Features:

- User Authentication & Session Management: Allows users to Sign Up or Login using email and password, and Log Out. User data is stored temporarily in browser storage (local/session storage) for session persistence, resetting upon page refresh.
- Dynamic Video Feed: Displays a full-screen, vertically scrolling feed of short videos (9:16 aspect ratio). Videos auto-play and loop on scroll, with smooth infinite scrolling. Each video shows the uploader's username, caption, and dynamic counts for likes, comments, and shares.
- Interactive Video Controls: Enables users to like/unlike videos, add comments which display immediately, simulate sharing functionality with an alert, and follow/unfollow other users. All interactions are processed in temporary storage to feel responsive.
- User Profile Management: A dedicated user profile page displaying profile picture, username, customizable bio, follower/following counts, and a grid of the user's uploaded videos. Users can edit their profile details and upload a new profile picture.
- Video Upload System: Provides functionality for users to upload short videos directly from their device. Newly uploaded videos are immediately reflected in their profile and the main video feed.
- AI Caption Suggestion Tool: Integrates a tool to suggest creative and relevant captions for newly uploaded videos, utilizing generative AI to help users articulate their video's content and context.
- Dummy Data Initialization: Preloads the application with sample videos, fake user profiles, and random interaction counts to provide a realistic social media experience without requiring a backend database, with all data resetting on page refresh.

## Style Guidelines:

- The primary color is a vibrant coral/orange-red (#EE5B2B), chosen to convey energy, warmth, and dynamism suitable for a fitness-oriented social platform.
- The background color is a soft, warm off-white (#FAF7F6), providing a clean and bright canvas that enhances content visibility and supports a light UI scheme.
- An accent color of vivid magenta (#1F2937) is used to draw attention to interactive elements and important actions, creating a playful yet bold contrast.
- Headline and short text elements (e.g., usernames, counts): 'Poppins' (sans-serif) for its contemporary, precise, and eye-catching geometric style. Body text (e.g., captions, bio): 'Inter' (sans-serif) for its modern, legible, and objective neutrality, ensuring readability.
- Use a consistent set of minimal, clean-line SVG icons for interactive elements (like, comment, share, follow). Icons should be bold and easily recognizable, echoing contemporary social media aesthetics.
- Adopt a mobile-first responsive design, ensuring a seamless experience across devices. The video feed features full-screen 9:16 vertical videos, with interactive action buttons aligned vertically on the right side of the screen, similar to TikTok. Navigation is kept simple with prominent Home and Profile links.
- Implement smooth transitions and subtle micro-animations for interactions (like taps, comment additions, follow toggles) and seamless content loading during infinite scrolling. Animations should feel fluid and enhance user feedback without being distracting.