import RowActions from "../../../components/UI/RowActions";
import RowImage from "../../../components/UI/RowImage";

// Table columns for Managing Users
export const getUserColumns = (isDeleteUserLoading, deleteUserHandler) => {
  const columns = [
    {
      field: "_id",
      headerName: "User ID",
      width: 240,
    },
    {
      field: "username",
      headerName: "Username",
      // flex: 1,
      minWidth: 280,
      renderCell: (params) => {
        return (
          <RowImage
            roundedFull="rounded-full"
            title={params?.row?.username}
            image={params?.row?.profileImg?.url}
          />
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      // flex: 1,
      minWidth: 400,
    },
    {
      field: "role",
      headerName: "Role",
      // flex: 0.4,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <p
            className={`${
              params?.row?.role === "user"
                ? "text-red-400 bg-red-100"
                : "text-green-600 bg-green-100"
            } px-3 py-1 rounded-full capitalize`}
          >
            {params?.row?.role}
          </p>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => {
        return (
          <RowActions
            route="/admin/user/update"
            deleteHandler={deleteUserHandler}
            id={params?.row?._id}
            isLoading={isDeleteUserLoading}
          />
        );
      },
    },
  ];

  return columns;
};
