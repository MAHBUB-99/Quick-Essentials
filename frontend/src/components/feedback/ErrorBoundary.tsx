import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/common/Button';

interface State {
  failed: boolean;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled application error', error, info);
  }

  render() {
    if (this.state.failed) {
      return (
        <main className="flex min-h-screen items-center justify-center p-6">
          <div className="max-w-lg text-center">
            <h1 className="text-3xl font-bold">FarmFresh hit an unexpected error</h1>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Your data is safe. Reload the app to try again.
            </p>
            <Button className="mt-6" onClick={() => window.location.reload()}>
              Reload Application
            </Button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
