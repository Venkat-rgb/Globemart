import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ErrorFallback";

const ErrorBoundaryComponent = ({ errorMessage, children, styles }) => {
  const errorHandler = (error, info) => {
    console.log("Error boundary error: ", error);
    console.log("Error boundary info: ", info);
  };

  return (
    <ErrorBoundary
      fallbackRender={() => (
        <ErrorFallback styles={styles}>{errorMessage}</ErrorFallback>
      )}
      onError={errorHandler}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryComponent;
