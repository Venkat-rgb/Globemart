import Input from "../../UI/Input";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const OrderInfoForm = ({
  shippingDetails,
  shippingDetailsChangeHandler,
  setShippingDetails,
  formattedCountries,
  formattedStates,
  formattedCities,
}) => {
  return (
    <form className="space-y-5">
      <Input
        title="Full Name"
        inputData={{
          type: "text",
          name: "fullName",
          id: "fullName",
          value: shippingDetails.fullName,
          disabled: true,
        }}
      />

      <Input
        onChange={shippingDetailsChangeHandler}
        title="Your Address"
        inputData={{
          type: "text",
          name: "address",
          id: "address",
          value: shippingDetails.address,
          placeholder: "Enter your Home Address...",
          required: true,
        }}
      />

      <div className="flex items-center max-[600px]:flex-wrap gap-4">
        <div className="w-full">
          <div className="pb-1">Phone No*</div>
          <PhoneInput
            country={shippingDetails.phoneNo.countryCode.toLowerCase()}
            value={shippingDetails.phoneNo.phone}
            onChange={(newPhoneNo) =>
              setShippingDetails({
                ...shippingDetails,
                phoneNo: {
                  ...shippingDetails.phoneNo,
                  phone: `+${newPhoneNo}`,
                },
              })
            }
            countryCodeEditable={false}
            inputProps={{
              required: true,
            }}
            inputStyle={{ height: "2.35rem", width: "100%" }}
          />
        </div>

        <div className="w-full">
          <label>Your Country*</label>
          <Select
            className="pt-1"
            value={
              (shippingDetails.country?.label ||
                shippingDetails.country?.countryName) && {
                label:
                  shippingDetails.country?.label ||
                  shippingDetails.country?.countryName,
                value:
                  shippingDetails.country?.value ||
                  shippingDetails.country?.countryCode,
              }
            }
            placeholder="Select your country..."
            options={formattedCountries}
            onChange={(country) =>
              setShippingDetails({ ...shippingDetails, country })
            }
            required
          />
        </div>
      </div>

      <div className="flex items-center gap-4 max-[600px]:flex-wrap justify-between">
        <div className="w-full">
          <label>Your State*</label>
          <Select
            className="pt-1"
            placeholder="Select your state..."
            options={formattedStates}
            value={
              (shippingDetails.state?.label ||
                shippingDetails.state?.stateName) && {
                label:
                  shippingDetails.state?.label ||
                  shippingDetails?.state?.stateName,
                value:
                  shippingDetails.state?.value ||
                  shippingDetails?.state?.stateCode,
              }
            }
            onChange={(state) =>
              setShippingDetails({ ...shippingDetails, state })
            }
            required
          />
        </div>

        <div className="w-full">
          <label>Your City*</label>
          <Select
            className="pt-1"
            placeholder="Select your city..."
            options={formattedCities}
            value={
              (shippingDetails.city?.label || shippingDetails?.city) && {
                label: shippingDetails.city?.label || shippingDetails?.city,
              }
            }
            required
            onChange={(city) =>
              setShippingDetails({ ...shippingDetails, city })
            }
          />
        </div>
      </div>
    </form>
  );
};

export default OrderInfoForm;
