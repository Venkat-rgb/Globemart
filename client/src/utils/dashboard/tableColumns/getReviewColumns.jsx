import { IconButton, Tooltip, Zoom } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import RowImage from "../../../components/UI/RowImage";

// Table columns for Managing Product Reviews
export const getReviewColumns = (
  isDeleteReviewLoading,
  deleteReviewHandler
) => {
  const columns = [
    {
      field: "_id",
      headerName: "Review ID",
      width: 240,
    },
    {
      field: `username`,
      headerName: "Username",
      width: 200,
      renderCell: (params) => {
        return (
          <RowImage
            title={params?.row?.user?.customerName}
            image={params?.row?.user?.customerProfileImg?.url}
          />
        );
      },
    },
    {
      field: "review",
      headerName: "Review",
      minWidth: 520,
    },
    {
      field: "rating",
      headerName: "Rating",
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => {
        return (
          <div>
            <Tooltip title="Delete" arrow TransitionComponent={Zoom}>
              <IconButton
                onClick={() => deleteReviewHandler(params?.row?._id)}
                disabled={isDeleteReviewLoading}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return columns;
};
