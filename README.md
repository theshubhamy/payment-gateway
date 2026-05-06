# SecurePay - Payment Gateway Simulation

A premium, responsive, and secure payment gateway UI built with Next.js 15 (App Router), TypeScript, and Tailwind CSS.

## 🚀 Features

-   **Real-time Validation**: Instant feedback for card number, expiry, CVV, and name.
-   **Live Card Preview**: Beautifully animated card that updates as you type.
-   **Smart Card Detection**: Automatically detects Visa, Mastercard, and Amex.
-   **Payment Lifecycle**: Handles Processing, Success, Failed, and Timeout states.
-   **Mock Gateway API**: Simulated server-side processing with randomized outcomes (60% Success, 25% Failure, 15% Timeout).
-   **Retry Logic**: Supports up to 3 retry attempts with the same idempotency key.
-   **Transaction History**: Persistent list of past transactions with detailed modal views.
-   **Responsive Design**: Fully optimized for mobile and desktop.
-   **Accessibility**: ARIA labels and focus management for a seamless experience.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Date Formatting**: [date-fns](https://date-fns.org/)

## 📦 Setup Instructions

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd payment-gateway
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Open in browser**:
    Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Assumptions & Rationale

-   **Zustand**: Chosen for its simplicity and low boilerplate compared to Redux, making it ideal for a focused assignment like this.
-   **Idempotency**: A `transactionId` is generated using `crypto.randomUUID()` on the frontend before the first attempt and reused for retries to ensure consistent history.
-   **Timeout Simulation**: The API route includes a deliberate 8-second delay for 15% of requests. The frontend uses `AbortController` to cancel the request after 6 seconds as per requirements.
-   **Persistence**: `localStorage` is used to persist the transaction history across page reloads.

## 🔮 Future Improvements

-   **Server-side Validation**: Implement comprehensive validation on the API route to ensure data integrity.
-   **Backend Persistence**: Move transaction history to a real database (e.g., PostgreSQL or MongoDB) instead of `localStorage`.
-   **Advanced Security**: Implement encryption for sensitive data before sending it to the server (even in simulation).
-   **Tests**: Add unit tests (Jest) for validation logic and E2E tests (Playwright) for the payment flow.
-   **Internationalization**: Add support for more currencies and languages.
-   **Animations**: Enhance transitions using Framer Motion for an even more premium feel.
