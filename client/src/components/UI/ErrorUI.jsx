const ErrorUI = ({ message = "", styles = "" }) => {
  return (
    <div
      className={`font-inter flex items-center justify-center py-2 px-5 mx-auto bg-neutral-200/60 rounded-md ${styles}`}
    >
      <p className="text-center">
        {message ? message : "Something went wrong!"}
      </p>
    </div>
  );
};

export default ErrorUI;
