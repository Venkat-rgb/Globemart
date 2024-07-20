import MetaData from "../../MetaData";
import { DataGrid } from "@mui/x-data-grid";
import { motion } from "framer-motion";
import Layout from "../Layout";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "../../../redux/features/admin/usersApiSlice";
import Loader from "../../UI/Loader";
import toast from "react-hot-toast";
import { getUserColumns } from "../../../utils/dashboard/tableColumns/getUserColumns";
import ErrorUI from "../../UI/ErrorUI";
import { useState } from "react";

const Users = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Fetching all usersData
  const {
    data: usersData,
    isLoading: isUsersDataLoading,
    isFetching: isUsersDataFetching,
    isError: usersDataError,
  } = useGetUsersQuery(paginationModel.page);

  const [deleteUser, { isLoading: isDeleteUserLoading }] =
    useDeleteUserMutation();

  // Making API request to delete user based on userID from database
  const deleteUserHandler = async (userId) => {
    try {
      // Deleting the user from database
      const res = await deleteUser(userId).unwrap();

      // Showing successfull deletion of user message using toast
      toast.success(res?.message);
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  //  Showing Loader while usersData is loading
  if (isUsersDataLoading) {
    return <Loader styleProp="flex items-center justify-center h-[90vh]" />;
  }

  return (
    <Layout>
      <motion.div
        className="h-full space-y-5"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{
          delay: 0.2,
        }}
      >
        <MetaData title="Dashboard | Users" />
        <p className="font-public-sans tracking-tight text-2xl max-[500px]:text-xl text-neutral-500 font-semibold drop-shadow text-center">
          All Users
        </p>

        {/* Showing errMsg, if an error occured during fetching users  */}
        {usersDataError && (
          <ErrorUI message="Unable to fetch users due to some error!" />
        )}

        {/* Displaying 10 users per page */}
        {!usersDataError && usersData?.totalUsersCount > 0 && (
          <DataGrid
            sx={{
              "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                outline: "none !important",
              },
              fontFamily: "Inter",
            }}
            rows={usersData?.users}
            getRowId={(row) => row._id}
            rowHeight={65}
            columns={getUserColumns(isDeleteUserLoading, deleteUserHandler)}
            // initialState={{
            //   pagination: {
            //     paginationModel: {
            //       page: 0,
            //       pageSize: 10,
            //     },
            //   },
            // }}
            loading={isUsersDataFetching}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10]}
            paginationMode="server"
            rowCount={usersData?.totalUsersCount}
            hideFooter={usersData?.totalUsersCount <= 10 ? true : false}
          />
        )}

        {/* Showing empty text when there are no users available in database */}
        {!usersDataError && usersData?.totalUsersCount === 0 && (
          <p className="text-center text-2xl max-[500px]:text-xl text-neutral-500 font-public-sans font-semibold">
            No Users have registered on your website yet!
          </p>
        )}
      </motion.div>
    </Layout>
  );
};

export default Users;

// import React, { useState } from "react";
// import MetaData from "../../MetaData";
// import { DataGrid } from "@mui/x-data-grid";
// import { motion } from "framer-motion";
// import Layout from "../Layout";
// import RowActions from "../RowActions";
// import StatusStyle from "../StatusStyle";
// import RowImage from "../RowImage";
// import {
//   useDeleteUserMutation,
//   useGetUsersQuery,
// } from "../../../redux/features/admin/usersApiSlice";
// import Loader from "../../Loader";
// import { toast } from "react-hot-toast";

// const Users = () => {
//   const { data: usersData, isLoading: isUsersDataLoading } = useGetUsersQuery();

//   const [deleteUser, { isLoading: isDeleteUserLoading }] =
//     useDeleteUserMutation();

//   console.log("admin usersData: ", usersData);

//   const deleteUserHandler = async (userId) => {
//     console.log(`Delete User with Id: ${userId}`);

//     try {
//       const res = await deleteUser(userId).unwrap();

//       console.log("delete user result: ", res);
//       toast.success(res?.message);
//     } catch (err) {
//       toast.error(err?.message || err?.data?.message);
//     }
//   };

//   const columns = [
//     {
//       field: "_id",
//       headerName: "User ID",
//       width: 240,
//     },
//     {
//       field: "username",
//       headerName: "Username",
//       // flex: 1,
//       minWidth: 280,
//       renderCell: (params) => {
//         return (
//           <RowImage
//             roundedFull="rounded-full"
//             title={params.row.username}
//             image={params.row?.profileImg?.url}
//           />
//         );
//       },
//     },
//     {
//       field: "email",
//       headerName: "Email",
//       // flex: 1,
//       minWidth: 400,
//     },
//     {
//       field: "role",
//       headerName: "Role",
//       // flex: 0.4,
//       minWidth: 100,
//       renderCell: (params) => {
//         return (
//           <p
//             className={`${
//               params.row?.role === "user"
//                 ? "text-red-400 bg-red-100"
//                 : "text-green-600 bg-green-100"
//             } px-3 py-1 rounded-full capitalize`}
//           >
//             {params.row?.role}
//           </p>
//         );
//       },
//     },
//     {
//       field: "actions",
//       headerName: "Actions",
//       renderCell: (params) => {
//         return (
//           <RowActions
//             route="/admin/user/update"
//             deleteHandler={deleteUserHandler}
//             id={params.row._id}
//             isLoading={isDeleteUserLoading}
//           />
//         );
//       },
//     },
//   ];

//   return (
//     <Layout>
//       <motion.div
//         className="h-full space-y-5"
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: -50 }}
//         transition={{
//           delay: 0.2,
//         }}
//       >
//         <MetaData title="Dashboard | Users" />
//         <p className="font-public-sans tracking-tight text-2xl text-neutral-500 font-semibold drop-shadow text-center">
//           All Users
//         </p>
//         {isUsersDataLoading && (
//           <Loader styleProp="flex items-center justify-center h-[90vh]" />
//         )}
//         {usersData?.users?.length > 0 && (
//           <DataGrid
//             sx={{
//               "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
//                 outline: "none !important",
//               },
//               fontFamily: "Inter",
//             }}
//             rows={usersData?.users}
//             getRowId={(row) => row._id}
//             rowHeight={65}
//             columns={columns}
//             initialState={{
//               pagination: {
//                 paginationModel: {
//                   page: 0,
//                   pageSize: 10,
//                 },
//               },
//             }}
//             pageSizeOptions={[10]}
//             hideFooter={usersData?.users?.length <= 10 ? true : false}
//           />
//         )}
//         {usersData?.users?.length === 0 && (
//           <p className="text-center text-2xl text-neutral-500 font-public-sans font-semibold">
//             No Users have registered on your website yet!
//           </p>
//         )}
//       </motion.div>
//     </Layout>
//   );
// };

// export default Users;
