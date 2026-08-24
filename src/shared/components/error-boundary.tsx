import { Component, type ReactNode } from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  readonly children: ReactNode;
  readonly fallbackMessage?: string;
}

interface State {
  readonly hasError: boolean;
  readonly error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full items-center justify-center p-8">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-[var(--surface-rose)]">
                <AlertTriangle className="size-7 text-[var(--destructive)]" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Something went wrong</h2>
                <p className="text-sm text-muted-foreground">
                  {this.props.fallbackMessage ?? 'An unexpected error occurred. Please try again.'}
                </p>
              </div>
              {this.state.error && (
                <pre className="max-w-full overflow-auto rounded-lg bg-muted p-3 text-left text-xs text-muted-foreground">
                  {this.state.error.message}
                </pre>
              )}
              <Button onClick={this.handleReset} className="gap-2">
                <RefreshCw className="size-4" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
