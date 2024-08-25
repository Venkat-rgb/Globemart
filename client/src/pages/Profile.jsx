import { motion } from "framer-motion";
import { FiEdit } from "react-icons/fi";
import { Button, MetaData, Loader } from "../components";
import { Link, Outlet } from "react-router-dom";
import { useGetProfileQuery } from "../redux/features/profile/profileApiSlice";
import { useGetCustomerAddressQuery } from "../redux/features/userAddress/userAddressApiSlice";
import ProfileOverlay from "../components/Profile/ProfileOverlay";
import ProfileFormat from "../components/Profile/ProfileFormat";
import ErrorUI from "../components/UI/ErrorUI";

const Profile = () => {
  // Fetching customer personal data
  const {
    data: userData,
    isFetching: isGettingProfileData,
    isError: profileDataError,
  } = useGetProfileQuery();

  // Fetching customer's address
  const {
    data: customerAddress,
    isFetching: isGettingCustomerAddress,
    isError: customerAddressError,
  } = useGetCustomerAddressQuery();

  // Calculating date when customer created account and registered on website
  const registeredDate = new Date(
    userData?.user && userData?.user?.createdAt
  ).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const customerPersonalDetails = [
    {
      title: "Username",
      value: userData?.user?.username,
    },
    {
      title: "Email",
      value: userData?.user?.email,
    },
    {
      title: "Registered On",
      value: registeredDate,
    },
  ];

  const customerAddressDetails = [
    {
      title: "Country",
      value: `${customerAddress?.address?.country?.countryName} (${customerAddress?.address?.country?.countryCode})`,
    },
    {
      title: "State",
      value: `${customerAddress?.address?.state?.stateName} (${customerAddress?.address?.state?.stateCode})`,
    },
    {
      title: "City",
      value: customerAddress?.address?.city,
    },
    {
      title: "Address",
      value: customerAddress?.address?.address,
    },
    {
      title: "Phone No",
      value: customerAddress?.address?.phoneNo?.phone,
    },
  ];

  // Showing Loader while customer data, address are loading
  if (isGettingProfileData || isGettingCustomerAddress) {
    return <Loader styleProp="flex items-center justify-center h-[80vh]" />;
  }

  return (
    <div className="space-y-24">
      <MetaData title="Profile" />
      {/* Customer Personal Details */}
      <ProfileOverlay placeOfUse="profile" image={userData?.user?.profileImg} />
      <div className="max-w-2xl mx-auto space-y-5 flex items-center flex-col font-inter pb-10 px-4">
        <div className="grid grid-cols-2 max-[640px]:grid-cols-1 w-full gap-4">
          {/* Showing errorMsg, if an error occured during fetching profile data */}
          {profileDataError && (
            <ErrorUI message="Unable to fetch profile data!" />
          )}

          {!profileDataError &&
            customerPersonalDetails?.map((detail) => (
              <ProfileFormat
                key={detail?.title}
                title={detail?.title}
                value={detail?.value}
              />
            ))}

          {/* Customer Address details */}
          {!customerAddressError && customerAddress?.address && (
            <>
              {customerAddressDetails?.map((detail) => (
                <ProfileFormat
                  key={detail?.title}
                  title={detail?.title}
                  value={detail?.value}
                />
              ))}
            </>
          )}
        </div>

        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            to="password/update"
            state={{
              profileImg: userData?.user?.profileImg,
            }}
          >
            <Button moreStyles="w-full">Change Password</Button>
          </Link>
        </motion.div>

        <motion.div
          className="w-full shadow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link to="edit" state={userData}>
            <Button moreStyles="w-full gap-4">
              <div className="flex-shrink-0">
                <FiEdit className="text-[#f1f1f1]" />
              </div>
              <p>Edit Profile</p>
            </Button>
          </Link>
        </motion.div>
      </div>
      <Outlet />
    </div>
  );
};

export default Profile;
