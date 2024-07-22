import { Suspense, lazy, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import DescriptionIcon from "@mui/icons-material/Description";
import { MdOutlineRateReview } from "react-icons/md";
import TabPanel from "../../Reviews/TabPanel";
import ProductFeatures from "./ProductFeatures";
import ErrorBoundaryComponent from "../../ErrorBoundary/ErrorBoundaryComponent";
import { wait } from "../../../utils/general/wait";
import SmallLoader from "../../UI/SmallLoader";
import useMediaQuery from "@mui/material/useMediaQuery";

const ProductReviews = lazy(() =>
  wait(500).then(() => import("./ProductReviews"))
);

const ProductExtraDetails = ({ description, productFeatures, productId }) => {
  // Keeps track of Product detail tabs
  const [tabValue, setTabValue] = useState(0);

  const matches = useMediaQuery("(max-width:500px)");

  const tabValueChangeHandler = (e, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <div>
        <Tabs
          value={tabValue}
          onChange={tabValueChangeHandler}
          indicatorColor="secondary"
          textColor="secondary"
          variant="fullWidth"
        >
          <Tab
            icon={<DescriptionIcon />}
            iconPosition="start"
            label="Description"
            sx={{
              fontFamily: "Inter",
              letterSpacing: "0px",
              borderBottom: "1px solid #d9dedb",
              fontSize: matches ? "0.8rem" : "14px",
            }}
          />
          <Tab
            icon={<MdOutlineRateReview className="text-[1.45rem]" />}
            iconPosition="start"
            label="Reviews"
            sx={{
              fontFamily: "Inter",
              letterSpacing: "0px",
              borderBottom: "1px solid #d9dedb",
              fontSize: matches ? "0.8rem" : "14px",
            }}
          />
        </Tabs>
      </div>

      {/* Displaying details like Product description, Product features */}
      <TabPanel value={tabValue} index={0}>
        <ProductFeatures
          description={description}
          productFeatures={productFeatures}
        />
      </TabPanel>

      {/* Displaying Product Reviews */}
      <TabPanel value={tabValue} index={1}>
        {/* Handling Synchronous errors in Product Reviews */}
        <ErrorBoundaryComponent errorMessage="Sorry, the product reviews are not available right now. Please check back later.">
          <Suspense
            fallback={
              <SmallLoader styleProp="flex items-center justify-center" />
            }
          >
            <ProductReviews productId={productId} />
          </Suspense>
        </ErrorBoundaryComponent>
      </TabPanel>
    </>
  );
};

export default ProductExtraDetails;
