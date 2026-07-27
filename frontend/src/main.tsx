import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProviders } from '@/app/providers/AppProviders';
import { AppRouter } from '@/app/router/AppRouter';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';
import { CartProvider } from '@/features/cart/CartContext';
import '@/assets/css/index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Application root element was not found');

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary>
      <AppProviders>
        <CartProvider>
          <AppRouter />
        </CartProvider>
      </AppProviders>
    </ErrorBoundary>
  </StrictMode>,
);
