import MetaData from "../../MetaData";
import Layout from "../Layout";
import { motion } from "framer-motion";
import CouponFormData from "./CouponFormData";
import { CircularProgress } from "@mui/material";
import {
  useCreateCouponMutation,
  useGetCouponQuery,
  useUpdateCouponMutation,
} from "../../../redux/features/coupons/couponApiSlice";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import lodash from "lodash";
import toast from "react-hot-toast";
import Button from "../../UI/Button";
import Loader from "../../UI/Loader";
import ErrorUI from "../../UI/ErrorUI";

const CreateAndUpdateCoupon = ({ role }) => {
  const { couponId } = useParams();

  // Coupon form details
  const [couponDetails, setCouponDetails] = useState({
    couponCode: "",
    occasionName: "",
    startDate: "",
    endDate: "",
    discount: "",
    couponStatus: "",
  });

  const {
    couponCode,
    occasionName,
    startDate,
    endDate,
    discount,
    couponStatus,
  } = couponDetails;

  // Only fetch data when we want to update coupon and not while creating new coupon
  const {
    data: couponData,
    isFetching: isCouponLoading,
    isError: couponError,
  } = useGetCouponQuery(couponId, {
    skip: !couponId,
  });

  const [createCoupon, { isLoading: isCreatingCouponLoading }] =
    useCreateCouponMutation();

  const [updateCoupon, { isLoading: isUpdatingCouponLoading }] =
    useUpdateCouponMutation();

  // Sets the data for input fields in the form
  const couponChangeHandler = (e) => {
    // Making sure to convert discount input field into number
    if (e.target.name === "discount") {
      setCouponDetails({
        ...couponDetails,
        [e.target.name]: Number(e.target.value),
      });
    } else {
      setCouponDetails({ ...couponDetails, [e.target.name]: e.target.value });
    }
  };

  const createOrUpdateCouponHandler = async (e) => {
    e.preventDefault();
    try {
      // Current coupon details from input fields
      const toBeUpdatedCouponInfo = {
        couponCode,
        occasionName,
        startDate: new Date(
          new Date(startDate).setHours(0, 0, 0, 0)
        ).toISOString(),
        endDate: new Date(
          new Date(endDate).setHours(23, 59, 59, 59)
        ).toISOString(),
        discount,
        couponStatus,
      };

      // Previous Coupon details from database before updating 'form' values
      const previousCouponInfo = {
        couponCode: couponData?.coupon?.couponCode,
        occasionName: couponData?.coupon?.occasionName,
        startDate: couponData?.coupon?.startDate,
        endDate: couponData?.coupon?.endDate,
        discount: couponData?.coupon?.discount,
        couponStatus: couponData?.coupon?.couponStatus,
      };

      if (role === "Update") {
        // Updating Existing Coupon

        // Making API request to update coupon only when couponData is not changed
        if (!lodash.isEqual(toBeUpdatedCouponInfo, previousCouponInfo)) {
          const couponUpdateRes = await updateCoupon({
            couponId,
            couponInfo: {
              ...toBeUpdatedCouponInfo,
              currentDate: new Date(
                new Date().setHours(0, 0, 0, 0)
              ).toISOString(),
            },
          }).unwrap();

          // Displaying 'coupon updated successfully' message using toast
          toast.success(couponUpdateRes?.message);
        }
      } else {
        // Creating New Coupon
        // Dont need to send couponStatus

        const createCouponRes = await createCoupon({
          couponCode,
          occasionName,
          startDate: new Date(
            new Date(startDate).setHours(0, 0, 0, 0)
          ).toISOString(),
          endDate: new Date(
            new Date(endDate).setHours(23, 59, 59, 59)
          ).toISOString(),
          currentDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
          discount,
        }).unwrap();

        // Displaying 'coupon created successfully' message using toast
        toast.success(createCouponRes?.message);

        // Resetting input fields of form
        setCouponDetails({
          couponCode: "",
          occasionName: "",
          startDate: "",
          endDate: "",
          discount: "",
          couponStatus: "",
        });
      }
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  // Storing the couponData from the database into couponDetails state only during updation of coupon
  useEffect(() => {
    if (couponData?.coupon) {
      setCouponDetails({
        couponCode: couponData.coupon?.couponCode,
        occasionName: couponData.coupon?.occasionName,
        startDate: couponData.coupon?.startDate,
        endDate: couponData.coupon?.endDate,
        discount: couponData.coupon?.discount,
        couponStatus: couponData.coupon?.couponStatus,
      });
    }
  }, [couponData?.coupon]);

  // Displaying Loading screen while coupons are being fetched
  if (isCouponLoading) {
    return <Loader styleProp="flex items-center justify-center h-[90vh]" />;
  }

  return (
    <Layout>
      <MetaData
        title={`Dashboard | Coupon | ${
          role === "Create" ? "Create" : "Update"
        }`}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: 0.15 }}
      >
        <div className="p-3 drop-shadow-xl bg-neutral-50 space-y-5 rounded-lg mx-auto max-w-2xl my-10">
          <p className="font-public-sans text-2xl max-[500px]:text-xl text-neutral-500 text-center font-semibold">
            {role === "Create" ? "Create Coupon" : "Update Coupon"}
          </p>

          {/* Showing errMsg, if an error occured during fetching existing coupon details */}
          {couponError && (
            <ErrorUI message="Unable to fetch coupon details due to some error!" />
          )}

          <form
            onSubmit={createOrUpdateCouponHandler}
            className="font-inter w-full space-y-4"
          >
            {/* Contains all form input fields for coupon */}

            <CouponFormData
              role={role}
              couponCode={couponDetails.couponCode}
              occasionName={couponDetails.occasionName}
              startDate={couponDetails.startDate}
              endDate={couponDetails.endDate}
              discount={couponDetails.discount}
              couponStatus={couponDetails.couponStatus}
              previousCouponStatus={couponData?.coupon?.couponStatus}
              couponChangeHandler={couponChangeHandler}
            />

            {/* Create (or) Update coupon buttons with their loading values */}
            <div>
              <Button
                isLoading={
                  role === "Create"
                    ? isCreatingCouponLoading
                    : isUpdatingCouponLoading
                }
                moreStyles="w-full"
              >
                {(
                  role === "Create"
                    ? isCreatingCouponLoading
                    : isUpdatingCouponLoading
                ) ? (
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-neutral-300 font-medium">
                      {role === "Create"
                        ? "Creating Coupon"
                        : "Updating Coupon"}
                    </p>
                    <CircularProgress sx={{ color: "#cccccc" }} size={22} />
                  </div>
                ) : role === "Create" ? (
                  "Create"
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </Layout>
  );
};

export default CreateAndUpdateCoupon;
