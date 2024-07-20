const StatusStyle = ({ statusName = "" }) => {
  // Showing different styles based on orderStatusName
  return (
    <p
      className={`${
        statusName === "processing"
          ? "text-red-400 bg-red-100"
          : statusName === "shipped"
          ? "bg-orange-100 text-orange-500"
          : "text-green-600 bg-green-100"
      } px-3 py-1 rounded-full capitalize`}
    >
      {statusName}
    </p>
  );
};

export default StatusStyle;
