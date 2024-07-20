import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const RowActions = ({
  size = "medium",
  deleteHandler = () => {},
  route,
  id,
  isLoading = false,
  placeOfUse,
}) => {
  return (
    <div className="flex items-center gap-2">
      {/* Edit Button which redirects to specific route mentioned */}
      <Tooltip title="Edit" arrow TransitionComponent={Zoom}>
        <Link to={`${route}/${id}`}>
          <IconButton>
            <EditIcon fontSize={size} />
          </IconButton>
        </Link>
      </Tooltip>

      {/* Delete Button which will delete the specific row based on 'id' */}
      {placeOfUse !== "Orders" && (
        <Tooltip title="Delete" arrow TransitionComponent={Zoom}>
          <IconButton onClick={() => deleteHandler(id)} disabled={isLoading}>
            <DeleteIcon fontSize={size} />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
};

export default RowActions;
