import { useRef } from "react";
import { useInView } from "framer-motion";
import { benefitCategories } from "../../utils/general/benefitsCategories";
import BenefitItem from "./BenefitItem";
import { memo } from "react";

const Benefits = () => {
  const ref = useRef(null);

  // Keeps track of when to show Benefit card items based on their intersection with viewport
  const isInView = useInView(ref, { once: true });

  return (
    <section className="space-y-7">
      <p className="font-public-sans font-semibold text-2xl text-neutral-600 drop-shadow max-[550px]:text-xl">
        Benefits
      </p>

      {/* Displaying all the Benefits of the ecommerce */}
      <div
        ref={ref}
        className="grid grid-cols-3 max-[1024px]:grid-cols-2 max-[640px]:grid-cols-1 gap-4 items-start w-full"
      >
        {/* Showing Benefit items only when they are in view with viewport */}
        {isInView &&
          benefitCategories?.map((benefit, i) => (
            <BenefitItem
              key={i}
              i={i}
              title={benefit.title}
              desc={benefit.desc}
              icon={benefit.icon}
              backgroundColor={benefit.backgroundColor}
            />
          ))}
      </div>
    </section>
  );
};

export default memo(Benefits);
