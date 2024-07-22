import InputDivStyle from "../../../components/UI/InputDivStyle";
import lodash from "lodash";
import TitleIcon from "@mui/icons-material/Title";
import DescriptionIcon from "@mui/icons-material/Description";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import DiscountIcon from "@mui/icons-material/Discount";
import { motion } from "framer-motion";
import { productCategories } from "../../../utils/dashboard/productCategories";
import LazyImage from "../../LazyImage";

const ProductFormData = ({
  title,
  description,
  productFeatures,
  category,
  price,
  discount,
  stock,
  imgData,
  changeHandler,
}) => {
  return (
    <>
      {/* Product Title */}
      <InputDivStyle>
        <TitleIcon className="text-neutral-400" />
        <input
          type="text"
          name="title"
          placeholder="Product Title..."
          className="outline-none w-full px-4"
          value={title}
          required
          onChange={changeHandler}
        />
      </InputDivStyle>

      {/* Product Description */}
      <InputDivStyle>
        <DescriptionIcon className="text-neutral-400" />
        <textarea
          type="text"
          name="description"
          placeholder="Product Description..."
          className="outline-none px-4 w-full"
          value={description}
          rows={6}
          required
          onChange={changeHandler}
        />
      </InputDivStyle>

      {/* Product Features */}
      <InputDivStyle>
        <SaveAsIcon className="text-neutral-400" />
        <textarea
          type="text"
          name="productFeatures"
          placeholder="Type each product feature in new line..."
          className="outline-none px-4 w-full"
          value={productFeatures}
          rows={6}
          required
          onChange={changeHandler}
        />
      </InputDivStyle>

      {/* Product Categories */}
      <InputDivStyle>
        <CategoryIcon className="text-neutral-400" />
        <select
          name="category"
          onChange={changeHandler}
          className="outline-none w-full px-3"
          value={category ? category : "Choose Category"}
        >
          {productCategories.map((cat, i) => (
            <option value={cat} key={i} disabled={cat === "Choose Category"}>
              {lodash.capitalize(cat)}
            </option>
          ))}
        </select>
      </InputDivStyle>

      {/* Product Price */}
      <InputDivStyle>
        <AttachMoneyIcon className="text-neutral-400" />
        <input
          type="number"
          name="price"
          step={1}
          placeholder="Product Price..."
          className="outline-none px-4 w-full"
          value={price}
          required
          onChange={changeHandler}
        />
      </InputDivStyle>

      {/* Product Discount */}
      <InputDivStyle>
        <DiscountIcon className="text-neutral-400" />
        <input
          type="number"
          name="discount"
          step={1}
          placeholder="Product Discount (please enter number from 2-50)..."
          className="outline-none px-4 w-full"
          value={discount}
          required
          onChange={changeHandler}
        />
      </InputDivStyle>

      {/* Product Stock */}
      <InputDivStyle>
        <InventoryIcon className="text-neutral-400" />
        <input
          type="number"
          name="stock"
          min={1}
          step={1}
          placeholder="Product Stock..."
          className="outline-none px-4 w-full"
          value={stock}
          required
          onChange={changeHandler}
        />
      </InputDivStyle>

      {/* Allowing Multiple product images */}
      <div>
        <input
          type="file"
          className="hidden"
          id="fileInput"
          name="images"
          multiple
          accept="image/*"
          onChange={changeHandler}
        />
      </div>
      <div>
        <motion.div
          onClick={() => {
            document.getElementById("fileInput").click();
          }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center flex-wrap gap-6 px-2 py-3"
        >
          {!imgData.length && (
            <div className="flex items-center gap-4">
              <InsertPhotoIcon className="text-neutral-400" />
              <p>Choose Avatar</p>
            </div>
          )}

          {imgData?.map((image, i) => (
            <div className="w-20 h-20" key={i}>
              <LazyImage
                imageProps={{
                  src: image?.url || image,
                  alt: `image-${i}`,
                }}
                styleProp="drop-shadow-md rounded-lg border"
                skeletonWidth={80}
                skeletonHeight={80}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default ProductFormData;
