const Input = ({ onChange = () => {}, title = "", inputData }) => {
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={inputData?.id}>{title}*</label>
      <input
        {...inputData}
        onChange={onChange}
        className="outline-none border border-neutral-300 text-sm py-2 px-3 rounded-tr-md rounded-bl-md focus:ring-1 focus:ring-offset-0 ring-black/50"
      />
    </div>
  );
};

export default Input;
