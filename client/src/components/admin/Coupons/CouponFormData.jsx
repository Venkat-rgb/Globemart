import InputDivStyle from "../../../components/UI/InputDivStyle";
import DiscountIcon from "@mui/icons-material/Discount";
import CelebrationIcon from "@mui/icons-material/Celebration";
import AlarmAddIcon from "@mui/icons-material/AlarmAdd";
import AutoDeleteIcon from "@mui/icons-material/AutoDelete";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

const CouponFormData = ({
  role,
  couponCode,
  occasionName,
  startDate,
  endDate,
  discount,
  couponStatus,
  previousCouponStatus,
  couponChangeHandler,
}) => {
  return (
    <>
      {/* Coupon code */}
      <InputDivStyle>
        <DiscountIcon className="text-neutral-400" />
        <input
          type="text"
          name="couponCode"
          placeholder="Coupon Code..."
          className="outline-none w-full px-4"
          value={couponCode}
          required
          onChange={couponChangeHandler}
        />
      </InputDivStyle>

      {/* Coupon Occasion name */}
      <InputDivStyle>
        <CelebrationIcon className="text-neutral-400" />
        <input
          type="text"
          name="occasionName"
          placeholder="Occasion Name..."
          className="outline-none w-full px-4"
          value={occasionName}
          required
          onChange={couponChangeHandler}
        />
      </InputDivStyle>

      {/* Coupon Start Date */}
      <div className="flex items-center justify-between max-[500px]:flex-wrap gap-4">
        <div className="space-y-1.5 w-full">
          <label htmlFor="startDate" className="text-neutral-400">
            Coupon Start Date
          </label>

          <InputDivStyle>
            <AlarmAddIcon className="text-neutral-400" />
            <input
              id="startDate"
              type="date"
              name="startDate"
              className="outline-none w-full px-4 placeholder:text-neutral-400"
              value={
                startDate && new Date(startDate).toLocaleDateString("en-CA")
              }
              required
              onChange={couponChangeHandler}
            />
          </InputDivStyle>
        </div>

        {/* Coupon End Date */}

        <div className="space-y-1.5 w-full">
          <label htmlFor="endDate" className="text-neutral-400">
            Coupon End Date
          </label>

          <InputDivStyle>
            <AutoDeleteIcon className="text-neutral-400" />
            <input
              id="endDate"
              type="date"
              name="endDate"
              className="outline-none w-full px-4 placeholder:text-neutral-400"
              value={endDate && new Date(endDate).toLocaleDateString("en-CA")}
              required
              onChange={couponChangeHandler}
            />
          </InputDivStyle>
        </div>
      </div>

      {/* Coupon Discount */}
      <InputDivStyle>
        <LocalOfferIcon className="text-neutral-400" />
        <input
          type="number"
          name="discount"
          placeholder="Discount..."
          className="outline-none w-full px-4"
          value={discount}
          required
          onChange={couponChangeHandler}
        />
      </InputDivStyle>

      {/* Here previousCouponStatus is couponStatus which is stored in database already before updating below */}
      {/* If couponStatus is expired then unmounting the select box */}
      {previousCouponStatus !== "expired" && role !== "Create" && (
        <InputDivStyle>
          <PendingActionsIcon className="text-neutral-400" />

          <select
            name="couponStatus"
            className="outline-none w-full px-3"
            value={couponStatus ? couponStatus : "Choose Status"}
            onChange={couponChangeHandler}
          >
            <option value="Choose Status" disabled>
              Choose Status
            </option>
            <option value="inactive">Inactive</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
        </InputDivStyle>
      )}
    </>
  );
};

export default CouponFormData;
