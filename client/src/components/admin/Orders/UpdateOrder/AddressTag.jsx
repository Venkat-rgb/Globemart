const AddressTag = ({ title, value }) => {
  return (
    <p>
      <span className="text-neutral-500 font-semibold">{title} : </span>
      <span className="ml-2 text-sm text-neutral-400">{value}</span>
    </p>
  );
};

export default AddressTag;
