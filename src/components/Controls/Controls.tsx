import Loader from "../Loader";

type ControlsProps = {
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onLoadMore: () => void;
};

function Controls({ loading, error, onRetry, onLoadMore }: ControlsProps) {
  return (
    <div className="controls">
      <Loader loading={loading} />
      {error && (
        <div className="error">
          <span>{error}</span>
          <button onClick={onRetry} disabled={loading} className="controls-btn">
            Retry
          </button>
        </div>
      )}
      <button onClick={onLoadMore} disabled={loading} className="controls-btn">
        Load more
      </button>
    </div>
  );
}

export default Controls;
