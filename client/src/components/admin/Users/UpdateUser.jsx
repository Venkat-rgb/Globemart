import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useEffect, useState } from "react";
import Layout from "../Layout";
import InputDivStyle from "../../../components/UI/InputDivStyle";
import MetaData from "../../MetaData";
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from "../../../redux/features/admin/usersApiSlice";
import { CircularProgress } from "@mui/material";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Button from "../../UI/Button";
import Loader from "../../UI/Loader";
import ErrorUI from "../../UI/ErrorUI";

const UpdateUser = () => {
  const { userId } = useParams();

  // Keeps track of selectedRole (user (or) admin)
  const [selectedRole, setSelectedRole] = useState("");

  const { userInfo } = useSelector((state) => state?.auth);

  // Fetching userData only when userId is present
  const {
    data: userData,
    isLoading: isUserDataLoading,
    isError: userDataError,
  } = useGetUserQuery(userId, {
    skip: !userId,
  });

  const [updateUser, { isLoading: isUpdateUserLoading }] =
    useUpdateUserMutation();

  // Updating the user role
  const updateUserHandler = async (e) => {
    e.preventDefault();

    // role should be different from current role of user and also id should be different so that admin can't change his own profile.
    try {
      // Updating user only when he changes his role
      if (
        selectedRole?.trim() &&
        userData?.user?.role !== selectedRole &&
        userInfo?.id !== userId
      ) {
        const res = await updateUser({ role: selectedRole, userId }).unwrap();

        toast.success(res?.message);
      } else if (userInfo?.id === userId) {
        // Here userInfo?.id and userId is admin only, so he can't change his own role
        toast.error(`Admin can't change his own role!`);
      }
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  // Storing new role in selectedRole state whenever user changes his role
  useEffect(() => {
    if (userData?.user?.role) {
      setSelectedRole(userData.user.role);
    }
  }, [userData?.user?.role]);

  // Displaying Loader if userData is loading
  if (isUserDataLoading) {
    return <Loader styleProp="flex items-center justify-center h-[90vh]" />;
  }

  return (
    <AnimatePresence>
      <Layout>
        <MetaData title="Dashboard | User | Update" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 0.15 }}
        >
          <div className="p-3 drop-shadow-xl bg-neutral-50 space-y-5 mx-auto my-20 rounded-lg max-w-md">
            <p className="font-public-sans text-2xl max-[500px]:text-xl text-neutral-500 text-center font-semibold">
              Update User
            </p>

            {/* Showing errMsg, if an error occured during fetching user's role  */}
            {userDataError && (
              <ErrorUI message="Unable to fetch user's role due to some error!" />
            )}

            <form
              onSubmit={updateUserHandler}
              className="font-public-sans w-full space-y-3"
            >
              {/* User role input */}
              <InputDivStyle>
                <AdminPanelSettingsIcon className="text-neutral-400" />
                <select
                  name="roles"
                  className="outline-none w-full px-3"
                  onChange={(e) => setSelectedRole(e.target.value)}
                  value={selectedRole ? selectedRole : "Choose Role"}
                >
                  <option disabled>Choose Role</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </InputDivStyle>

              <div>
                {/* Updating user button with loading values */}
                <Button isLoading={isUpdateUserLoading} moreStyles="w-full">
                  {isUpdateUserLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <p className="text-neutral-300 font-inter font-medium">
                        Updating User
                      </p>
                      <CircularProgress sx={{ color: "#cccccc" }} size={22} />
                    </div>
                  ) : (
                    "Update"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </Layout>
    </AnimatePresence>
  );
};

export default UpdateUser;
