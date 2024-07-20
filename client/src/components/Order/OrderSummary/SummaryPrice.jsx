import { memo } from "react";
import { formatCurrency } from "../../../utils/general/formatCurrency";

const SummaryPrice = ({ title, price, children }) => {
  return (
    <div className="flex items-center gap-4 justify-between">
      <p className="font-medium drop-shadow">{title}: </p>
      <p className="font-medium">
        {children ? children : formatCurrency(price)}
      </p>
    </div>
  );
};

export default memo(SummaryPrice);
