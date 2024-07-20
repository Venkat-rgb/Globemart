import { CircularProgress } from "@mui/material";

const SmallLoader = ({ styleProp = "", size = 30 }) => {
  // flex items-center justify-center h-1/2
  return (
    <div className={styleProp}>
      <CircularProgress
        sx={{
          color: "#aaa",
        }}
        size={size}
      />
    </div>
  );
};

export default SmallLoader;
