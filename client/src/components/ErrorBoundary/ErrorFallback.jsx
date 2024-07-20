import { useErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";

const ErrorFallback = ({ children, styles = "" }) => {
  const { resetBoundary } = useErrorBoundary();
  const navigate = useNavigate();

  return (
    <div
      className={`p-10 mx-auto border rounded-xl w-full h-full font-inter flex flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-700 to-neutral-900 text-white ${styles}`}
    >
      <p className="text-center">{children}</p>
      <div className="flex items-center gap-4">
        <button
          className="text-black/90 bg-white/90 px-4 py-1 font-medium text-sm rounded"
          onClick={resetBoundary}
        >
          Retry
        </button>

        {/* Making sure that resetBoundary is called when we click go back, which will reset the error boundary of previous page and renders it without showing its own error boundary */}
        <button
          className="text-black/90 bg-white/90 px-3 py-1 font-medium text-sm rounded"
          onClick={() => {
            navigate(-1);
            setTimeout(() => {
              resetBoundary();
            }, 5);
          }}
        >
          Go back
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;
