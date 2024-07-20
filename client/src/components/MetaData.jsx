import { memo } from "react";
import { Helmet } from "react-helmet";

const MetaData = ({ title = "" }) => {
  // Helps in adding text to the document head which helps in SEO
  return (
    <Helmet>
      <title>{title ? `Globemart | ${title}` : "Globemart"}</title>
    </Helmet>
  );
};

export default memo(MetaData);
